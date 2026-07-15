<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListArticleItemsPage;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiListArticle\ApiListArticleRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiListArticleItemsPage>
 */
final class BuilderApiListArticleItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListArticleRegistry $apiListArticleRegistry,
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

        $list = $this->apiListArticleRegistry->get($apiId);
        if ($list === null) {
            throw new NotFoundHttpException('API not found');
        }

        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to fetch list collection.');
        }

        $params = $this->requestParamHelper->buildListCollectionParams($request);
        $result = $list->fetchItems($params);

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
