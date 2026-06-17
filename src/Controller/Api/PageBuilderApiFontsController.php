<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\PageBuilder\Api\ApiRequestParamHelper;
use App\Service\PageFontResolverService;
use App\Service\ThemeFontBuilderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/page-builder/api', name: 'app_page_builder_api_')]
final class PageBuilderApiFontsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ThemeFontBuilderService $themeFontBuilderService,
        private readonly PageFontResolverService $pageFontResolverService,
        private readonly ApiRequestParamHelper $requestParamHelper,
    ) {
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

        $excludeIds = $this->requestParamHelper->parseExcludeIds($request);
        if ($font->getId() !== null && isset($excludeIds[$font->getId()])) {
            return new JsonResponse(null, Response::HTTP_OK);
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
        $excludeIds = $this->requestParamHelper->parseExcludeIds($request);

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
}
