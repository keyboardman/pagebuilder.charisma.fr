<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\PageBuilder\ApiListImage\ApiListImage;

/**
 * Adapter : ApiListImage (fixed) → ApiCollection type image.
 */
final class ApiListImageCollectionAdapter implements ApiCollectionInterface
{
    public function __construct(
        private readonly ApiListImage $source,
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
        return 'image';
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
        $page = $this->source->fetchItems(['page' => 1, 'itemsPerPage' => 100]);
        foreach ($page->items as $item) {
            if ((string) ($item['id'] ?? '') === $id) {
                return ApiCollectionItemNormalizer::normalize($item);
            }
        }

        return null;
    }
}
