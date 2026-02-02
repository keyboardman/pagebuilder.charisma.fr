<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API card « Flashnews » : articles depuis https://www.flashnews.fr/api/articles
 */
final class FlashnewsApiCard implements ApiCardArticleInterface
{
    private const BASE_URL = 'https://www.flashnews.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'flashnews';
    }

    public function getLabel(): string
    {
        return 'Flashnews';
    }

    public function getType(): string
    {
        return 'article';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function fetchCollection(array $params): array
    {
        $query = [
            'page' => (string) max(1, (int) ($params['page'] ?? 1)),
            'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 50))),
        ];
        if (!empty($params['search'])) {
            $query['titre'] = (string) $params['search'];
        }
        if (!empty($params['sort'])) {
            $query['order[' . (string) $params['sort'] . ']'] = 'asc';
        }

        $response = $this->httpClient->request('GET', self::BASE_URL . '/api/articles', [
            'query' => $query,
        ]);
        $data = $response->toArray();
        $member = $data['member'] ?? [];
        $totalItems = (int) ($data['totalItems'] ?? 0);
        $items = array_map(static fn (mixed $item): object => (object) (is_array($item) ? $item : []), $member);

        return ['items' => $items, 'total' => $totalItems];
    }

    public function fetchItem(string $id): object
    {
        $response = $this->httpClient->request('GET', self::BASE_URL . '/api/articles/' . rawurlencode($id));
        $data = $response->toArray();
        return (object) $data;
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $titre = $item->titre ?? '';
        $viewResume = $item->viewResume ?? null;
        $tags = $item->tags ?? null;
        $image = $item->image ?? null;
        $viewUrl = $item->viewUrl ?? null;

        $imageUrl = null;
        if ($image !== null && $image !== '') {
            $imageUrl = self::BASE_URL . (str_starts_with((string) $image, '/') ? '' : '/') . $image;
        }
        $linkUrl = null;
        if ($viewUrl !== null && $viewUrl !== '') {
            $linkUrl = self::BASE_URL . (str_starts_with((string) $viewUrl, '/') ? '' : '/') . $viewUrl;
        }
        $labels = null;
        if (is_array($tags)) {
            $labels = array_map('strval', $tags);
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => null,
            'image' => $imageUrl,
            'labels' => $labels,
            'link' => $linkUrl,
            'text' => $viewResume !== null ? (string) $viewResume : null,
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
