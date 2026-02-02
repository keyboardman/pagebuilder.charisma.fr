<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * API card de type « article » (blog, actualités, etc.).
 */
interface ApiCardArticleInterface extends ApiCardInterface
{
    public function getType(): string; // retourne "article"
}
