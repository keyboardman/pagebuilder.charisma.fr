<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Rétrocompatibilité : les CSS de thème générés avant le préfixe /admin
 * référencent encore /font/file/{path}.
 */
#[Route('/font', name: 'app_font_legacy_')]
final class LegacyFontAssetController extends AbstractController
{
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {
    }

    #[Route('/file/{path}', name: 'file', methods: ['GET'], requirements: ['path' => '.+'])]
    public function serveFile(string $path): RedirectResponse
    {
        $path = str_replace(['..', "\0"], ['', ''], $path);

        return new RedirectResponse(
            $this->urlGenerator->generate('app_font_file', ['path' => $path], UrlGeneratorInterface::ABSOLUTE_PATH),
            Response::HTTP_MOVED_PERMANENTLY,
        );
    }
}
