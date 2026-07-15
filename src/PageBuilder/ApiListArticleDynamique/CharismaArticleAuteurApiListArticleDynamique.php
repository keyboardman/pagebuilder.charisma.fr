<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

/**
 * Articles Auteur — sélection individuelle.
 *
 * Collection : GET https://api.charisma.fr/api/charisma/article/auteurs
 * Item       : GET https://api.charisma.fr/api/charisma/article/auteurs/{id}
 */
final class CharismaArticleAuteurApiListArticleDynamique extends AbstractCharismaArticleApiListArticleDynamique
{
    public function getId(): string
    {
        return 'charisma_article_auteur';
    }

    public function getLabel(): string
    {
        return 'Articles Auteur';
    }

    protected function getCollectionUrl(): string
    {
        return 'https://api.charisma.fr/api/charisma/article/auteurs';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        return $this->mapCharismaArticleItem($item);
    }
}
