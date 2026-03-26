<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * API card de type « image ».
 */
interface ApiCardImageInterface extends ApiCardInterface
{
    public function getType(): string; // retourne "image"
}
