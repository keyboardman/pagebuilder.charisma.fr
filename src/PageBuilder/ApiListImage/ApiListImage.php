<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListImage;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Base commune pour les collections fixes d'images (slideshow, galeries…).
 *
 * Distinction avec ApiCard :
 * - ApiCard (/page-builder/cards) : sélection d'un item dans la modale backend
 * - ApiListImage (/page-builder/lists-image) : collection branchée avec pagination API Platform
 *
 * Contrat mapping image-only : id, image, link?, alt?
 */
abstract class ApiListImage implements ApiListImageBehaviorInterface
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
    public function fetchItems(array $params = []): ApiListImagePageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = $this->normalizeItemsPerPage($params['itemsPerPage'] ?? 10);

        try {
            $data = $this->requestRemoteCollection($page, $itemsPerPage);
            $member = $data['member'] ?? [];
            if (!\is_array($member)) {
                $member = [];
            }

            $items = array_map(
                fn (mixed $item): array => $this->mapRemoteItemToNodeList($item),
                $member
            );

            if ($this->supportsPagination()) {
                [$totalItems, $totalPages] = $this->resolvePaginationTotals($data, $page, $itemsPerPage, \count($member));

                return new ApiListImagePageResult($items, $totalItems, $totalPages, $page, $itemsPerPage);
            }

            $totalItems = \count($items);

            return new ApiListImagePageResult($items, $totalItems, $totalItems > 0 ? 1 : 0, 1, $totalItems);
        } catch (\Throwable) {
            return ApiListImagePageResult::empty($page, $itemsPerPage);
        }
    }

    protected function supportsPagination(): bool
    {
        return true;
    }

    protected function getItemsPerPageQueryParam(): string
    {
        return 'itemsPerPage';
    }

    /**
     * @return array<string, mixed>
     */
    protected function requestRemoteCollection(int $page, int $itemsPerPage): array
    {
        $response = $this->httpClient->request(
            'GET',
            static::ENDPOINT_URL,
            [
                'query' => $this->buildQuery($page, $itemsPerPage),
                'timeout' => 30,
            ]
        );

        return $response->toArray();
    }

    /**
     * @param array<string, mixed> $data
     * @return array{0: int, 1: int}
     */
    protected function resolvePaginationTotals(array $data, int $page, int $itemsPerPage, int $memberCount): array
    {
        unset($page, $memberCount);

        $totalItems = (int) ($data['totalItems'] ?? 0);
        $totalPages = $totalItems > 0
            ? (int) max(1, (int) ceil($totalItems / $itemsPerPage))
            : 0;

        return [$totalItems, $totalPages];
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
            $query[$this->getItemsPerPageQueryParam()] = (string) $itemsPerPage;
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
     * @return array{id: string, image: string, link?: string|null, alt?: string|null}
     */
    abstract protected function mapRemoteItemToNodeList(mixed $item): array;
}
