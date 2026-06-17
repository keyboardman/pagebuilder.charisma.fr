<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Service\PageFontResolverService;
use App\Service\ThemeFontBuilderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class BuilderApiFontEndpointProvider
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ThemeFontBuilderService $themeFontBuilderService,
        private readonly PageFontResolverService $pageFontResolverService,
        private readonly ApiRequestParamHelper $requestParamHelper,
    ) {
    }

    /**
     * @return array{items: list<array<string, mixed>>, total: int}
     */
    public function listFonts(Request $request): array
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

        return ['items' => $items, 'total' => $total];
    }

    /**
     * @return array<string, mixed>
     */
    public function getFont(int $id): array
    {
        $font = $this->em->getRepository(Font::class)->find($id);
        if ($font === null) {
            throw new NotFoundHttpException('Font not found');
        }

        $payload = $this->themeFontBuilderService->buildFontPayload($font);
        if ($payload === null) {
            throw new NotFoundHttpException('Font not loadable');
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function resolveFont(Request $request): ?array
    {
        $family = trim((string) $request->query->get('family', ''));
        if ($family === '') {
            throw new BadRequestHttpException('family is required');
        }

        $font = $this->pageFontResolverService->findFontByPrimaryFamily($family);
        if ($font === null || $font->getType() === FontTypeEnum::Native) {
            throw new NotFoundHttpException('Font not found');
        }

        $excludeIds = $this->requestParamHelper->parseExcludeIds($request);
        if ($font->getId() !== null && isset($excludeIds[$font->getId()])) {
            return null;
        }

        $payload = $this->themeFontBuilderService->buildFontPayload($font);
        if ($payload === null) {
            throw new NotFoundHttpException('Font not found');
        }

        return $payload;
    }
}
