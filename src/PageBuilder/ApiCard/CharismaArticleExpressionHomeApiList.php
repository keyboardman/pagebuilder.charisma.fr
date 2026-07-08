<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Liste « Expressions » (home) depuis https://api.charisma.fr/api/charisma/article/expressions/home
 *
 * Mapping endpoint → builder :
 * - titre → title
 * - resume → description
 * - vues → counter
 * - likes → like
 * - url → link
 */
final class CharismaArticleExpressionHomeApiList extends AbstractApiCardList implements ApiCardBehaviorInterface
{
    private const BASE_URL = 'https://api.charisma.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'charisma_article_expression_home';
    }

    public function getLabel(): string
    {
        return 'Expressions (home)';
    }

    public function getCategory(): ?string
    {
        return 'charisma';
    }

    public function getCollectionMode(): string
    {
        return 'fixed';
    }

    public function fetchCollection(array $params): array
    {
        $query = [
            'page' => (string) max(1, (int) ($params['page'] ?? 1)),
            'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 100))),
        ];
        if (!empty($params['search'])) {
            $query['titre'] = (string) $params['search'];
        }

        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/article/expressions/home', [
                'query' => $query,
                'timeout' => 30,
            ]);
            $data = $response->toArray();
            $member = $data['member'] ?? [];
            $totalItems = (int) ($data['totalItems'] ?? \count($member));
            $items = array_map(
                static fn (mixed $item): object => (object) (is_array($item) ? $item : []),
                $member
            );

            return ['items' => $items, 'total' => $totalItems];
        } catch (\Throwable) {
            return ['items' => [], 'total' => 0];
        }
    }

    public function fetchItem(string $id): object
    {
        try {
            $response = $this->httpClient->request(
                'GET',
                self::BASE_URL . '/api/charisma/article/expressions/' . rawurlencode($id),
                ['timeout' => 30]
            );

            return (object) $response->toArray();
        } catch (\Throwable) {
            foreach ($this->fetchCollection(['limit' => 100])['items'] as $item) {
                if ((string) ($item->id ?? '') === $id) {
                    return $item;
                }
            }

            return (object) ['id' => $id, 'titre' => $id, 'url' => '#'];
        }
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $link = $item->url ?? null;

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) ($item->titre ?? ''),
            'description' => isset($item->resume) ? (string) $item->resume : null,
            'image' => null,
            'link' => $link !== null && $link !== '' ? (string) $link : null,
            'counter' => isset($item->vues) ? (int) $item->vues : null,
            'like' => isset($item->likes) ? (int) $item->likes : null,
            'raw' => $item,
        ];
    }

    public function fetchCategories(): ?array
    {
        return null;
    }

    public function getCategoryQueryParam(): string
    {
        return 'category';
    }
}
