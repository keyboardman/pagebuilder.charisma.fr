<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListArticleItemsPage;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiListArticleItemsPage>
 */
final class BuilderApiListArticleDynamicItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListArticleDynamiqueRegistry $apiListArticleDynamiqueRegistry,
        private readonly BuilderApiResourceFactory $resourceFactory,
        private readonly ApiRequestParamHelper $requestParamHelper,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListArticleItemsPage
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $source = $this->apiListArticleDynamiqueRegistry->get($apiId);
        if ($source === null) {
            throw new NotFoundHttpException('API not found');
        }

        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to fetch dynamic list collection.');
        }

        $params = $this->requestParamHelper->buildDynamicListCollectionParams($request);
        $result = $source->fetchItems($params);

        $page = new BuilderApiListArticleItemsPage();
        $page->totalItems = $result->totalItems;
        $page->totalPages = $result->totalPages;
        $page->page = $result->page;
        $page->itemsPerPage = $result->itemsPerPage;

        foreach ($result->items as $itemData) {
            $page->items[] = $this->resourceFactory->createItemData($itemData);
        }

        return $page;
    }
}
