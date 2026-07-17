<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticle;

/**
 * Endpoint NodeListApi : articles home Flashnews.
 *
 * @deprecated since 2026-07 — remplacé par ApiCollectionDefinition (`flashnews_article_home`). Conservé pour rollback / tests.
 */
final class FlashnewsArticleHomeApiListArticle extends ApiListArticle
{
    private const BASE_URL = 'https://www.flashnews.fr';
    protected const ENDPOINT_URL = 'https://www.flashnews.fr/api/articles';
    protected const COLLECTION_MODE = 'fixed';

    protected function getFixedQueryParams(): array
    {
        return ['order[publication]' => 'desc'];
    }

    public function getId(): string
    {
        return 'flashnews_article_home';
    }

    public function getLabel(): string
    {
        return 'Flashnews (home)';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {

        $id = $item['id'] ?? null;
        $titre = (string)  $item['titre'] ?? '';
        $description = $item['viewResume'] ?? null;
        $link = $item['link'] ?? null;
        

        $counter = $item['compteur'] ?? null;
        $likes = $item['likes'] ?? null;

        $mapped = [
            'id' => $id !== null ? (string) $id : '',
            'title' => $titre,
            'description' => $description,
            'link' => $link,
        ];

        if ($counter !== null && $counter !== '' && (string) $counter !== '0') {
            $mapped['counter'] = $counter;
        }
        if ($likes !== null && $likes !== '' && (string) $likes !== '0') {
            $mapped['like'] = $likes;
        }

        return $mapped;
    }
}

