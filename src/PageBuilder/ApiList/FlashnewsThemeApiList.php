<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

/**
 * Liste « Flashnews thèmes » depuis https://www.flashnews.fr/api/themes
 */
final class FlashnewsThemeApiList extends ApiList
{
    private const BASE_URL = 'https://www.flashnews.fr';

    protected const ENDPOINT_URL = 'https://www.flashnews.fr/api/themes';

    protected function supportsPagination(): bool
    {
        return false;
    }

    protected function getFixedQueryParams(): array
    {
        return ['pagination' => 'false'];
    }
    protected const COLLECTION_MODE = 'fixed';

    public function getId(): string
    {
        return 'flashnews-themes';
    }

    public function getLabel(): string
    {
        return 'Flashnews thèmes';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        
        $id = $item['id'] ?? null;
        $title = (string) $item['nom'] ?? '';
        $link = (string) $item['link'] ?? null;

        

        return [
            'id' => $id !== null ? (string) $id : '',
            'title' => $title,
            'link' => $link,
        ];
    }
}

