<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCollectionItemsPage;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiCollectionItemsPage>
 */
final class BuilderApiCollectionItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCollectionRegistry $registry,
        private readonly BuilderApiResourceFactory $resourceFactory,
        private readonly ApiRequestParamHelper $requestParamHelper,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCollectionItemsPage
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $collection = $this->registry->get($apiId);
        if ($collection === null) {
            throw new NotFoundHttpException('API not found');
        }

        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to fetch collection items.');
        }

        $params = $this->requestParamHelper->buildDynamicListCollectionParams($request);
        $result = $collection->fetchItems($params);

        $page = new BuilderApiCollectionItemsPage();
        $page->totalItems = $result->totalItems;
        $page->totalPages = $result->totalPages;
        $page->page = $result->page;
        $page->itemsPerPage = $result->itemsPerPage;

        foreach ($result->items as $itemData) {
            $page->items[] = $this->resourceFactory->createCollectionItemData($itemData);
        }

        return $page;
    }
}
