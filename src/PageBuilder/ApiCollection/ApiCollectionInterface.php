<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Contrat unifié de collection pour NodeCollection (image | video | article).
 */
interface ApiCollectionInterface
{
    public function getId(): string;

    public function getLabel(): string;

    /**
     * @return 'image'|'video'|'article'
     */
    public function getType(): string;

    /**
     * @return list<'fixed'|'dynamic'>
     */
    public function getSupportedModes(): array;

    /**
     * @param array{page?: int|string, itemsPerPage?: int|string, search?: string, category?: string} $params
     */
    public function fetchItems(array $params = []): ApiCollectionPageResult;

    /**
     * Résolution d'un item (requis si le mode dynamic est supporté).
     *
     * @return array<string, mixed>|null
     */
    public function fetchItem(string $id): ?array;

    /**
     * Catégories pour le filtre du picker. Tableau vide si non supporté.
     *
     * @return list<array{id: string, label: string}>
     */
    public function fetchCategories(): array;
}
