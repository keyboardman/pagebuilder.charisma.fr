<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

use Symfony\Component\HttpFoundation\Request;

final class ApiRequestParamHelper
{
    public function buildListCollectionParams(Request $request): array
    {
        $itemsPerPage = max(1, min(100, (int) $request->query->get('itemsPerPage', 10)));

        return [
            'page' => max(1, (int) $request->query->get('page', 1)),
            'itemsPerPage' => $itemsPerPage,
        ];
    }

    /**
     * @return array{page: int, itemsPerPage: int, search?: string, category?: string}
     */
    public function buildDynamicListCollectionParams(Request $request): array
    {
        $params = [
            'page' => max(1, (int) $request->query->get('page', 1)),
            'itemsPerPage' => max(1, min(100, (int) $request->query->get('itemsPerPage', 20))),
        ];

        $search = $request->query->get('search');
        if (\is_string($search) && trim($search) !== '') {
            $params['search'] = trim($search);
        }

        $category = $request->query->get('category');
        if (\is_string($category) && trim($category) !== '') {
            $params['category'] = trim($category);
        }

        return $params;
    }

    /**
     * @return array<string, mixed>
     */
    public function buildCardCollectionParams(Request $request, string $categoryParamName): array
    {
        $params = [
            'page' => max(1, (int) $request->query->get('page', 1)),
            'limit' => max(1, min(100, (int) $request->query->get('limit', 20))),
            'search' => $request->query->get('search'),
            'sort' => $request->query->get('sort'),
            'category' => $request->query->get('category'),
        ];

        if ($categoryParamName !== 'category' && $request->query->has('category')) {
            $params[$categoryParamName] = $request->query->get('category');
        }

        return $params;
    }

    /**
     * @return array<int, true>
     */
    public function parseExcludeIds(Request $request): array
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
}
