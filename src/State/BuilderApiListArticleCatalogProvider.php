<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListArticleCatalogResponse;
use App\PageBuilder\ApiListArticle\ApiListArticleRegistry;

/**
 * @implements ProviderInterface<BuilderApiListArticleCatalogResponse>
 */
final class BuilderApiListArticleCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListArticleRegistry $apiListArticleRegistry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListArticleCatalogResponse
    {
        $response = new BuilderApiListArticleCatalogResponse();
        $response->items = $this->apiListArticleRegistry->list();

        return $response;
    }
}

