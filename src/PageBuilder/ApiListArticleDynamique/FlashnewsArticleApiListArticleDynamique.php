<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

use App\PageBuilder\ApiListArticle\ApiListArticlePageResult;

/**
 * Articles Flashnews — sélection individuelle.
 *
 * Collection : GET https://www.flashnews.fr/api/articles
 * Item       : GET https://www.flashnews.fr/api/articles/{id}
 *
 * @deprecated since 2026-07 — remplacé par ApiCollectionDefinition (`flashnews_article`). Conservé pour rollback / tests.
 */
final class FlashnewsArticleApiListArticleDynamique extends ApiListArticleDynamique
{
    private const COLLECTION_URL = 'https://www.flashnews.fr/api/articles';

    public function getId(): string
    {
        return 'flashnews_article';
    }

    public function getLabel(): string
    {
        return 'Flashnews';
    }

    public function fetchItems(array $params = []): ApiListArticlePageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = $this->normalizeItemsPerPage($params['itemsPerPage'] ?? 20);

        $query = [
            'order[publication]' => 'desc',
            'page' => (string) $page,
            'itemsPerPage' => (string) $itemsPerPage,
        ];
        if (!empty($params['search'])) {
            $query['titre'] = (string) $params['search'];
        }

        try {
            $response = $this->httpClient->request('GET', self::COLLECTION_URL, [
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
                self::COLLECTION_URL . '/' . rawurlencode($id),
                ['timeout' => 30],
            );

            return $this->mapRemoteItemToNodeList($response->toArray());
        } catch (\Throwable) {
            return null;
        }
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        if (!\is_array($item)) {
            return [
                'id' => '',
                'title' => '',
            ];
        }

        $id = $item['id'] ?? null;
        $titre = (string) ($item['titre'] ?? '');
        $description = $item['viewResume'] ?? null;
        $link = $item['link'] ?? null;
        $counter = $item['compteur'] ?? null;
        $likes = $item['likes'] ?? null;

        $mapped = [
            'id' => $id !== null ? (string) $id : '',
            'title' => $titre,
            'description' => $description !== null ? (string) $description : null,
            'link' => $link !== null ? (string) $link : null,
        ];

        if ($counter !== null && $counter !== '' && (string) $counter !== '0') {
            $mapped['counter'] = $counter;
        }
        if ($likes !== null && $likes !== '' && (string) $likes !== '0') {
            $mapped['like'] = $likes;
        }

        return $mapped;
    }
}
