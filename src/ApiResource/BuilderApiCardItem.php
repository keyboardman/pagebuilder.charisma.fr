<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\BuilderApiCardItemProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/page-builder/cards/{apiId}/items/{itemId}',
            provider: BuilderApiCardItemProvider::class,
            requirements: ['itemId' => '.+'],
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCardItem
{
    public string $id = '';

    public string $title = '';

    public ?string $description = null;

    public ?string $image = null;

    /** @var list<string>|null */
    public ?array $labels = null;

    public ?string $link = null;

    public ?string $text = null;

    public ?string $counter = null;

    public ?string $like = null;

    /** @var array<string, mixed>|null */
    public ?array $raw = null;
}
