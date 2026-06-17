<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiFontResolveResponse;
use App\PageBuilder\Api\BuilderApiFontEndpointProvider;
use Symfony\Component\HttpFoundation\Request;

/**
 * @implements ProviderInterface<BuilderApiFontResolveResponse>
 */
final class BuilderApiFontResolveProvider implements ProviderInterface
{
    public function __construct(
        private readonly BuilderApiFontEndpointProvider $fontEndpointProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiFontResolveResponse
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to resolve a font.');
        }

        $response = new BuilderApiFontResolveResponse();
        $response->font = $this->fontEndpointProvider->resolveFont($request);

        return $response;
    }
}
