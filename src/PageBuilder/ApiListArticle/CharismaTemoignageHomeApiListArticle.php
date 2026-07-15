<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticle;

/**
 * Endpoint NodeListApi : témoignages home Charisma.
 */
final class CharismaTemoignageHomeApiListArticle extends ApiListArticle
{
    protected const ENDPOINT_URL = 'https://api.charisma.fr/api/charisma/temoignages';
    protected const COLLECTION_MODE = 'fixed';

    public function getId(): string
    {
        return 'charisma_temoignage_home';
    }

    public function getLabel(): string
    {
        return 'Témoignages (home)';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        $raw = is_array($item) ? (object) $item : $item;

        $id = is_array($item) ? ($item['id'] ?? null) : ($item->id ?? null);
        $titre = is_array($item) ? ($item['titre'] ?? '') : ($item->titre ?? '');
        $resume = is_array($item) ? ($item['resume'] ?? null) : ($item->resume ?? null);
        
        $link = is_array($item) ? ($item['url'] ?? null) : ($item->url ?? null);
        $thumbnails = is_array($item) ? ($item['thumbnails'] ?? null) : ($item->thumbnails ?? null);



        $image = null;
        if (is_array($thumbnails) && !empty($thumbnails['normal'])) {
            $image = (string) $thumbnails['normal'];
        }

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => $resume !== null ? (string) $resume : null,

            'image' => $image,
            'link' => $link !== null ? (string) $link : null
        ];
    }
}

