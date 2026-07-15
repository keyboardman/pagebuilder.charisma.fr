<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticle;

/**
 * Comportement des collections fixes `ApiListArticle` (NodeListApi / NodeNavApi).
 * Distinct des ApiCard utilisées pour la sélection item-par-item dans la modale backend.
 */
interface ApiListArticleBehaviorInterface
{
    public function getCollectionMode(): string;
}

