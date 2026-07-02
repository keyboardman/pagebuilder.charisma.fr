<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * API card « Evenements retrospective » : bannières depuis
 * https://api.charisma.fr/api/charisma/banniere/evenements/retrospective
 */
final class CharismaEvenementRetrospectiveApiCard extends AbstractApiCardImage implements ApiCardBehaviorInterface
{
    private const BASE_URL = 'https://api.charisma.fr';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {}

    public function getId(): string
    {
        return 'charisma_evenement_retrospective';
    }

    public function getLabel(): string
    {
        return 'Evènements retrospective';
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
        $query = [
            'page' => (string) max(1, (int) ($params['page'] ?? 1)),
            'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 50))),
        ];
        if (!empty($params['search'])) {
            $query['titre'] = (string) $params['search'];
        }

        try {
            $response = $this->httpClient->request('GET', self::BASE_URL . '/api/charisma/banniere/evenements/retrospective', [
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
        return (object) [];
    }

    public function mapItem(object $item): array
    {
        $id = $item->id ?? null;
        $title = $item->titre ?? ($item->title ?? '');
        $image = $item->source ?? null;
        $link = $item->link ?? null;

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $title,
            'image' => $image,
            'link' => $link ?? null,
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
