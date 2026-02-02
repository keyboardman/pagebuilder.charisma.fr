<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Contrat pour une API « card » utilisée par le builder (équivalent PHP de ApiAdapter en JS).
 */
interface ApiCardInterface
{
    public function getId(): string;

    public function getLabel(): string;

    /**
     * Type de contenu : "article", "video" ou "image".
     */
    public function getType(): string;

    /**
     * Catégorie optionnelle pour filtrage (ex: "news", "cms").
     */
    public function getCategory(): ?string;

    /**
     * Récupère une collection paginée.
     *
     * @param array{page: int, limit: int, search?: string, sort?: string, category?: string, ...} $params
     * @return array{items: list<object>, total: int}
     */
    public function fetchCollection(array $params): array;

    /**
     * Récupère un item par son ID.
     */
    public function fetchItem(string $id): object;

    /**
     * Mappe un item brut vers le format standard (id, title, description?, image?, labels?, link?, text?, raw).
     *
     * @return array{id: string, title: string, description?: string, image?: string, labels?: list<string>, link?: string, text?: string, raw: object}
     */
    public function mapItem(object $item): array;

    /**
     * Liste des catégories disponibles (optionnel).
     *
     * @return list<array{id: string, label: string}>|null
     */
    public function fetchCategories(): ?array;

    /**
     * Nom du paramètre de requête pour filtrer par catégorie (défaut "category").
     */
    public function getCategoryQueryParam(): string;
}
