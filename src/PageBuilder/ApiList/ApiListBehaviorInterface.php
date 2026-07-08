<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

/**
 * Comportement des collections fixes `ApiList` (NodeListApi / NodeNavApi).
 * Distinct des ApiCard utilisées pour la sélection item-par-item dans la modale backend.
 */
interface ApiListBehaviorInterface
{
    public function getCollectionMode(): string;
}

