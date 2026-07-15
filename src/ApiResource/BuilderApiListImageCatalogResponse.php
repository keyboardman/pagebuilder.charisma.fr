<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiListImageCatalogProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/lists-image',
            provider: BuilderApiListImageCatalogProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListImageCatalogResponse
{
    /** @var list<array{id: string, label: string, collectionMode: string}> */
    public array $items = [];
}
