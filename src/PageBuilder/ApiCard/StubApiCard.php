<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Implémentation stub d'une API card « article » pour tests et démo.
 */
final class StubApiCard implements ApiCardArticleInterface
{
    public function getId(): string
    {
        return 'stub-articles';
    }

    public function getLabel(): string
    {
        return 'Articles (démo)';
    }

    public function getType(): string
    {
        return 'article';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function fetchCollection(array $params): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = max(1, min(100, (int) ($params['limit'] ?? 20)));
        $items = [];
        for ($i = 0; $i < $limit; $i++) {
            $n = ($page - 1) * $limit + $i;
            $items[] = (object) [
                'id' => 'stub-' . $n,
                'title' => 'Article stub ' . ($n + 1),
                'excerpt' => 'Description courte.',
            ];
        }
        return ['items' => $items, 'total' => 42];
    }

    public function fetchItem(string $id): object
    {
        return (object) [
            'id' => $id,
            'title' => 'Article stub ' . $id,
            'excerpt' => 'Description de l’article.',
        ];
    }

    public function mapItem(object $item): array
    {
        return [
            'id' => $item->id ?? (string) $item->id,
            'title' => $item->title ?? '',
            'description' => $item->excerpt ?? null,
            'image' => null,
            'labels' => null,
            'link' => null,
            'text' => null,
            'raw' => $item,
        ];
    }

    public function fetchCategories(): ?array
    {
        return null;
    }

    public function getCategoryQueryParam(): string
    {
        return 'category';
    }
}
