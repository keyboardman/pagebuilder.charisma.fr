<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

/**
 * Liste « Expressions » (home) depuis
 * https://api.charisma.fr/api/charisma/article/expressions/home
 */
final class CharismaArticleExpressionHomeApiList extends ApiList
{
    protected const ENDPOINT_URL = 'https://api.charisma.fr/api/charisma/article/expressions';
    protected const COLLECTION_MODE = 'fixed';

    public function getId(): string
    {
        return 'charisma_article_expression_home';
    }

    public function getLabel(): string
    {
        return 'Expressions (home)';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {

        $id = is_array($item) ? ($item['id'] ?? null) : ($item->id ?? null);
        $titre = is_array($item) ? ($item['titre'] ?? '') : ($item->titre ?? '');
        $resume = is_array($item) ? ($item['resume'] ?? null) : ($item->resume ?? null);
        $link = is_array($item) ? ($item['url'] ?? null) : ($item->url ?? null);

        $counter = null;
        $like = null;
        if (is_array($item)) {
            $counter = isset($item['vues']) ? (int) $item['vues'] : null;
            $like = isset($item['likes']) ? (int) $item['likes'] : null;
        } else {
            $counter = isset($item->vues) ? (int) $item->vues : null;
            $like = isset($item->likes) ? (int) $item->likes : null;
        }

        $mapped = [
            'id' => $id !== null ? (string) $id : '',
            'title' => (string) $titre,
            'description' => $resume !== null ? (string) $resume : null,
            'link' => $link !== null && $link !== '' ? (string) $link : null,
        ];

        if ($counter !== null && $counter !== 0) {
            $mapped['counter'] = $counter;
        }
        if ($like !== null && $like !== 0) {
            $mapped['like'] = $like;
        }

        return $mapped;
    }
}

