<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

abstract class AbstractApiCardList implements ApiCardListInterface
{
    public function getType(): string
    {
        return 'list';
    }
}
