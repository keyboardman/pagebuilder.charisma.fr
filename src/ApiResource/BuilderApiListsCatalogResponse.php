<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiListsCatalogProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/lists',
            provider: BuilderApiListsCatalogProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListsCatalogResponse
{
    /** @var list<array{id: string, label: string, collectionMode: string}> */
    public array $items = [];
}

