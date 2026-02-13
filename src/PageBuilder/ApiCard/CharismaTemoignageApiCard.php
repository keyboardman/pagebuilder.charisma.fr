<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API card « Articles Témoignage » : articles depuis https://api.charisma.fr/api/charisma/temoignages
 */
final class CharismaTemoignageApiCard implements ApiCardArticleInterface
{
    private const BASE_URL = 'https://api.charisma.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'charisma_article_temoignage';
    }

    public function getLabel(): string
    {
        return 'Articles Témoignage';
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

        $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/temoignages', [
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
        $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/temoignages/' . rawurlencode($id));
        $data = $response->toArray();
        return (object) $data;
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $titre = $item->titre ?? '';
        $resume = $item->resume ?? null;
        $theme = $item->theme ?? null;
        $link = $item->url ?? null;
        $thumbnails = $item->thumbnails ?? null;

        
        $labels = [];
        if (!empty($theme)) {
            $labels[] = $theme->nom;    
        }
        $image = null;
        if (!empty($thumbnails)) {
            $image = (string) $thumbnails['normal'];
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => null,
            'image' => $image,
            'labels' => $labels ?: null,
            'link' => $link !== null ? (string) $link : null,
            'text' => $resume !== null ? (string) $resume : null,
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
