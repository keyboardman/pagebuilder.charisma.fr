<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

use App\PageBuilder\ApiListArticle\ApiListArticlePageResult;

/**
 * Base pour les articles Charisma paginés (collection + item /{id}).
 *
 * @deprecated since 2026-07 — sources concrètes migrées vers ApiCollectionDefinition. Conservé pour rollback / tests.
 */
abstract class AbstractCharismaArticleApiListArticleDynamique extends ApiListArticleDynamique
{
    abstract protected function getCollectionUrl(): string;

    public function fetchItems(array $params = []): ApiListArticlePageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = $this->normalizeItemsPerPage($params['itemsPerPage'] ?? 20);

        $query = [
            'page' => (string) $page,
            'itemsPerPage' => (string) $itemsPerPage,
        ];
        if (!empty($params['search'])) {
            $query['titre'] = (string) $params['search'];
        }

        try {
            $response = $this->httpClient->request('GET', $this->getCollectionUrl(), [
                'query' => $query,
                'timeout' => 30,
            ]);
            $data = $response->toArray();
            $member = $data['member'] ?? [];
            if (!\is_array($member)) {
                $member = [];
            }

            $items = array_map(
                fn (mixed $item): array => $this->mapRemoteItemToNodeList($item),
                $member,
            );

            $totalItems = (int) ($data['totalItems'] ?? \count($items));
            $totalPages = $totalItems > 0
                ? (int) max(1, (int) ceil($totalItems / $itemsPerPage))
                : 0;

            return new ApiListArticlePageResult($items, $totalItems, $totalPages, $page, $itemsPerPage);
        } catch (\Throwable) {
            return ApiListArticlePageResult::empty($page, $itemsPerPage);
        }
    }

    public function fetchItem(string $id): ?array
    {
        if ($id === '') {
            return null;
        }

        try {
            $response = $this->httpClient->request(
                'GET',
                $this->getCollectionUrl() . '/' . rawurlencode($id),
                ['timeout' => 30],
            );

            return $this->mapRemoteItemToNodeList($response->toArray());
        } catch (\Throwable) {
            return null;
        }
    }

    protected function mapCharismaArticleItem(mixed $item): array
    {
        $id = is_array($item) ? ($item['id'] ?? null) : ($item->id ?? null);
        $titre = is_array($item) ? ($item['titre'] ?? '') : ($item->titre ?? '');
        $resume = is_array($item) ? ($item['resume'] ?? null) : ($item->resume ?? null);
        $link = is_array($item) ? ($item['url'] ?? null) : ($item->url ?? null);

        $counter = null;
        $like = null;
        if (is_array($item)) {
            $counter = isset($item['vues']) ? (int) $item['vues'] : null;
            $like = isset($item['likes']) ? (int) $item['likes'] : null;
        } else {
            $counter = isset($item->vues) ? (int) $item->vues : null;
            $like = isset($item->likes) ? (int) $item->likes : null;
        }

        $mapped = [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => $resume !== null ? (string) $resume : null,
            'link' => $link !== null && $link !== '' ? (string) $link : null,
        ];

        if ($counter !== null && $counter !== 0) {
            $mapped['counter'] = $counter;
        }
        if ($like !== null && $like !== 0) {
            $mapped['like'] = $like;
        }

        return $mapped;
    }
}
