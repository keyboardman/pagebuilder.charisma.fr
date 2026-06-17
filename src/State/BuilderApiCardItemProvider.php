<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCardItem;
use App\PageBuilder\Api\ApiCardEndpointProvider;
use App\PageBuilder\Api\ApiCardEndpointProviderException;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiCardItem>
 */
final class BuilderApiCardItemProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCardEndpointProvider $apiCardEndpointProvider,
        private readonly BuilderApiResourceFactory $resourceFactory,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCardItem
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        $itemId = (string) ($uriVariables['itemId'] ?? '');

        if ($apiId === '' || $itemId === '') {
            throw new NotFoundHttpException('Item not found');
        }

        try {
            return $this->resourceFactory->createItem(
                $this->apiCardEndpointProvider->getItem($apiId, $itemId)
            );
        } catch (ApiCardEndpointProviderException $e) {
            if ($e->reason === ApiCardEndpointProviderException::API_NOT_FOUND) {
                throw new NotFoundHttpException('API not found', $e);
            }

            if ($e->reason === ApiCardEndpointProviderException::ITEM_NOT_FOUND) {
                throw new NotFoundHttpException('Item not found', $e);
            }

            throw $e;
        }
    }
}
