<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/media', name: 'app_media_')]
final class MediaAssetController extends AbstractController
{
    public function __construct(
        private readonly string $projectDir,
    ) {
    }

    #[Route('/{path}', name: 'file', methods: ['GET'], requirements: ['path' => '.+'])]
    public function serveFile(string $path): Response
    {
        $path = str_replace(['..', "\0"], ['', ''], $path);
        if ($path === '') {
            throw $this->createNotFoundException('Fichier média introuvable.');
        }

        $mediaDir = realpath($this->projectDir . '/public/media');
        if ($mediaDir === false) {
            throw $this->createNotFoundException('Fichier média introuvable.');
        }

        $fullPath = realpath($mediaDir . '/' . $path);
        if ($fullPath === false || !is_file($fullPath) || !str_starts_with($fullPath, $mediaDir . \DIRECTORY_SEPARATOR)) {
            throw $this->createNotFoundException('Fichier média introuvable.');
        }

        $mime = MimeTypes::getDefault()->guessMimeType($fullPath) ?? 'application/octet-stream';

        $response = new BinaryFileResponse($fullPath);
        $response->headers->set('Content-Type', $mime);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE, basename($path));

        return $response;
    }
}
