<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\DTO\BuilderApiCollectionItemData;
use App\State\BuilderApiCollectionResolveProcessor;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/page-builder/collections/resolve',
            processor: BuilderApiCollectionResolveProcessor::class,
            read: false,
            input: false,
            status: 200,
            outputFormats: ['json' => ['application/json']],
            security: 'true',
            stateless: false,
        ),
    ],
)]
final class BuilderApiCollectionResolveResponse
{
    /** @var list<BuilderApiCollectionItemData> */
    public array $items = [];
}
