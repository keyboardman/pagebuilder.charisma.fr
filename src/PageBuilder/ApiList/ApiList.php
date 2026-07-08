<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Base commune pour les collections fixes consommées par NodeListApi / NodeNavApi.
 *
 * Distinction avec ApiCard :
 * - ApiCard (/page-builder/cards) : sélection d'un item dans la modale backend (article, image…)
 * - ApiList (/page-builder/lists) : collection figée branchée telle quelle, sans modale ni pagination
 *
 * Chaque implémentation fournit un endpoint, un id, un label et un mapping item-par-item.
 */
abstract class ApiList implements ApiListBehaviorInterface
{
    protected const ENDPOINT_URL = '';
    protected const COLLECTION_MODE = 'fixed';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getCollectionMode(): string
    {
        return static::COLLECTION_MODE;
    }

    abstract public function getId(): string;

    abstract public function getLabel(): string;

    /**
     * @return list<array<string, mixed>>
     */
    public function fetchItems(): array
    {
        try {
            $response = $this->httpClient->request(
                'GET',
                static::ENDPOINT_URL,
                ['timeout' => 30]
            );

            $data = $response->toArray();
            $member = $data['member'] ?? [];
            if (!\is_array($member)) {
                $member = [];
            }

            return array_map(
                function (mixed $item): array {
                    $_item = $this->mapCollectionElement($item);
                    return $_item;
                },
                $member
            );
        } catch (\Throwable) {
            return [];
        }
    }

    /**
     * @param mixed $item
     */
    private function mapCollectionElement(mixed $item): array
    {
        return $this->mapRemoteItemToNodeList($item);
    }

    /**
     * @param mixed $item
     * @return array<string, mixed> déjà conforme au contrat `BuilderApiCardItemData`
     */
    abstract protected function mapRemoteItemToNodeList(mixed $item): array;
}

