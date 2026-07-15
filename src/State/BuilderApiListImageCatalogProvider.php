<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListImageCatalogResponse;
use App\PageBuilder\ApiListImage\ApiListImageRegistry;

/**
 * @implements ProviderInterface<BuilderApiListImageCatalogResponse>
 */
final class BuilderApiListImageCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListImageRegistry $apiListImageRegistry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListImageCatalogResponse
    {
        $response = new BuilderApiListImageCatalogResponse();
        $response->items = $this->apiListImageRegistry->list();

        return $response;
    }
}
