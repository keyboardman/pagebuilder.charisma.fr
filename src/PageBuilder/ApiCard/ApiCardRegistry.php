<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Registre des APIs card exposées au builder (services tagués app.builder_api_card).
 */
final class ApiCardRegistry
{
    /** @var array<string, ApiCardInterface> */
    private array $cards = [];

    /**
     * @param iterable<ApiCardInterface> $cards
     */
    public function __construct(iterable $cards)
    {
        foreach ($cards as $card) {
            $this->cards[$card->getId()] = $card;
        }
    }

    /**
     * Liste des APIs (métadonnées pour exposition JSON).
     *
     * @return list<array{id: string, label: string, type: string, category: string|null}>
     */
    public function list(): array
    {
        $out = [];
        foreach ($this->cards as $card) {
            $out[] = [
                'id' => $card->getId(),
                'label' => $card->getLabel(),
                'type' => $card->getType(),
                'category' => $card->getCategory(),
            ];
        }
        return $out;
    }

    public function get(string $id): ?ApiCardInterface
    {
        return $this->cards[$id] ?? null;
    }
}
