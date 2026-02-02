<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API card « Videos » : médias vidéo depuis https://content.charisma.fr/web/api/media
 */
final class CharismaVideosApiCard implements ApiCardVideoInterface
{
    private const BASE_URL = 'https://content.charisma.fr/web/api';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'videos';
    }

    public function getLabel(): string
    {
        return 'Videos';
    }

    public function getType(): string
    {
        return 'video';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function fetchCollection(array $params): array
    {
        $query = [
            'sites' => '1',
            'page' => (string) max(1, (int) ($params['page'] ?? 1)),
            'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 50))),
        ];
        if (!empty($params['search'])) {
            $query['title'] = (string) $params['search'];
        }
        $sort = !empty($params['sort']) ? (string) $params['sort'] : 'title';
        $query['order[' . $sort . ']'] = 'asc';
        if (!empty($params['category'])) {
            $query['categoriesWebTV'] = (string) $params['category'];
        }

        $response = $this->httpClient->request('GET', self::BASE_URL . '/media.jsonld', [
            'query' => $query,
        ]);
        $data = $response->toArray();
        $member = $data['hydra:member'] ?? [];
        $totalItems = (int) ($data['hydra:totalItems'] ?? 0);
        $items = array_map(static fn (mixed $item): object => (object) (is_array($item) ? $item : []), $member);

        return ['items' => $items, 'total' => $totalItems];
    }

    public function fetchItem(string $id): object
    {
        $response = $this->httpClient->request('GET', self::BASE_URL . '/media/' . rawurlencode($id) . '.json');
        $data = $response->toArray();
        return (object) $data;
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $title = $item->title ?? '';
        $thumbnails = $item->thumbnails ?? null;
        
        $original = $item->original ?? null;
        $play = $item->play ?? null;

        $image = null;
        if (\is_array($thumbnails) && isset($thumbnails['medium']) && $thumbnails['medium'] !== null && $thumbnails['medium'] !== '') {
            $image = (string) $thumbnails['medium'];
        } elseif ($original !== null && $original !== '') {
            $image = (string) $original;
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $title,
            'description' => null,
            'image' => $image,
            'labels' => null,
            'link' => $play !== null ? (string) $play : null,
            'text' => null,
            'raw' => $item,
        ];
    }

    public function fetchCategories(): ?array
    {
        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/categories.json', [
                'query' => ['order[nom]' => 'asc', 'pagination' => 'false'],
            ]);
            $data = $response->toArray();
            if (!is_array($data)) {
                return [];
            }
            $out = [];
            foreach ($data as $cat) {
                $c = is_array($cat) ? (object) $cat : $cat;
                $id = $c->id ?? null;
                $nom = $c->nom ?? '';
                if ($id !== null) {
                    $out[] = ['id' => (string) $id, 'label' => (string) $nom];
                }
            }
            return $out;
        } catch (\Throwable) {
            return [];
        }
    }

    public function getCategoryQueryParam(): string
    {
        return 'categoriesWebTV';
    }
}
