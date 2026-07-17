<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

/**
 * Articles Expressions — sélection individuelle.
 *
 * Collection : GET https://api.charisma.fr/api/charisma/article/expressions
 * Item       : GET https://api.charisma.fr/api/charisma/article/expressions/{id}
 *
 * @deprecated since 2026-07 — remplacé par ApiCollectionDefinition (`charisma_article_expression`). Conservé pour rollback / tests.
 */
final class CharismaArticleExpressionApiListArticleDynamique extends AbstractCharismaArticleApiListArticleDynamique
{
    public function getId(): string
    {
        return 'charisma_article_expression';
    }

    public function getLabel(): string
    {
        return 'Expressions';
    }

    protected function getCollectionUrl(): string
    {
        return 'https://api.charisma.fr/api/charisma/article/expressions';
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        return $this->mapCharismaArticleItem($item);
    }
}
