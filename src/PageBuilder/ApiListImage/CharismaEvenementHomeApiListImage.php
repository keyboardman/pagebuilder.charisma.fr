<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListImage;

/**
 * Endpoint NodeSlideshow : bannières événements home Charisma.
 */
final class CharismaEvenementHomeApiListImage extends ApiListImage
{
    protected const ENDPOINT_URL = 'https://api.charisma.fr/api/charisma/banniere/evenements/home';
    protected const COLLECTION_MODE = 'fixed';

    public function getId(): string
    {
        return 'charisma_evenement_home';
    }

    public function getLabel(): string
    {
        return 'Evènements Home';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        $id = is_array($item) ? ($item['id'] ?? null) : ($item->id ?? null);
        $image = is_array($item) ? ($item['source'] ?? null) : ($item->source ?? null);
        $link = is_array($item) ? ($item['link'] ?? null) : ($item->link ?? null);

        return [
            'id' => $id !== null ? (string) $id : '',
            'image' => $image !== null ? (string) $image : '',
            'link' => $link !== null ? (string) $link : null,
        ];
    }
}
