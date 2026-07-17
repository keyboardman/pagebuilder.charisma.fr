<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Normalise un item mappé vers le contrat standard ApiCollection.
 */
final class ApiCollectionItemNormalizer
{
    /**
     * @param array<string, mixed> $item
     *
     * @return array<string, mixed>
     */
    public static function normalize(array $item): array
    {
        $out = [
            'id' => (string) ($item['id'] ?? ''),
        ];

        self::copyString($item, $out, 'image');
        self::copyString($item, $out, 'title');
        self::copyString($item, $out, 'description');
        self::copyString($item, $out, 'link');
        self::copyString($item, $out, 'alt');
        self::copyString($item, $out, 'text');

        if (isset($item['label']) && $item['label'] !== null && $item['label'] !== '') {
            $out['label'] = (string) $item['label'];
        }

        if (isset($item['labels']) && \is_array($item['labels'])) {
            $labels = [];
            foreach ($item['labels'] as $v) {
                if (\is_string($v) || \is_int($v) || \is_float($v)) {
                    $s = trim((string) $v);
                    if ($s !== '') {
                        $labels[] = $s;
                    }
                }
                // Ignore arrays/objects (ex. classements bruts) — utiliser un chemin
                // joker type classements.?.nom dans le mapping admin.
            }
            if ($labels !== []) {
                $out['labels'] = array_values($labels);
            }
        } elseif (isset($out['label'])) {
            $out['labels'] = [$out['label']];
        }

        if (isset($item['counter']) && $item['counter'] !== null && $item['counter'] !== '' && $item['counter'] !== 0) {
            $out['counter'] = is_numeric($item['counter']) ? (int) $item['counter'] : (string) $item['counter'];
        }

        if (isset($item['like']) && $item['like'] !== null && $item['like'] !== '' && $item['like'] !== 0) {
            $out['like'] = is_numeric($item['like']) ? (int) $item['like'] : (string) $item['like'];
        }

        if (isset($item['raw']) && (\is_array($item['raw']) || \is_object($item['raw']))) {
            $out['raw'] = \is_array($item['raw']) ? $item['raw'] : (array) $item['raw'];
        }

        return $out;
    }

    /**
     * @param array<string, mixed> $item
     * @param array<string, mixed> $out
     */
    private static function copyString(array $item, array &$out, string $key): void
    {
        if (!isset($item[$key]) || $item[$key] === null || $item[$key] === '') {
            return;
        }

        $out[$key] = (string) $item[$key];
    }
}
