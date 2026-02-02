<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\MediaStorage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(name: 'app_media_')]
class MediaController extends AbstractController
{
    public function __construct(
        private readonly MediaStorage $mediaStorage,
    ) {
    }

    #[Route('/media', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('media/index.html.twig');
    }

    #[Route('/media/api/list', name: 'api_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        try {
            $path = (string) $request->query->get('path', '');
            $path = $this->sanitizePath($path);
            $typeFilter = $request->query->getString('type');
            $rawItems = $this->mediaStorage->listContents($path);
            $baseUrl = $request->getSchemeAndHttpHost() . $request->getBasePath();
            $items = array_map(function (array $item) use ($baseUrl): array {
                $isDir = $item['type'] === 'dir';
                $url = !$isDir
                    ? $baseUrl . $this->generateUrl('app_media_file', ['path' => $item['path']])
                    : '';
                $result = [
                    'id' => $item['path'],
                    'name' => $item['name'],
                    'path' => $item['path'],
                    'url' => $url,
                    'type' => $isDir ? 'directory' : ($item['type'] ?? 'file'),
                    'size' => $item['size'] ?? null,
                    'isFolder' => $isDir,
                ];
                if (!$isDir) {
                    try {
                        $result['mimeType'] = $this->mediaStorage->mimeType($item['path']);
                    } catch (\Throwable) {
                        $result['mimeType'] = 'application/octet-stream';
                    }
                }
                return $result;
            }, $rawItems);

            if ($typeFilter !== '' && $typeFilter !== 'all') {
                $items = array_values(array_filter($items, function (array $item) use ($typeFilter): bool {
                    if ($item['isFolder'] ?? false) {
                        return true;
                    }
                    $mime = $item['mimeType'] ?? '';
                    return match ($typeFilter) {
                        'image' => str_starts_with($mime, 'image/'),
                        'video' => str_starts_with($mime, 'video/'),
                        'audio' => str_starts_with($mime, 'audio/'),
                        'document' => $mime !== '' && !str_starts_with($mime, 'image/') && !str_starts_with($mime, 'video/') && !str_starts_with($mime, 'audio/'),
                        default => true,
                    };
                }));
            }

            return new JsonResponse(['items' => $items, 'path' => $path]);
        } catch (\Throwable $e) {
            return new JsonResponse(['error' => 'Erreur lors du chargement', 'message' => $e->getMessage()], 500);
        }
    }

    #[Route('/media/api/upload', name: 'api_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $path = (string) $request->request->get('path', '');
        $path = $this->sanitizePath($path);
        $file = $request->files->get('file');
        if (!$file) {
            $msg = 'Fichier manquant.';
            $contentType = $request->headers->get('Content-Type', '');
            if (str_contains($contentType, 'multipart/form-data') && (int) ($request->headers->get('Content-Length') ?? 0) > 0) {
                $msg = 'Fichier trop volumineux : augmentez upload_max_filesize et post_max_size dans php.ini.';
            }
            return new JsonResponse(['error' => $msg], 400);
        }
        if (!$file->isValid()) {
            $errorMsg = match ($file->getError()) {
                \UPLOAD_ERR_INI_SIZE, \UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux (upload_max_filesize / post_max_size).',
                \UPLOAD_ERR_PARTIAL => 'Upload interrompu.',
                \UPLOAD_ERR_NO_FILE => 'Aucun fichier envoyé.',
                default => 'Erreur d\'upload (code ' . $file->getError() . ').',
            };
            return new JsonResponse(['error' => $errorMsg], 400);
        }
        $name = $file->getClientOriginalName();
        if (preg_match('/[^a-zA-Z0-9._\-\s]/', $name)) {
            return new JsonResponse(['error' => 'Nom de fichier non autorisé'], 400);
        }
        $targetPath = $path !== '' ? $path . '/' . $name : $name;
        $realPath = $file->getRealPath();
        if ($realPath === false) {
            return new JsonResponse(['error' => 'Fichier temporaire indisponible'], 400);
        }
        $stream = fopen($realPath, 'r');
        if ($stream === false) {
            return new JsonResponse(['error' => 'Impossible de lire le fichier'], 400);
        }
        try {
            $this->mediaStorage->writeStream($targetPath, $stream);
        } finally {
            fclose($stream);
        }
        $mimeType = $this->mediaStorage->mimeType($targetPath);
        $url = $request->getSchemeAndHttpHost() . $request->getBasePath()
            . $this->generateUrl('app_media_file', ['path' => $targetPath]);
        return new JsonResponse([
            'id' => $targetPath,
            'path' => $targetPath,
            'name' => $name,
            'url' => $url,
            'type' => $mimeType,
            'mimeType' => $mimeType,
        ]);
    }

    /** Upload par chunks (8 Mo) : évite les limites post_max_size. */
    #[Route('/media/api/upload-chunk', name: 'api_upload_chunk', methods: ['POST'])]
    public function uploadChunk(Request $request): JsonResponse
    {
        $path = (string) $request->request->get('path', '');
        $path = $this->sanitizePath($path);
        $name = (string) $request->request->get('name', '');
        $uploadId = (string) $request->request->get('upload_id', '');
        $chunkIndex = (int) $request->request->get('chunk_index', -1);
        $totalChunks = (int) $request->request->get('total_chunks', 0);

        if ($name === '' || preg_match('/[^a-zA-Z0-9._\-\s]/', $name)) {
            return new JsonResponse(['error' => 'Nom de fichier non autorisé'], 400);
        }
        if ($uploadId === '' || !preg_match('/^[a-zA-Z0-9\-_]+$/', $uploadId)) {
            return new JsonResponse(['error' => 'upload_id invalide'], 400);
        }
        if ($totalChunks < 1 || $chunkIndex < 0 || $chunkIndex >= $totalChunks) {
            return new JsonResponse(['error' => 'chunk_index / total_chunks invalides'], 400);
        }

        $chunkFile = $request->files->get('chunk');
        if (!$chunkFile || !$chunkFile->isValid()) {
            return new JsonResponse(['error' => 'Chunk manquant ou invalide'], 400);
        }

        $tempDir = sys_get_temp_dir() . '/app_media_upload_' . $uploadId;
        $tempPath = $tempDir . '/file';

        if ($chunkIndex === 0) {
            if (is_dir($tempDir)) {
                $this->removeTempUploadDir($tempDir);
            }
            if (!@mkdir($tempDir, 0700, true) && !is_dir($tempDir)) {
                return new JsonResponse(['error' => 'Impossible de créer le répertoire temporaire'], 500);
            }
        }

        $chunkRealPath = $chunkFile->getRealPath();
        if ($chunkRealPath === false) {
            return new JsonResponse(['error' => 'Fichier temporaire indisponible'], 400);
        }

        $dest = fopen($tempPath, $chunkIndex === 0 ? 'wb' : 'ab');
        if ($dest === false) {
            return new JsonResponse(['error' => 'Impossible d\'écrire le chunk'], 500);
        }
        $src = fopen($chunkRealPath, 'rb');
        if ($src === false) {
            fclose($dest);
            return new JsonResponse(['error' => 'Impossible de lire le chunk'], 500);
        }
        stream_copy_to_stream($src, $dest);
        fclose($src);
        fclose($dest);

        if ($chunkIndex !== $totalChunks - 1) {
            return new JsonResponse(['ok' => true, 'chunk_index' => $chunkIndex]);
        }

        $targetPath = $path !== '' ? $path . '/' . $name : $name;
        $stream = fopen($tempPath, 'rb');
        if ($stream === false) {
            $this->removeTempUploadDir($tempDir);
            return new JsonResponse(['error' => 'Impossible de finaliser le fichier'], 500);
        }
        try {
            $this->mediaStorage->writeStream($targetPath, $stream);
        } finally {
            fclose($stream);
            $this->removeTempUploadDir($tempDir);
        }

        $mimeType = $this->mediaStorage->mimeType($targetPath);
        $url = $request->getSchemeAndHttpHost() . $request->getBasePath()
            . $this->generateUrl('app_media_file', ['path' => $targetPath]);
        return new JsonResponse([
            'id' => $targetPath,
            'path' => $targetPath,
            'name' => $name,
            'url' => $url,
            'type' => $mimeType,
            'mimeType' => $mimeType,
        ]);
    }

    #[Route('/media/api/rename', name: 'api_rename', methods: ['POST'])]
    public function rename(Request $request): JsonResponse
    {
        $data = json_decode((string) $request->getContent(), true) ?: [];
        $id = (string) ($data['id'] ?? '');
        $name = trim((string) ($data['name'] ?? ''));
        if ($id === '' || $name === '' || preg_match('/[^a-zA-Z0-9._\-\s]/', $name)) {
            return new JsonResponse(['error' => 'id et name requis, nom invalide'], 400);
        }
        $oldPath = $this->sanitizePath($id);
        $dir = \dirname($oldPath);
        $newPath = ($dir !== '.' ? $dir . '/' : '') . $name;
        $newPath = $this->sanitizePath($newPath);
        if (!$this->mediaStorage->fileExists($oldPath)) {
            return new JsonResponse(['error' => 'Fichier introuvable', 'id' => $id], 404);
        }
        $stream = $this->mediaStorage->readStream($oldPath);
        try {
            $this->mediaStorage->writeStream($newPath, $stream);
        } finally {
            fclose($stream);
        }
        $this->mediaStorage->delete($oldPath);
        $mimeType = $this->mediaStorage->mimeType($newPath);
        $url = $request->getSchemeAndHttpHost() . $request->getBasePath()
            . $this->generateUrl('app_media_file', ['path' => $newPath]);
        return new JsonResponse([
            'id' => $newPath,
            'path' => $newPath,
            'name' => $name,
            'url' => $url,
            'type' => $mimeType,
            'mimeType' => $mimeType,
        ]);
    }

    #[Route('/media/api/folder', name: 'api_folder', methods: ['POST'])]
    public function createFolder(Request $request): JsonResponse
    {
        $data = json_decode((string) $request->getContent(), true) ?: $request->request->all();
        $name = trim((string) ($data['name'] ?? $request->request->get('name', '')));
        $path = (string) ($data['path'] ?? $request->request->get('path', ''));
        $path = $this->sanitizePath($path);
        if ($name === '' || preg_match('/[^a-zA-Z0-9._\-\s]/', $name)) {
            return new JsonResponse(['error' => 'Nom de dossier invalide'], 400);
        }
        $targetPath = $path !== '' ? $path . '/' . $name : $name;
        $this->mediaStorage->createDirectory($targetPath);
        return new JsonResponse([
            'id' => $targetPath,
            'path' => $targetPath . '/',
            'name' => $name,
            'url' => '',
            'type' => 'directory',
            'isFolder' => true,
        ]);
    }

    private function removeTempUploadDir(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }
        $file = $dir . '/file';
        if (is_file($file)) {
            @unlink($file);
        }
        @rmdir($dir);
    }

    #[Route('/media/api/mkdir', name: 'api_mkdir', methods: ['POST'])]
    public function mkdir(Request $request): JsonResponse
    {
        $path = (string) $request->request->get('path', '');
        $path = $this->sanitizePath($path);
        $name = trim((string) $request->request->get('name', ''));
        if ($name === '' || preg_match('/[^a-zA-Z0-9._\-\s]/', $name)) {
            return new JsonResponse(['error' => 'Nom de dossier invalide'], 400);
        }
        $targetPath = $path !== '' ? $path . '/' . $name : $name;
        $this->mediaStorage->createDirectory($targetPath);
        return new JsonResponse(['path' => $targetPath]);
    }

    #[Route('/media/api/delete', name: 'api_delete', methods: ['DELETE', 'POST'])]
    public function delete(Request $request): JsonResponse
    {
        $path = (string) ($request->request->get('path') ?? $request->request->get('id') ?? $request->query->get('path', ''));
        if ($path === '' && $request->getContent()) {
            $data = json_decode((string) $request->getContent(), true);
            $path = (string) ($data['path'] ?? $data['id'] ?? '');
        }
        $path = $this->sanitizePath($path);
        if ($path === '' || $path === '.') {
            return new JsonResponse(['error' => 'Chemin requis'], 400);
        }
        if ($this->mediaStorage->directoryExists($path)) {
            $this->mediaStorage->deleteDirectory($path);
        } else {
            $this->mediaStorage->delete($path);
        }
        return new JsonResponse(['ok' => true]);
    }

    #[Route('/media/file/{path}', name: 'file', requirements: ['path' => '.+'], methods: ['GET'])]
    public function serveFile(string $path): Response
    {
        $path = $this->sanitizePath($path);
        if (!$this->mediaStorage->fileExists($path)) {
            throw $this->createNotFoundException('Fichier introuvable');
        }
        $mimeType = $this->mediaStorage->mimeType($path);
        $stream = $this->mediaStorage->readStream($path);
        $response = new StreamedResponse(function () use ($stream): void {
            if (is_resource($stream)) {
                fpassthru($stream);
                fclose($stream);
            }
        });
        $response->headers->set('Content-Type', $mimeType);
        $response->headers->set('Content-Disposition', 'inline; filename="' . basename($path) . '"');
        return $response;
    }

    private function sanitizePath(string $path): string
    {
        $path = trim(str_replace('\\', '/', $path), '/');
        if (str_contains($path, '..')) {
            throw new AccessDeniedHttpException('Chemin non autorisé');
        }
        return $path === '' ? '' : $path;
    }
}
