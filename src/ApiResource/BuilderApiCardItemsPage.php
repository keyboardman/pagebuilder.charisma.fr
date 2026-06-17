<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\DTO\BuilderApiCardItemData;
use App\State\BuilderApiCardItemsPageProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/cards/{apiId}/items',
            provider: BuilderApiCardItemsPageProvider::class,
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCardItemsPage
{
    /** @var list<BuilderApiCardItemData> */
    public array $items = [];

    public int $total = 0;
}
