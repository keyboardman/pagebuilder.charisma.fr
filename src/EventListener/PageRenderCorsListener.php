<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Ajoute les en-têtes CORS pour les routes GET du contenu render, des fichiers polices
 * et de la médiathèque (/media/…), afin d'accepter toute origine et tout port
 * (iframe, autre domaine, www.charisma.fr).
 */
final class PageRenderCorsListener implements EventSubscriberInterface
{
    private const CORS_GET_ROUTES = [
        'app_page_render',
        'app_page_render_by_id',
        'app_font_file',
        'app_font_legacy_file',
        'app_media_file',
    ];

    private const CORS_PATH_PREFIXES = [
        '/media/',
    ];

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => ['onKernelResponse', 0],
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        if ($request->getMethod() !== 'GET') {
            return;
        }

        if (!$this->needsCors($request)) {
            return;
        }

        $response = $event->getResponse();
        $response->headers->set('Access-Control-Allow-Origin', '*');
    }

    private function needsCors(\Symfony\Component\HttpFoundation\Request $request): bool
    {
        $route = $request->attributes->get('_route');
        if ($route !== null && \in_array($route, self::CORS_GET_ROUTES, true)) {
            return true;
        }

        $path = $request->getPathInfo();
        foreach (self::CORS_PATH_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }
}
