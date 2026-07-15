<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\DTO\BuilderApiListImageItemData;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/lists-image/{apiId}/items',
            provider: \App\State\BuilderApiListImageItemsPageProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListImageItemsPage
{
    /** @var list<BuilderApiListImageItemData> */
    public array $items = [];

    public int $totalItems = 0;

    public int $totalPages = 0;

    public int $page = 1;

    public int $itemsPerPage = 10;
}
