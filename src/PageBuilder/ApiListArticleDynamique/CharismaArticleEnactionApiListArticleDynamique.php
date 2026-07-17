<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

/**
 * Articles En Action — sélection individuelle.
 *
 * Collection : GET https://api.charisma.fr/api/charisma/article/enactions
 * Item       : GET https://api.charisma.fr/api/charisma/article/enactions/{id}
 *
 * @deprecated since 2026-07 — remplacé par ApiCollectionDefinition (`charisma_article_enaction`). Conservé pour rollback / tests.
 */
final class CharismaArticleEnactionApiListArticleDynamique extends AbstractCharismaArticleApiListArticleDynamique
{
    public function getId(): string
    {
        return 'charisma_article_enaction';
    }

    public function getLabel(): string
    {
        return 'En Action';
    }

    protected function getCollectionUrl(): string
    {
        return 'https://api.charisma.fr/api/charisma/article/enactions';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        return $this->mapCharismaArticleItem($item);
    }
}
