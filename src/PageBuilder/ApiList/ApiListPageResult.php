<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

final class ApiListPageResult
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

    /**
     * @return array{items: list<array<string, mixed>>, totalItems: int, totalPages: int, page: int, itemsPerPage: int}
     */
    public function toArray(): array
    {
        return [
            'items' => $this->items,
            'totalItems' => $this->totalItems,
            'totalPages' => $this->totalPages,
            'page' => $this->page,
            'itemsPerPage' => $this->itemsPerPage,
        ];
    }

    public static function empty(int $page = 1, int $itemsPerPage = 10): self
    {
        return new self([], 0, 0, $page, $itemsPerPage);
    }
}
