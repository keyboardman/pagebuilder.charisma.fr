<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiFontResolveProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/fonts/resolve',
            provider: BuilderApiFontResolveProvider::class,
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiFontResolveResponse
{
    /** @var array<string, mixed>|null */
    public ?array $font = null;
}
