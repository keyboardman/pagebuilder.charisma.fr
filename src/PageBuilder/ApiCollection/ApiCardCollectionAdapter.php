<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\PageBuilder\ApiCard\ApiCardInterface;

/**
 * Adapter : ApiCard (video, et éventuellement autres types) → ApiCollection.
 */
final class ApiCardCollectionAdapter implements ApiCollectionInterface
{
    public function __construct(
        private readonly ApiCardInterface $card,
    ) {
    }

    public function getId(): string
    {
        return $this->card->getId();
    }

    public function getLabel(): string
    {
        return $this->card->getLabel();
    }

    public function getType(): string
    {
        $type = $this->card->getType();
        if (\in_array($type, ['image', 'video', 'article'], true)) {
            return $type;
        }

        return 'article';
    }

    public function getSupportedModes(): array
    {
        return ['fixed', 'dynamic'];
    }

    public function fetchItems(array $params = []): ApiCollectionPageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = max(1, min(100, (int) ($params['itemsPerPage'] ?? $params['limit'] ?? 10)));

        $cardParams = [
            'page' => $page,
            'limit' => $itemsPerPage,
        ];
        if (isset($params['search']) && \is_string($params['search']) && $params['search'] !== '') {
            $cardParams['search'] = $params['search'];
        }

        try {
            $result = $this->card->fetchCollection($cardParams);
        } catch (\Throwable) {
            return ApiCollectionPageResult::empty($page, $itemsPerPage);
        }

        $rawItems = $result['items'] ?? [];
        $total = (int) ($result['total'] ?? \count($rawItems));
        $items = [];
        foreach ($rawItems as $raw) {
            if (!\is_object($raw)) {
                continue;
            }
            $items[] = ApiCollectionItemNormalizer::normalize($this->card->mapItem($raw));
        }

        $totalPages = $total > 0 ? (int) max(1, (int) ceil($total / $itemsPerPage)) : 0;

        return new ApiCollectionPageResult($items, $total, $totalPages, $page, $itemsPerPage);
    }

    public function fetchItem(string $id): ?array
    {
        try {
            $raw = $this->card->fetchItem($id);
        } catch (\Throwable) {
            return null;
        }

        return ApiCollectionItemNormalizer::normalize($this->card->mapItem($raw));
    }
}
