<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\PageBuilder\Api\ApiMappedItemNormalizer;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\PageBuilder\ApiCard\ApiCardRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/page-builder/api', name: 'app_page_builder_api_')]
final class PageBuilderApiCardsController extends AbstractController
{
    public function __construct(
        private readonly ApiCardRegistry $apiCardRegistry,
        private readonly ApiRequestParamHelper $requestParamHelper,
        private readonly ApiMappedItemNormalizer $mappedItemNormalizer,
    ) {
    }

    #[Route('/cards', name: 'cards_list', methods: ['GET'])]
    public function listCards(): JsonResponse
    {
        return new JsonResponse($this->apiCardRegistry->list());
    }

    #[Route('/cards/{id}/items', name: 'cards_items', methods: ['GET'])]
    public function collection(string $id, Request $request): Response
    {
        $card = $this->apiCardRegistry->get($id);
        if ($card === null) {
            return new JsonResponse(['error' => 'API not found'], Response::HTTP_NOT_FOUND);
        }

        $params = $this->requestParamHelper->buildCardCollectionParams($request, $card->getCategoryQueryParam());

        $result = $card->fetchCollection($params);
        $items = $result['items'] ?? [];
        $total = $result['total'] ?? 0;

        $mapped = [];
        foreach ($items as $item) {
            $mapped[] = $this->mappedItemNormalizer->normalize($card->mapItem($item));
        }

        return new JsonResponse(['items' => $mapped, 'total' => $total]);
    }

    #[Route('/cards/{id}/items/{itemId}', name: 'cards_item', methods: ['GET'], requirements: ['itemId' => '[^/]+'])]
    public function item(string $id, string $itemId): Response
    {
        $card = $this->apiCardRegistry->get($id);
        if ($card === null) {
            return new JsonResponse(['error' => 'API not found'], Response::HTTP_NOT_FOUND);
        }

        try {
            $raw = $card->fetchItem($itemId);
        } catch (\Throwable) {
            return new JsonResponse(['error' => 'Item not found'], Response::HTTP_NOT_FOUND);
        }

        $mapped = $card->mapItem($raw);

        return new JsonResponse($this->mappedItemNormalizer->normalize($mapped));
    }

    #[Route('/cards/{id}/categories', name: 'cards_categories', methods: ['GET'])]
    public function categories(string $id): Response
    {
        $card = $this->apiCardRegistry->get($id);
        if ($card === null) {
            return new JsonResponse(['error' => 'API not found'], Response::HTTP_NOT_FOUND);
        }

        $categories = $card->fetchCategories();
        if ($categories === null) {
            return new JsonResponse([]);
        }

        return new JsonResponse($categories);
    }
}
