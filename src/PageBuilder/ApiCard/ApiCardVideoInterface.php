<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * API card de type « vidéo ».
 */
interface ApiCardVideoInterface extends ApiCardInterface
{
    public function getType(): string; // retourne "video"
}
