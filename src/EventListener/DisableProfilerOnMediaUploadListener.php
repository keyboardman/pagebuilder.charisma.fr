<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Profiler\Profiler;

/**
 * Désactive le Web Profiler pour les routes d’upload média.
 * Le profiler charge tout le corps de la requête en mémoire (getContent()),
 * ce qui provoque un OOM avec les gros fichiers (ex. MP4).
 */
final class DisableProfilerOnMediaUploadListener implements EventSubscriberInterface
{
    private const UPLOAD_PATH_PREFIXES = ['/media/api/upload', '/api/filesystem/upload'];
    private const ATTR_PROFILER_DISABLED = '_profiler_disabled_by_media_upload';

    public function __construct(
        private readonly ?Profiler $profiler = null,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 512],
            KernelEvents::RESPONSE => ['onKernelResponse', -256],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest() || $this->profiler === null) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();
        $match = false;
        foreach (self::UPLOAD_PATH_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                $match = true;
                break;
            }
        }
        if (!$match) {
            return;
        }

        $this->profiler->disable();
        $request->attributes->set(self::ATTR_PROFILER_DISABLED, true);
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest() || $this->profiler === null) {
            return;
        }

        if ($event->getRequest()->attributes->getBoolean(self::ATTR_PROFILER_DISABLED)) {
            $this->profiler->enable();
        }
    }
}
