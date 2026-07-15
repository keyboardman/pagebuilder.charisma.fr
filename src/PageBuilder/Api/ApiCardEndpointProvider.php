<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

use App\PageBuilder\ApiCard\ApiCardInterface;
use App\PageBuilder\ApiCard\ApiCardItemsAlreadyMappedInterface;
use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiListArticle\ApiListArticleBehaviorInterface;
use App\PageBuilder\ApiListArticle\ApiListArticleItemsAlreadyMappedInterface;

final class ApiCardEndpointProvider
{
    public function __construct(
        private readonly ApiCardRegistry $apiCardRegistry,
        private readonly ApiMappedItemNormalizer $mappedItemNormalizer,
    ) {
    }

    /**
     * @return list<array{
     *   id: string,
     *   label: string,
     *   type: string,
     *   category: string|null,
     *   collectionMode: string
     * }>
     */
    public function listCards(): array
    {
        return $this->apiCardRegistry->list();
    }

    /**
     * @param array<string, mixed> $params
     * @return array{items: list<array<string, mixed>>, total: int}
     */
    public function getCollection(string $id, array $params): array
    {
        $card = $this->getCardOrThrow($id);
        $result = $card->fetchCollection($params);
        $items = $result['items'] ?? [];
        $total = (int) ($result['total'] ?? 0);

        $mapped = [];
        foreach ($items as $item) {
            if (!\is_object($item)) {
                continue;
            }

            if ($this->isFixedAlreadyMappedSource($card)) {
                // Les cards "déjà mappées" renvoient directement les champs
                // attendus par le contrat builder.
                $mapped[] = $this->mappedItemNormalizer->normalize((array) $item);
                continue;
            }

            $mapped[] = $this->mappedItemNormalizer->normalize($card->mapItem($item));
        }

        return ['items' => $mapped, 'total' => $total];
    }

    /**
     * @return array<string, mixed>
     */
    public function getItem(string $id, string $itemId): array
    {
        $card = $this->getCardOrThrow($id);

        try {
            $raw = $card->fetchItem($itemId);
        } catch (\Throwable) {
            throw ApiCardEndpointProviderException::itemNotFound($itemId);
        }

        if ($this->isFixedAlreadyMappedSource($card)) {
            if (!\is_object($raw)) {
                // Par sécurité : on garde la signature "object" mais on tolère
                // potentiellement un tableau.
                return $this->mappedItemNormalizer->normalize((array) $raw);
            }

            return $this->mappedItemNormalizer->normalize((array) $raw);
        }

        return $this->mappedItemNormalizer->normalize($card->mapItem($raw));
    }

    /**
     * @return list<array{id: string, label: string}>
     */
    public function getCategories(string $id): array
    {
        $card = $this->getCardOrThrow($id);
        $categories = $card->fetchCategories();

        return $categories ?? [];
    }

    public function getCardCategoryParamName(string $id): string
    {
        return $this->getCardOrThrow($id)->getCategoryQueryParam();
    }

    private function getCardOrThrow(string $id): ApiCardInterface
    {
        $card = $this->apiCardRegistry->get($id);
        if ($card === null) {
            throw ApiCardEndpointProviderException::apiNotFound($id);
        }

        return $card;
    }

    private function isFixedAlreadyMappedSource(ApiCardInterface $card): bool
    {
        $isAlreadyMapped = $card instanceof ApiCardItemsAlreadyMappedInterface
            || $card instanceof ApiListArticleItemsAlreadyMappedInterface;

        if (!$isAlreadyMapped) {
            return false;
        }

        if ($card instanceof \App\PageBuilder\ApiCard\ApiCardBehaviorInterface) {
            return $card->getCollectionMode() === 'fixed';
        }

        if ($card instanceof ApiListArticleBehaviorInterface) {
            return $card->getCollectionMode() === 'fixed';
        }

        return false;
    }
}
