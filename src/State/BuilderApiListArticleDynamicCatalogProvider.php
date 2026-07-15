<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListArticleDynamicCatalogResponse;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry;

/**
 * @implements ProviderInterface<BuilderApiListArticleDynamicCatalogResponse>
 */
final class BuilderApiListArticleDynamicCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListArticleDynamiqueRegistry $apiListArticleDynamiqueRegistry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListArticleDynamicCatalogResponse
    {
        $response = new BuilderApiListArticleDynamicCatalogResponse();
        $response->items = $this->apiListArticleDynamiqueRegistry->list();

        return $response;
    }
}
