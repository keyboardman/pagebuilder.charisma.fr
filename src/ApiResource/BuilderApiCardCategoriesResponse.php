<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiCardCategoriesProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/cards/{apiId}/categories',
            provider: BuilderApiCardCategoriesProvider::class,
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCardCategoriesResponse
{
    /** @var list<array{id: string, label: string}> */
    public array $categories = [];
}
