<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiFormsCatalogProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/forms/catalog',
            provider: BuilderApiFormsCatalogProvider::class,
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiFormsCatalogResponse
{
    /** @var list<array{id: string, title: string, action: string, honeypotField: string}> */
    public array $items = [];
}
