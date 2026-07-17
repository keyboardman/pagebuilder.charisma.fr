<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Résout une liste ordonnée de références { apiId, itemId } vers des items mappés.
 */
final class ApiCollectionResolver
{
    public function __construct(
        private readonly ApiCollectionRegistry $registry,
    ) {
    }

    /**
     * @param list<ApiCollectionResolveEntry> $entries
     *
     * @return list<array<string, mixed>>
     */
    public function resolve(array $entries): array
    {
        $items = [];
        foreach ($entries as $entry) {
            if (!$entry instanceof ApiCollectionResolveEntry) {
                continue;
            }
            $collection = $this->registry->get($entry->apiId);
            if ($collection === null) {
                continue;
            }
            $item = $collection->fetchItem($entry->itemId);
            if ($item !== null) {
                $items[] = $item;
            }
        }

        return $items;
    }
}
