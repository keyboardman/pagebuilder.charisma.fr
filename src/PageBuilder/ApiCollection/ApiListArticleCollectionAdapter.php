<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\PageBuilder\ApiListArticle\ApiListArticle;

/**
 * Adapter : ApiListArticle (fixed) → ApiCollection type article.
 */
final class ApiListArticleCollectionAdapter implements ApiCollectionInterface
{
    public function __construct(
        private readonly ApiListArticle $source,
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
        return ['fixed'];
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
        $item = $this->source->findItemById($id);

        return $item !== null ? ApiCollectionItemNormalizer::normalize($item) : null;
    }
}
