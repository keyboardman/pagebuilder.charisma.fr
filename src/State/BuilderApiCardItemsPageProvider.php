<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCardItemsPage;
use App\PageBuilder\Api\ApiCardEndpointProvider;
use App\PageBuilder\Api\ApiCardEndpointProviderException;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiCardItemsPage>
 */
final class BuilderApiCardItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCardEndpointProvider $apiCardEndpointProvider,
        private readonly ApiRequestParamHelper $requestParamHelper,
        private readonly BuilderApiResourceFactory $resourceFactory,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCardItemsPage
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to fetch card collection.');
        }

        try {
            $params = $this->requestParamHelper->buildCardCollectionParams(
                $request,
                $this->apiCardEndpointProvider->getCardCategoryParamName($apiId)
            );

            return $this->resourceFactory->createItemsPage(
                $this->apiCardEndpointProvider->getCollection($apiId, $params)
            );
        } catch (ApiCardEndpointProviderException $e) {
            if ($e->reason === ApiCardEndpointProviderException::API_NOT_FOUND) {
                throw new NotFoundHttpException('API not found', $e);
            }

            throw $e;
        }
    }
}
