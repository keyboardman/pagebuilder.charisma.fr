<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

/**
 * Registre des sources ApiListArticleDynamique (sélection item-par-item).
 *
 * @psalm-type ApiListArticleDynamiqueMeta = array{id: string, label: string}
 */
final class ApiListArticleDynamiqueRegistry
{
    /** @var array<string, ApiListArticleDynamique> */
    private array $sources = [];

    /**
     * @param iterable<ApiListArticleDynamique> $sources
     */
    public function __construct(iterable $sources)
    {
        foreach ($sources as $source) {
            $this->sources[$source->getId()] = $source;
        }
    }

    /**
     * @return list<array{id: string, label: string}>
     */
    public function list(): array
    {
        $out = [];
        foreach ($this->sources as $source) {
            $out[] = [
                'id' => $source->getId(),
                'label' => $source->getLabel(),
            ];
        }

        return $out;
    }

    public function get(string $id): ?ApiListArticleDynamique
    {
        return $this->sources[$id] ?? null;
    }
}
