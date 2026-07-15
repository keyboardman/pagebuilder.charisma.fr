<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

use App\PageBuilder\ApiListArticle\ApiListArticleRegistry;

/**
 * Résout une liste ordonnée de références { id, type } vers des items mappés NodeListApi.
 */
final class ApiListArticleDynamiqueResolver
{
    public function __construct(
        private readonly ApiListArticleDynamiqueRegistry $apiListArticleDynamiqueRegistry,
    ) {
    }

    /**
     * @param list<ApiListArticleDynamiqueEntry> $entries
     * @return list<array<string, mixed>>
     */
    public function resolve(array $entries): array
    {
        $items = [];

        foreach ($entries as $entry) {
            $resolved = $this->resolveEntry($entry);
            if ($resolved !== null) {
                $items[] = $resolved;
            }
        }

        return $items;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveEntry(ApiListArticleDynamiqueEntry $entry): ?array
    {
        $source = $this->apiListArticleDynamiqueRegistry->get($entry->type);
        if ($source === null) {
            return null;
        }

        try {
            return $source->fetchItem($entry->id);
        } catch (\Throwable) {
            return null;
        }
    }
}
