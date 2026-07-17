<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

final class ApiCollectionPageResult
{
    /**
     * @param list<array<string, mixed>> $items
     */
    public function __construct(
        public readonly array $items,
        public readonly int $totalItems,
        public readonly int $totalPages,
        public readonly int $page,
        public readonly int $itemsPerPage,
    ) {
    }

    public static function empty(int $page = 1, int $itemsPerPage = 10): self
    {
        return new self([], 0, 0, $page, $itemsPerPage);
    }

    /**
     * @param list<array<string, mixed>> $items
     */
    public static function fromLegacy(array $items, int $totalItems, int $totalPages, int $page, int $itemsPerPage): self
    {
        return new self(
            array_map(
                static fn (array $item): array => ApiCollectionItemNormalizer::normalize($item),
                $items
            ),
            $totalItems,
            $totalPages,
            $page,
            $itemsPerPage
        );
    }
}
