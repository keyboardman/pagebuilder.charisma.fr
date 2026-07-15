<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticle;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Base commune pour les collections fixes consommées par NodeListApi / NodeNavApi.
 *
 * Distinction avec ApiCard :
 * - ApiCard (/page-builder/cards) : sélection d'un item dans la modale backend (article, image…)
 * - ApiListArticle (/page-builder/lists) : collection branchée avec pagination API Platform (page, itemsPerPage)
 *
 * Chaque implémentation fournit un endpoint, un id, un label et un mapping item-par-item.
 */
abstract class ApiListArticle implements ApiListArticleBehaviorInterface
{
    protected const ENDPOINT_URL = '';
    protected const COLLECTION_MODE = 'fixed';

    protected const MAX_ITEMS_PER_PAGE = 100;

    public function __construct(
        protected readonly HttpClientInterface $httpClient,
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
    public function fetchItems(array $params = []): ApiListArticlePageResult
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

                return new ApiListArticlePageResult($items, $totalItems, $totalPages, $page, $itemsPerPage);
            }

            $totalItems = \count($items);

            return new ApiListArticlePageResult($items, $totalItems, $totalItems > 0 ? 1 : 0, 1, $totalItems);
        } catch (\Throwable) {
            return ApiListArticlePageResult::empty($page, $itemsPerPage);
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
     * Recherche un item mappé par identifiant dans la collection distante.
     *
     * @return array<string, mixed>|null
     */
    public function findItemById(string $id): ?array
    {
        if ($id === '') {
            return null;
        }

        $page = 1;

        do {
            $result = $this->fetchItems([
                'page' => $page,
                'itemsPerPage' => self::MAX_ITEMS_PER_PAGE,
            ]);

            foreach ($result->items as $item) {
                if (!\is_array($item)) {
                    continue;
                }

                if ((string) ($item['id'] ?? '') === $id) {
                    return $item;
                }
            }

            ++$page;
        } while ($page <= $result->totalPages);

        return null;
    }

    /**
     * @param mixed $item
     * @return array<string, mixed> déjà conforme au contrat `BuilderApiCardItemData`
     */
    abstract protected function mapRemoteItemToNodeList(mixed $item): array;
}
