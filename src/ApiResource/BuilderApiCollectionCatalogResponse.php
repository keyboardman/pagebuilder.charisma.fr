<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiCollectionCatalogProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/collections',
            provider: BuilderApiCollectionCatalogProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCollectionCatalogResponse
{
    /** @var list<array{id: string, label: string, type: string, supportedModes: list<string>}> */
    public array $items = [];
}
