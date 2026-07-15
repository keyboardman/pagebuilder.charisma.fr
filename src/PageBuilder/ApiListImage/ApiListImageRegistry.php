<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListImage;

/**
 * Registre des sources "ApiListImage" (slideshow, galeries…).
 *
 * @psalm-type ApiListImageMeta = array{id: string, label: string, collectionMode: string}
 */
final class ApiListImageRegistry
{
    /** @var array<string, ApiListImage> */
    private array $lists = [];

    /**
     * @param iterable<ApiListImage> $lists
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

    public function get(string $id): ?ApiListImage
    {
        return $this->lists[$id] ?? null;
    }
}
