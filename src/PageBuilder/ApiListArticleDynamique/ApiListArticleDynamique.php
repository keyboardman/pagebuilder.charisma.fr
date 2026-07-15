<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

use App\PageBuilder\ApiListArticle\ApiListArticlePageResult;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Source dynamique NodeListApi : sélection d'items individuels par { id, type }.
 *
 * - fetchItems() : parcourir la collection pour le picker backend
 * - fetchItem()  : résoudre un item via l'endpoint direct /{id}
 */
abstract class ApiListArticleDynamique
{
    protected const MAX_ITEMS_PER_PAGE = 100;

    public function __construct(
        protected readonly HttpClientInterface $httpClient,
    ) {
    }

    abstract public function getId(): string;

    abstract public function getLabel(): string;

    /**
     * @param array{page?: int|string, itemsPerPage?: int|string, search?: string} $params
     */
    abstract public function fetchItems(array $params = []): ApiListArticlePageResult;

    /**
     * @return array<string, mixed>|null
     */
    abstract public function fetchItem(string $id): ?array;

    /**
     * @param mixed $item
     * @return array<string, mixed>
     */
    abstract protected function mapRemoteItemToNodeList(mixed $item): array;

    protected function normalizeItemsPerPage(int|string $value): int
    {
        $int = (int) $value;
        if ($int < 1) {
            return 10;
        }

        return min($int, self::MAX_ITEMS_PER_PAGE);
    }
}
