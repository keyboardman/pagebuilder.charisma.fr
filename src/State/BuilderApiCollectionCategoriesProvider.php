<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCollectionCategoriesResponse;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiCollectionCategoriesResponse>
 */
final class BuilderApiCollectionCategoriesProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCollectionRegistry $registry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCollectionCategoriesResponse
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $collection = $this->registry->get($apiId);
        if ($collection === null) {
            throw new NotFoundHttpException('API not found');
        }

        $response = new BuilderApiCollectionCategoriesResponse();
        $response->categories = $collection->fetchCategories();

        return $response;
    }
}
