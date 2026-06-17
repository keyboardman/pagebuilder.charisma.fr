<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCardCategoriesResponse;
use App\PageBuilder\Api\ApiCardEndpointProvider;
use App\PageBuilder\Api\ApiCardEndpointProviderException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiCardCategoriesResponse>
 */
final class BuilderApiCardCategoriesProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCardEndpointProvider $apiCardEndpointProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCardCategoriesResponse
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        try {
            $response = new BuilderApiCardCategoriesResponse();

            foreach ($this->apiCardEndpointProvider->getCategories($apiId) as $categoryData) {
                $response->categories[] = [
                    'id' => $categoryData['id'],
                    'label' => $categoryData['label'],
                ];
            }

            return $response;
        } catch (ApiCardEndpointProviderException $e) {
            if ($e->reason === ApiCardEndpointProviderException::API_NOT_FOUND) {
                throw new NotFoundHttpException('API not found', $e);
            }

            throw $e;
        }
    }
}
