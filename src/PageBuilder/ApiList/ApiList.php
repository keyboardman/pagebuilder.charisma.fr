<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Base commune pour les collections fixes consommées par NodeListApi / NodeNavApi.
 *
 * Distinction avec ApiCard :
 * - ApiCard (/page-builder/cards) : sélection d'un item dans la modale backend (article, image…)
 * - ApiList (/page-builder/lists) : collection branchée avec pagination API Platform (page, itemsPerPage)
 *
 * Chaque implémentation fournit un endpoint, un id, un label et un mapping item-par-item.
 */
abstract class ApiList implements ApiListBehaviorInterface
{
    protected const ENDPOINT_URL = '';
    protected const COLLECTION_MODE = 'fixed';

    protected const MAX_ITEMS_PER_PAGE = 100;

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getCollectionMode(): string
    {
        return static::COLLECTION_MODE;
    }

    abstract public function getId(): string;

    abstract public function getLabel(): string;

    /**
     * @param array{page?: int|string, itemsPerPage?: int|string} $params
     */
    public function fetchItems(array $params = []): ApiListPageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = $this->normalizeItemsPerPage($params['itemsPerPage'] ?? 10);

        try {
            $response = $this->httpClient->request(
                'GET',
                static::ENDPOINT_URL,
                [
                    'query' => $this->buildQuery($page, $itemsPerPage),
                    'timeout' => 30,
                ]
            );

            $data = $response->toArray();
            $member = $data['member'] ?? [];
            if (!\is_array($member)) {
                $member = [];
            }

            $items = array_map(
                fn (mixed $item): array => $this->mapRemoteItemToNodeList($item),
                $member
            );

            if ($this->supportsPagination()) {
                $totalItems = (int) ($data['totalItems'] ?? \count($items));
                $totalPages = $totalItems > 0
                    ? (int) max(1, (int) ceil($totalItems / $itemsPerPage))
                    : 0;

                return new ApiListPageResult($items, $totalItems, $totalPages, $page, $itemsPerPage);
            }

            $totalItems = \count($items);

            return new ApiListPageResult($items, $totalItems, $totalItems > 0 ? 1 : 0, 1, $totalItems);
        } catch (\Throwable) {
            return ApiListPageResult::empty($page, $itemsPerPage);
        }
    }

    protected function supportsPagination(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    protected function getFixedQueryParams(): array
    {
        return [];
    }

    /**
     * @return array<string, string>
     */
    protected function buildQuery(int $page, int $itemsPerPage): array
    {
        $query = $this->getFixedQueryParams();

        if ($this->supportsPagination()) {
            $query['page'] = (string) $page;
            $query['itemsPerPage'] = (string) $itemsPerPage;
        }

        return $query;
    }

    protected function normalizeItemsPerPage(int|string $value): int
    {
        $int = (int) $value;
        if ($int < 1) {
            return 10;
        }

        return min($int, self::MAX_ITEMS_PER_PAGE);
    }

    /**
     * @param mixed $item
     * @return array<string, mixed> déjà conforme au contrat `BuilderApiCardItemData`
     */
    abstract protected function mapRemoteItemToNodeList(mixed $item): array;
}
