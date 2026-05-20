<?php

declare(strict_types=1);

namespace App\BuilderForm;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Fenêtre glissante simple : compteur + horodate de début de fenêtre (stockés dans le cache app).
 */
final class BuilderFormRateLimiter
{
    public function __construct(
        private readonly CacheItemPoolInterface $cache,
        #[Autowire('%app.builder_form.rate_limit.max_attempts%')]
        private readonly int $maxAttempts,
        #[Autowire('%app.builder_form.rate_limit.window_seconds%')]
        private readonly int $windowSeconds,
    ) {
    }

    public function isTooManyAttempts(string $clientKey, string $formSlug): bool
    {
        $cacheKey = $this->cacheKey($clientKey, $formSlug);
        $item = $this->cache->getItem($cacheKey);
        $now = time();

        /** @var array{count: int, window_start: int}|null $data */
        $data = $item->isHit() ? $item->get() : null;

        if ($data === null || ($now - $data['window_start']) >= $this->windowSeconds) {
            $data = ['count' => 0, 'window_start' => $now];
        }

        if ($data['count'] >= $this->maxAttempts) {
            return true;
        }

        ++$data['count'];
        $item->set($data);
        $item->expiresAfter($this->windowSeconds);
        $this->cache->save($item);

        return false;
    }

    private function cacheKey(string $clientKey, string $formSlug): string
    {
        return 'builder_form_rl_' . hash('sha256', $clientKey . "\0" . $formSlug);
    }
}
