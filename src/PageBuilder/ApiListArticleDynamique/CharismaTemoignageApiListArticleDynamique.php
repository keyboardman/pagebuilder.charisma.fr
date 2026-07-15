<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

use App\PageBuilder\ApiListArticle\ApiListArticlePageResult;

/**
 * Témoignages — sélection individuelle.
 *
 * Collection : GET https://api.charisma.fr/api/charisma/temoignages
 * Item       : GET https://api.charisma.fr/api/charisma/temoignages/{id}
 */
final class CharismaTemoignageApiListArticleDynamique extends AbstractCharismaArticleApiListArticleDynamique
{
    public function getId(): string
    {
        return 'charisma_temoignage';
    }

    public function getLabel(): string
    {
        return 'Témoignages';
    }

    protected function getCollectionUrl(): string
    {
        return 'https://api.charisma.fr/api/charisma/temoignages';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        $id = is_array($item) ? ($item['id'] ?? null) : ($item->id ?? null);
        $titre = is_array($item) ? ($item['titre'] ?? '') : ($item->titre ?? '');
        $resume = is_array($item) ? ($item['resume'] ?? null) : ($item->resume ?? null);
        $link = is_array($item) ? ($item['url'] ?? null) : ($item->url ?? null);
        $thumbnails = is_array($item) ? ($item['thumbnails'] ?? null) : ($item->thumbnails ?? null);

        $image = null;
        if (is_array($thumbnails) && !empty($thumbnails['normal'])) {
            $image = (string) $thumbnails['normal'];
        }

        $mapped = [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => $resume !== null ? (string) $resume : null,
            'link' => $link !== null && $link !== '' ? (string) $link : null,
        ];

        if ($image !== null && $image !== '') {
            $mapped['image'] = $image;
        }

        return $mapped;
    }
}
