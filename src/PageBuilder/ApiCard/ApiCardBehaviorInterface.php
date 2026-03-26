<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Comportements optionnels d'une API card côté builder.
 */
interface ApiCardBehaviorInterface
{
    /**
     * Mode de collection supporté par défaut: "normal" ou "fixed".
     */
    public function getCollectionMode(): string;
}

