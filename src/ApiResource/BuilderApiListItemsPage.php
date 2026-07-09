<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\DTO\BuilderApiCardItemData;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/lists/{apiId}/items',
            provider: \App\State\BuilderApiListItemsPageProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListItemsPage
{
    /** @var list<BuilderApiCardItemData> */
    public array $items = [];

    public int $totalItems = 0;

    public int $totalPages = 0;

    public int $page = 1;

    public int $itemsPerPage = 10;
}

