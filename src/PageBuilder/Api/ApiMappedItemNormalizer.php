<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

final class ApiMappedItemNormalizer
{
    /**
     * @param array{id: string, title: string, description?: string, image?: string, labels?: list<string>, link?: string, text?: string, raw: object} $mapped
     * @return array<string, mixed>
     */
    public function normalize(array $mapped): array
    {
        $out = [
            'id' => $mapped['id'],
            'title' => $mapped['title'],
            'description' => $mapped['description'] ?? null,
            'image' => $mapped['image'] ?? null,
            'labels' => $mapped['labels'] ?? null,
            'link' => $mapped['link'] ?? null,
            'text' => $mapped['text'] ?? null,
        ];
        $raw = $mapped['raw'] ?? null;
        if ($raw !== null) {
            $out['raw'] = \is_object($raw) ? (array) $raw : $raw;
        }

        return $out;
    }
}
