<?php

declare(strict_types=1);

namespace App\Controller;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/page-builder/api', name: 'app_page_builder_api_')]
class PageBuilderApiController extends AbstractController
{
    public function __construct(
        private readonly ApiCardRegistry $apiCardRegistry,
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

        $params = [
            'page' => max(1, (int) $request->query->get('page', 1)),
            'limit' => max(1, min(100, (int) $request->query->get('limit', 20))),
            'search' => $request->query->get('search'),
            'sort' => $request->query->get('sort'),
            'category' => $request->query->get('category'),
        ];
        $paramName = $card->getCategoryQueryParam();
        if ($paramName !== 'category' && $request->query->has('category')) {
            $params[$paramName] = $request->query->get('category');
        }

        $result = $card->fetchCollection($params);
        $items = $result['items'] ?? [];
        $total = $result['total'] ?? 0;

        $mapped = [];
        foreach ($items as $item) {
            $mapped[] = $this->mappedItemToArray($card->mapItem($item));
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

        return new JsonResponse($this->mappedItemToArray($mapped));
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

    /**
     * @param array{id: string, title: string, description?: string, image?: string, labels?: list<string>, link?: string, text?: string, raw: object} $mapped
     * @return array<string, mixed>
     */
    private function mappedItemToArray(array $mapped): array
    {
        $out = [
            'id' => $mapped['id'],
            'title' => $mapped['title'],
            'description' => $mapped['description'] ?? null,
            'image' => $mapped['image'] ?? null,
            'labels' => $mapped['labels'] ?? null,
            'link' => $mapped['link'] ?? null,
            'text' => $mapped['text'] ?? null,
        ];
        $raw = $mapped['raw'] ?? null;
        if ($raw !== null) {
            $out['raw'] = is_object($raw) ? (array) $raw : $raw;
        }
        return $out;
    }
}
