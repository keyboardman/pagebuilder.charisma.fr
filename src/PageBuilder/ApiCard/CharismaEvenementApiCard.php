<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API card « Evenements » : événements depuis https://api.charisma.fr/api/charisma/evenements
 *
 * @deprecated since 2026-07 — remplacé par ApiCollectionDefinition (`charisma_evenement`). Conservé pour rollback / tests.
 */
final class CharismaEvenementApiCard extends AbstractApiCardImage implements ApiCardBehaviorInterface
{
    private const BASE_URL = 'https://api.charisma.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {}

    public function getId(): string
    {
        return 'charisma_evenement';
    }

    public function getLabel(): string
    {
        return 'Evènements';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function getCollectionMode(): string
    {
        return 'normal';
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
        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/evenements', [
                'query' => $query,
                'timeout' => 30,
            ]);
            $data = $response->toArray();
            $member = $data['member'] ?? [];
            $totalItems = (int) ($data['totalItems'] ?? 0);
            $items = array_map(static fn (mixed $item): object => (object) (is_array($item) ? $item : []), $member);

            return ['items' => $items, 'total' => $totalItems];
        } catch (\Throwable) {
            return ['items' => [], 'total' => 0];
        }
    }

    public function fetchItem(string $id): object
    {
        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/evenements/' . rawurlencode($id), [
                'timeout' => 30,
            ]);
            $data = $response->toArray();

            return (object) $data;
        } catch (\Throwable) {
            return (object) ['id' => $id];
        }
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $title = $item->titre ?? ($item->title ?? '');
        $resume = $item->resume ?? null;
        $image = $item->image ?? null;
        $thumbnails = $item->thumbnails ?? null;
        $url = $item->url ?? null;

        $imageUrl = null;
        if (is_array($thumbnails) && !empty($thumbnails['normal'])) {
            $imageUrl = (string) $thumbnails['normal'];
        } elseif (is_string($image) && $image !== '') {
            $imageUrl = str_starts_with($image, 'http') ? $image : (self::BASE_URL . (str_starts_with($image, '/') ? '' : '/') . $image);
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $title,
            'description' => null,
            'image' => $imageUrl,
            'labels' => null,
            'link' => is_string($url) && $url !== '' ? $url : null,
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