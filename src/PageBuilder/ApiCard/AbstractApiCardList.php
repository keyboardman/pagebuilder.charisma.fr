<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

abstract class AbstractApiCardList implements ApiCardListInterface, ApiCardInterface
{
    public function getType(): string
    {
        return 'list';
    }

    public function getCategory(): ?string
    {
        // Par défaut, les cards "list" ne sont pas filtrables via la catégorie.
        return null;
    }

    public function fetchCategories(): ?array
    {
        return null;
    }

    public function getCategoryQueryParam(): string
    {
        // Valeur par défaut utilisée si le builder tente un filtrage par catégorie.
        return 'category';
    }

    /**
     * Pour un type `list`, le builder n'a généralement pas besoin de récupérer
     * un item "détail". On propose donc une résolution générique basée sur la
     * collection (utile si l'endpoint est appelé quand même).
     */
    public function fetchItem(string $id): object
    {
        $result = $this->fetchCollection([
            'page' => 1,
            'limit' => 200,
        ]);

        $items = $result['items'] ?? [];
        foreach ($items as $item) {
            if (!\is_object($item)) {
                continue;
            }

            if ((string) ($item->id ?? '') === $id) {
                return $item;
            }
        }

        return (object) ['id' => $id];
    }

    /**
     * Mapping par défaut pour les cards `list` dont `fetchCollection()` renvoie
     * déjà des items dans le format "contrat builder" (id, title, description,
     * image, labels, link, counter, like, raw...).
     *
     * Les cards list qui ont un mapping spécifique peuvent toujours surcharger
     * cette méthode.
     *
     * @return array{id: string, title: string, description?: string|null, image?: string|null, labels?: list<string>|null, link?: string|null, text?: string|null, counter?: string|int|null, like?: string|int|null, raw: object}
     */
    public function mapItem(object $item): array
    {
        $raw = \property_exists($item, 'raw') ? $item->raw : $item;

        return [
            'id' => (string) ($item->id ?? ''),
            'title' => (string) ($item->title ?? ''),
            'description' => $item->description ?? null,
            'image' => $item->image ?? null,
            'labels' => \is_array($item->labels ?? null) ? $item->labels : null,
            'link' => $item->link ?? null,
            'text' => $item->text ?? null,
            'counter' => $item->counter ?? null,
            'like' => $item->like ?? null,
            'raw' => \is_object($raw) ? $raw : $item,
        ];
    }
}
