<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\FontStorage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/assets/font', name: 'app_font_')]
final class FontAssetController extends AbstractController
{
    private const FONT_MIMES = [
        'woff2' => 'font/woff2',
        'woff' => 'font/woff',
        'ttf' => 'font/ttf',
    ];

    public function __construct(
        private readonly FontStorage $fontStorage,
    ) {
    }

    #[Route('/file/{path}', name: 'file', methods: ['GET'], requirements: ['path' => '.+'])]
    public function serveFile(string $path): Response
    {
        $path = str_replace(['..', "\0"], ['', ''], $path);

        if ($path === '' || !$this->fontStorage->fileExists($path)) {
            throw $this->createNotFoundException('Fichier police introuvable.');
        }
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = self::FONT_MIMES[$ext] ?? 'application/octet-stream';
        $content = $this->fontStorage->read($path);

        return new Response($content, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }
}
