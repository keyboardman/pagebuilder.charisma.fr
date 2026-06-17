<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\State\BuilderApiFormSubmitProcessor;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/page-builder/forms/{slug}/submit',
            processor: BuilderApiFormSubmitProcessor::class,
            read: false,
            input: false,
            status: 200,
            outputFormats: ['json' => ['application/json']],
            security: 'true',
            stateless: false,
            requirements: ['slug' => '[a-z0-9][a-z0-9_-]*'],
        ),
    ],
)]
final class BuilderApiFormSubmitResponse
{
    public bool $success = false;

    public string $message = '';
}
