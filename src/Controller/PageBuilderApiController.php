<?php

declare(strict_types=1);

namespace App\Controller;

use App\BuilderForm\BuilderFormCatalogService;
use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\Service\PageFontResolverService;
use App\Service\ThemeFontBuilderService;
use Doctrine\ORM\EntityManagerInterface;
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
        private readonly BuilderFormCatalogService $builderFormCatalog,
        private readonly EntityManagerInterface $em,
        private readonly ThemeFontBuilderService $themeFontBuilderService,
        private readonly PageFontResolverService $pageFontResolverService,
    ) {
    }

    #[Route('/forms/catalog', name: 'forms_catalog', methods: ['GET'])]
    public function formsCatalog(): JsonResponse
    {
        return new JsonResponse(['items' => $this->builderFormCatalog->listItems()]);
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

    #[Route('/fonts/resolve', name: 'fonts_resolve', methods: ['GET'])]
    public function resolveFont(Request $request): JsonResponse
    {
        $family = trim((string) $request->query->get('family', ''));
        if ($family === '') {
            return new JsonResponse(['error' => 'family is required'], Response::HTTP_BAD_REQUEST);
        }

        $font = $this->pageFontResolverService->findFontByPrimaryFamily($family);
        if ($font === null || $font->getType() === FontTypeEnum::Native) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $excludeIds = $this->parseExcludeIds($request);
        if ($font->getId() !== null && isset($excludeIds[$font->getId()])) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $payload = $this->themeFontBuilderService->buildFontPayload($font);
        if ($payload === null) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($payload);
    }

    #[Route('/fonts', name: 'fonts_list', methods: ['GET'])]
    public function listFonts(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(100, (int) $request->query->get('limit', 20)));
        $search = trim((string) $request->query->get('search', ''));
        $typeFilter = trim((string) $request->query->get('type', ''));
        $excludeNative = filter_var($request->query->get('excludeNative', '1'), \FILTER_VALIDATE_BOOL);
        $excludeIds = $this->parseExcludeIds($request);

        $applyListFilters = function (\Doctrine\ORM\QueryBuilder $qb) use ($search, $typeFilter, $excludeNative, $excludeIds): void {
            if ($search !== '') {
                $qb->andWhere('LOWER(f.name) LIKE :search')
                    ->setParameter('search', '%' . mb_strtolower($search) . '%');
            }

            if ($typeFilter !== '' && \in_array($typeFilter, ['google', 'custom'], true)) {
                $qb->andWhere('f.type = :type')
                    ->setParameter('type', FontTypeEnum::from($typeFilter));
            } elseif ($excludeNative) {
                $qb->andWhere('f.type != :excludeNativeType')
                    ->setParameter('excludeNativeType', FontTypeEnum::Native);
            }

            if ($excludeIds !== []) {
                $qb->andWhere('f.id NOT IN (:excludeIds)')
                    ->setParameter('excludeIds', array_keys($excludeIds));
            }
        };

        $qb = $this->em->createQueryBuilder()
            ->select('f')
            ->from(Font::class, 'f')
            ->orderBy('f.name', 'ASC');
        $applyListFilters($qb);

        $countQb = $this->em->createQueryBuilder()
            ->select('COUNT(f.id)')
            ->from(Font::class, 'f');
        $applyListFilters($countQb);
        $total = (int) $countQb->getQuery()->getSingleScalarResult();

        $fonts = $qb
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        $items = [];
        foreach ($fonts as $font) {
            $payload = $this->themeFontBuilderService->buildFontPayload($font);
            if ($payload !== null) {
                $items[] = $payload;
            }
        }

        return new JsonResponse(['items' => $items, 'total' => $total]);
    }

    #[Route('/fonts/{id}', name: 'fonts_item', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function fontItem(int $id): JsonResponse
    {
        $font = $this->em->getRepository(Font::class)->find($id);
        if ($font === null) {
            return new JsonResponse(['error' => 'Font not found'], Response::HTTP_NOT_FOUND);
        }

        $payload = $this->themeFontBuilderService->buildFontPayload($font);
        if ($payload === null) {
            return new JsonResponse(['error' => 'Font not loadable'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($payload);
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
     * @return array<int, true>
     */
    private function parseExcludeIds(Request $request): array
    {
        $raw = trim((string) $request->query->get('excludeIds', ''));
        if ($raw === '') {
            return [];
        }

        $ids = [];
        foreach (explode(',', $raw) as $part) {
            $id = (int) trim($part);
            if ($id > 0) {
                $ids[$id] = true;
            }
        }

        return $ids;
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
            $out['raw'] = \is_object($raw) ? (array) $raw : $raw;
        }
        return $out;
    }

}
