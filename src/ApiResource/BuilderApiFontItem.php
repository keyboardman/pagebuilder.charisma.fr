<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiFontItemProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/fonts/{id}',
            provider: BuilderApiFontItemProvider::class,
            requirements: ['id' => '\d+'],
            security: 'is_granted("IS_AUTHENTICATED_FULLY")',
            stateless: false,
        ),
    ],
)]
final class BuilderApiFontItem
{
    public int $id = 0;

    public string $name = '';

    public string $href = '';

    public string $fontFamily = '';

    public string $type = '';
}
