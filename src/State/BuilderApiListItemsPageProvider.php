<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiListItemsPage;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiList\ApiListRegistry;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<BuilderApiListItemsPage>
 */
final class BuilderApiListItemsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiListRegistry $apiListRegistry,
        private readonly BuilderApiResourceFactory $resourceFactory,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListItemsPage
    {
        $apiId = (string) ($uriVariables['apiId'] ?? '');
        if ($apiId === '') {
            throw new NotFoundHttpException('API not found');
        }

        $list = $this->apiListRegistry->get($apiId);
        if ($list === null) {
            throw new NotFoundHttpException('API not found');
        }

        $page = new BuilderApiListItemsPage();
        foreach ($list->fetchItems() as $itemData) {
            $page->items[] = $this->resourceFactory->createItemData($itemData);
        }

        return $page;
    }
}

