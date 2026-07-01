<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

abstract class AbstractApiCardImage implements ApiCardImageInterface
{
    public function getType(): string
    {
        return 'image';
    }
}
