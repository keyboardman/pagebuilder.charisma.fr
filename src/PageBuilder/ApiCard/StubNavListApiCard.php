<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Liste de navigation de démonstration pour NodeNavApi.
 */
final class StubNavListApiCard implements ApiCardListInterface, ApiCardBehaviorInterface
{
    /** @var list<object{id: string, label: string, href: string}> */
    private const ITEMS = [
        ['id' => 'home', 'label' => 'Accueil', 'href' => '/'],
        ['id' => 'news', 'label' => 'Actualités', 'href' => '/actualites'],
        ['id' => 'videos', 'label' => 'Vidéos', 'href' => '/videos'],
        ['id' => 'contact', 'label' => 'Contact', 'href' => 'https://example.com/contact'],
    ];

    public function getId(): string
    {
        return 'stub-nav-list';
    }

    public function getLabel(): string
    {
        return 'Menu navigation (démo)';
    }

    public function getType(): string
    {
        return 'list';
    }

    public function getCategory(): ?string
    {
        return null;
    }

    public function getCollectionMode(): string
    {
        return 'fixed';
    }

    public function fetchCollection(array $params): array
    {
        $items = array_map(
            static fn (array $row): object => (object) $row,
            self::ITEMS
        );

        return ['items' => $items, 'total' => \count($items)];
    }

    public function fetchItem(string $id): object
    {
        foreach (self::ITEMS as $row) {
            if ($row['id'] === $id) {
                return (object) $row;
            }
        }

        return (object) ['id' => $id, 'label' => $id, 'href' => '#'];
    }

    public function mapItem(object $item): array
    {
        return [
            'id' => (string) ($item->id ?? ''),
            'title' => (string) ($item->label ?? $item->title ?? ''),
            'link' => (string) ($item->href ?? $item->link ?? '#'),
            'raw' => $item,
        ];
    }

    public function fetchCategories(): ?array
    {
        return null;
    }

    public function getCategoryQueryParam(): string
    {
        return 'category';
    }
}
