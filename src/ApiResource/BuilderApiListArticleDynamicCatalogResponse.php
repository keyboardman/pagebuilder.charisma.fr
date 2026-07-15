<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiListArticleDynamicCatalogProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/lists/dynamic',
            provider: BuilderApiListArticleDynamicCatalogProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListArticleDynamicCatalogResponse
{
    /** @var list<array{id: string, label: string}> */
    public array $items = [];
}
