<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Ajoute les en-têtes CORS pour les routes GET du contenu render,
 * afin d'accepter toute origine et tout port (iframe, autre domaine).
 */
final class PageRenderCorsListener implements EventSubscriberInterface
{
    private const RENDER_GET_ROUTES = [
        'app_page_render',
        'app_page_render_by_id',
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

        $route = $request->attributes->get('_route');
        if ($route === null || !\in_array($route, self::RENDER_GET_ROUTES, true)) {
            return;
        }

        $response = $event->getResponse();
        $response->headers->set('Access-Control-Allow-Origin', '*');
    }
}
