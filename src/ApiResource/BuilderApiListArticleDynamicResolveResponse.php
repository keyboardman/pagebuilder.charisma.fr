<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\DTO\BuilderApiCardItemData;
use App\State\BuilderApiListArticleDynamicResolveProcessor;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/page-builder/lists/dynamic/resolve',
            processor: BuilderApiListArticleDynamicResolveProcessor::class,
            read: false,
            input: false,
            status: 200,
            outputFormats: ['json' => ['application/json']],
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiListArticleDynamicResolveResponse
{
    /** @var list<BuilderApiCardItemData> */
    public array $items = [];
}
