<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

abstract class AbstractApiCardArticle implements ApiCardArticleInterface
{
    public function getType(): string
    {
        return 'article';
    }
}
