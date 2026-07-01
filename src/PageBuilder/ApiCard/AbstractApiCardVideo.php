<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

abstract class AbstractApiCardVideo implements ApiCardVideoInterface
{
    public function getType(): string
    {
        return 'video';
    }
}
