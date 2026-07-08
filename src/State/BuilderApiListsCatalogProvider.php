<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListsCatalogResponse;
use App\PageBuilder\ApiList\ApiListRegistry;

/**
 * @implements ProviderInterface<BuilderApiListsCatalogResponse>
 */
final class BuilderApiListsCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListRegistry $apiListRegistry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListsCatalogResponse
    {
        $response = new BuilderApiListsCatalogResponse();
        $response->items = $this->apiListRegistry->list();

        return $response;
    }
}

