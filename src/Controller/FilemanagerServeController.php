<?php

declare(strict_types=1);

namespace App\Controller;

use Keyboardman\FilesystemBundle\Service\FileStorage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route(name: 'app_filemanager_')]
class FilemanagerServeController extends AbstractController
{
    public function __construct(
        private readonly FileStorage $fileStorage,
    ) {
    }

    #[Route('/serve/{filesystem}/{path}', name: 'serve', requirements: ['path' => '.+'], methods: ['GET'])]
    public function serve(string $filesystem, string $path, Request $request): Response
    {
        $path = $this->sanitizePath($path);
        if ($path === '') {
            throw new NotFoundHttpException('Invalid path.');
        }

        if (!$this->fileStorage->hasFilesystem($filesystem)) {
            throw new NotFoundHttpException('Filesystem not found.');
        }

        if (!$this->fileStorage->has($filesystem, $path)) {
            throw new NotFoundHttpException('File not found.');
        }

        $mimeType = $this->mimeTypeFromPath($path);
        $content = $this->fileStorage->read($filesystem, $path);

        $response = new Response($content);
        $response->headers->set('Content-Type', $mimeType);
        $response->headers->set('Content-Length', (string) \strlen($content));

        return $response;
    }

    private function sanitizePath(string $path): string
    {
        $path = trim($path, '/');
        if (str_contains($path, '..')) {
            return '';
        }

        return $path;
    }

    private function mimeTypeFromPath(string $path): string
    {
        $ext = strtolower(pathinfo($path, \PATHINFO_EXTENSION));
        $map = [
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif',
            'webp' => 'image/webp', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon',
            'mp3' => 'audio/mpeg', 'wav' => 'audio/wav', 'ogg' => 'audio/ogg', 'm4a' => 'audio/mp4',
            'mp4' => 'video/mp4', 'webm' => 'video/webm', 'pdf' => 'application/pdf',
        ];

        return $map[$ext] ?? 'application/octet-stream';
    }
}
