<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListImage;

/**
 * Comportement des collections fixes `ApiListImage` (slideshow, galeries…).
 * Distinct des ApiCard utilisées pour la sélection item-par-item dans la modale backend.
 */
interface ApiListImageBehaviorInterface
{
    public function getCollectionMode(): string;
}
