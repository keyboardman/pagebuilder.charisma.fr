<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiList;

/**
 * Registre des sources "ApiList" (NodeListApi / NodeNavApi).
 *
 * @psalm-type ApiListMeta = array{id: string, label: string, collectionMode: string}
 */
final class ApiListRegistry
{
    /** @var array<string, ApiList> */
    private array $lists = [];

    /**
     * @param iterable<ApiList> $lists
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

    public function get(string $id): ?ApiList
    {
        return $this->lists[$id] ?? null;
    }
}

