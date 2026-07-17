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
            $labels = array_values(array_filter(
                array_map(static fn (mixed $v): string => (string) $v, $item['labels']),
                static fn (string $v): bool => $v !== ''
            ));
            if ($labels !== []) {
                $out['labels'] = $labels;
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
