<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiFontsPageProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/fonts',
            provider: BuilderApiFontsPageProvider::class,
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiFontsPage
{
    /** @var list<array<string, mixed>> */
    public array $items = [];

    public int $total = 0;
}
