<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListImageItemsPage;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiListImage\ApiListImageRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiListImageItemsPage>
 */
final class BuilderApiListImageItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListImageRegistry $apiListImageRegistry,
        private readonly BuilderApiResourceFactory $resourceFactory,
        private readonly ApiRequestParamHelper $requestParamHelper,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListImageItemsPage
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $list = $this->apiListImageRegistry->get($apiId);
        if ($list === null) {
            throw new NotFoundHttpException('API not found');
        }

        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to fetch list collection.');
        }

        $params = $this->requestParamHelper->buildListCollectionParams($request);
        $result = $list->fetchItems($params);

        $page = new BuilderApiListImageItemsPage();
        $page->totalItems = $result->totalItems;
        $page->totalPages = $result->totalPages;
        $page->page = $result->page;
        $page->itemsPerPage = $result->itemsPerPage;

        foreach ($result->items as $itemData) {
            $page->items[] = $this->resourceFactory->createListImageItemData($itemData);
        }

        return $page;
    }
}
