<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiCollectionCategoriesProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/collections/{apiId}/categories',
            provider: BuilderApiCollectionCategoriesProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCollectionCategoriesResponse
{
    /** @var list<array{id: string, label: string}> */
    public array $categories = [];
}
