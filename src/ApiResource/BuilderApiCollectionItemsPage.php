<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\DTO\BuilderApiCollectionItemData;
use App\State\BuilderApiCollectionItemsPageProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/collections/{apiId}/items',
            provider: BuilderApiCollectionItemsPageProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCollectionItemsPage
{
    /** @var list<BuilderApiCollectionItemData> */
    public array $items = [];

    public int $totalItems = 0;

    public int $totalPages = 0;

    public int $page = 1;

    public int $itemsPerPage = 10;
}
