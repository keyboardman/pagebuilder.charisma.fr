<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiFormsCatalogResponse;
use App\PageBuilder\Api\BuilderApiFormEndpointProvider;

/**
 * @implements ProviderInterface<BuilderApiFormsCatalogResponse>
 */
final class BuilderApiFormsCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly BuilderApiFormEndpointProvider $formEndpointProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiFormsCatalogResponse
    {
        $response = new BuilderApiFormsCatalogResponse();
        $response->items = $this->formEndpointProvider->listCatalogItems();

        return $response;
    }
}
