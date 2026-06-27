<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Theme;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/assets/theme', name: 'app_theme_')]
final class ThemeAssetController extends AbstractController
{
    public function __construct(
        private readonly string $projectDir,
    ) {
    }

    #[Route('/{id}/css', name: 'css', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function css(Theme $theme, Request $request): Response
    {
        $path = $theme->getGeneratedCssPath();
        if ($path === '') {
            return new Response('', Response::HTTP_NOT_FOUND);
        }
        $fullPath = $this->projectDir . '/' . ltrim(str_replace('\\', '/', $path), '/');
        $realPath = realpath($fullPath);
        if ($realPath === false || !is_file($realPath)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }
        $baseDir = realpath($this->projectDir);
        if ($baseDir === false || strpos($realPath, $baseDir) !== 0) {
            return new Response('', Response::HTTP_FORBIDDEN);
        }

        $scoped = $request->query->getBoolean('scoped');
        $content = file_get_contents($realPath);

        if ($scoped && $content !== false) {
            $content = $this->scopeThemeCss($content);
        }

        $finalContent = $content !== false ? $content : '';
        $response = new Response($finalContent);
        $response->headers->set('Content-Type', 'text/css; charset=utf-8');

        return $response;
    }

    /**
     * Scopie le CSS du thème sous .theme-preview-scope pour limiter son impact au canvas.
     */
    private function scopeThemeCss(string $css): string
    {
        $scope = '.theme-preview-scope';

        return preg_replace_callback(
            '/^(\s*)((?![@])(?:[^{])+)\s*\{/m',
            function (array $m) use ($scope): string {
                $sel = preg_replace('/\s+/', ' ', trim($m[2]));
                if ($sel === '') {
                    return $m[0];
                }
                $selectors = array_map('trim', explode(',', $sel));
                $scoped = array_map(static function (string $s) use ($scope): string {
                    return ($s === ':root' || $s === 'body') ? $scope : $scope . ' ' . $s;
                }, $selectors);

                return $m[1] . implode(', ', $scoped) . ' {';
            },
            $css
        );
    }
}
