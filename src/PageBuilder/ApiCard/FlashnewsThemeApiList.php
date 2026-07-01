<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API list « Flashnews thèmes » : rubriques depuis https://www.flashnews.fr/api/themes
 */
final class FlashnewsThemeApiList extends AbstractApiCardList implements ApiCardBehaviorInterface
{
    private const BASE_URL = 'https://www.flashnews.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'flashnews-themes';
    }

    public function getLabel(): string
    {
        return 'Flashnews thèmes';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function getCollectionMode(): string
    {
        return 'fixed';
    }

    public function fetchCollection(array $params): array
    {
        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/api/themes', [
                'query' => [
                    'page' => '1',
                    'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 100))),
                    'pagination' => 'false',
                ],
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
        } catch (\Exception) {
            return ['items' => [], 'total' => 0];
        }
    }

    public function fetchItem(string $id): object
    {
        try {
            $response = $this->httpClient->request(
                'GET',
                self::BASE_URL . '/api/themes/' . rawurlencode($id),
                ['timeout' => 30]
            );

            return (object) $response->toArray();
        } catch (\Exception $e) {
            foreach ($this->fetchCollection(['limit' => 100])['items'] as $item) {
                if ((string) ($item->id ?? '') === $id) {
                    return $item;
                }
            }

            return (object) ['id' => $id, 'nom' => $id, 'link' => '#'];
        }
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $nom = $item->nom ?? $item->title ?? '';
        $link = $item->link ?? null;

        if ($link !== null && $link !== '') {
            $linkUrl = (string) $link;
        } elseif (isset($item->slug) && $item->slug !== '') {
            $linkUrl = self::BASE_URL . '/theme/' . rawurlencode((string) $item->slug);
        } else {
            $linkUrl = '#';
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $nom,
            'link' => $linkUrl,
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
