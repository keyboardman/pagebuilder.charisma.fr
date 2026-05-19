<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * API card de type « list » (menus de navigation, listes de liens, etc.).
 */
interface ApiCardListInterface extends ApiCardInterface
{
    public function getType(): string; // retourne "list"
}
