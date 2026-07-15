<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticle;

/**
 * Registre des sources "ApiListArticle" (NodeListApi / NodeNavApi).
 *
 * @psalm-type ApiListArticleMeta = array{id: string, label: string, collectionMode: string}
 */
final class ApiListArticleRegistry
{
    /** @var array<string, ApiListArticle> */
    private array $lists = [];

    /**
     * @param iterable<ApiListArticle> $lists
     */
    public function __construct(iterable $lists)
    {
        foreach ($lists as $list) {
            $this->lists[$list->getId()] = $list;
        }
    }

    /**
     * @return list<array{id: string, label: string, collectionMode: string}>
     */
    public function list(): array
    {
        $out = [];
        foreach ($this->lists as $list) {
            $out[] = [
                'id' => $list->getId(),
                'label' => $list->getLabel(),
                'collectionMode' => $list->getCollectionMode(),
            ];
        }

        return $out;
    }

    public function get(string $id): ?ApiListArticle
    {
        return $this->lists[$id] ?? null;
    }
}

