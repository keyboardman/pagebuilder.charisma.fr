<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamique;

/**
 * Adapter : ApiListArticleDynamique → ApiCollection type article (dynamic).
 *
 * @deprecated since 2026-07 — plus aucune ApiListArticleDynamique taguée (seed ApiCollection). Conservé pour rollback.
 */
final class ApiListArticleDynamiqueCollectionAdapter implements ApiCollectionInterface
{
    public function __construct(
        private readonly ApiListArticleDynamique $source,
    ) {
    }

    public function getId(): string
    {
        return $this->source->getId();
    }

    public function getLabel(): string
    {
        return $this->source->getLabel();
    }

    public function getType(): string
    {
        return 'article';
    }

    public function getSupportedModes(): array
    {
        return ['dynamic'];
    }

    public function fetchItems(array $params = []): ApiCollectionPageResult
    {
        $result = $this->source->fetchItems($params);

        return ApiCollectionPageResult::fromLegacy(
            $result->items,
            $result->totalItems,
            $result->totalPages,
            $result->page,
            $result->itemsPerPage
        );
    }

    public function fetchItem(string $id): ?array
    {
        $item = $this->source->fetchItem($id);

        return $item !== null ? ApiCollectionItemNormalizer::normalize($item) : null;
    }

    public function fetchCategories(): array
    {
        return [];
    }
}
