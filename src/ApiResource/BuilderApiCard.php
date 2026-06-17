<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\BuilderApiCardListProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/page-builder/cards',
            provider: BuilderApiCardListProvider::class,
            paginationEnabled: false,
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCard
{
    public string $id = '';

    public string $label = '';

    public string $type = '';

    public ?string $category = null;

    public string $collectionMode = 'normal';
}
