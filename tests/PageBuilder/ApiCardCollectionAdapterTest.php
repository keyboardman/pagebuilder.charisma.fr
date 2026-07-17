<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardInterface;
use App\PageBuilder\ApiCollection\ApiCardCollectionAdapter;
use PHPUnit\Framework\TestCase;

final class ApiCardCollectionAdapterTest extends TestCase
{
    public function testFetchItemsForwardsSearchAndCategory(): void
    {
        $captured = null;
        $card = new class($captured) implements ApiCardInterface {
            /** @param array<string, mixed>|null $captured */
            public function __construct(private ?array &$captured)
            {
            }

            public function getId(): string
            {
                return 'flashnews';
            }

            public function getLabel(): string
            {
                return 'Flashnews';
            }

            public function getType(): string
            {
                return 'article';
            }

            public function getCategory(): ?string
            {
                return null;
            }

            public function fetchCollection(array $params): array
            {
                $this->captured = $params;

                return [
                    'items' => [(object) ['id' => 1, 'titre' => 'Paris']],
                    'total' => 1,
                ];
            }

            public function fetchItem(string $id): object
            {
                return (object) ['id' => $id];
            }

            public function mapItem(object $item): array
            {
                return [
                    'id' => (string) ($item->id ?? ''),
                    'title' => (string) ($item->titre ?? ''),
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
        };

        $adapter = new ApiCardCollectionAdapter($card);
        $page = $adapter->fetchItems([
            'page' => 1,
            'itemsPerPage' => 20,
            'search' => 'paris',
            'category' => 'actu',
        ]);

        $this->assertSame(1, $captured['page'] ?? null);
        $this->assertSame(20, $captured['limit'] ?? null);
        $this->assertSame('paris', $captured['search'] ?? null);
        $this->assertSame('actu', $captured['category'] ?? null);
        $this->assertCount(1, $page->items);
        $this->assertSame('1', $page->items[0]['id']);
    }

    public function testFetchCategoriesDelegatesToCard(): void
    {
        $card = new class implements ApiCardInterface {
            public function getId(): string
            {
                return 'videos';
            }

            public function getLabel(): string
            {
                return 'Videos';
            }

            public function getType(): string
            {
                return 'video';
            }

            public function getCategory(): ?string
            {
                return null;
            }

            public function fetchCollection(array $params): array
            {
                return ['items' => [], 'total' => 0];
            }

            public function fetchItem(string $id): object
            {
                return (object) ['id' => $id];
            }

            public function mapItem(object $item): array
            {
                return ['id' => (string) ($item->id ?? '')];
            }

            public function fetchCategories(): ?array
            {
                return [
                    ['id' => 'actu', 'label' => 'Actualités'],
                ];
            }

            public function getCategoryQueryParam(): string
            {
                return 'category';
            }
        };

        $adapter = new ApiCardCollectionAdapter($card);
        $this->assertSame([
            ['id' => 'actu', 'label' => 'Actualités'],
        ], $adapter->fetchCategories());
    }

    public function testFetchCategoriesEmptyWhenCardReturnsNull(): void
    {
        $card = new class implements ApiCardInterface {
            public function getId(): string
            {
                return 'plain';
            }

            public function getLabel(): string
            {
                return 'Plain';
            }

            public function getType(): string
            {
                return 'article';
            }

            public function getCategory(): ?string
            {
                return null;
            }

            public function fetchCollection(array $params): array
            {
                return ['items' => [], 'total' => 0];
            }

            public function fetchItem(string $id): object
            {
                return (object) ['id' => $id];
            }

            public function mapItem(object $item): array
            {
                return ['id' => (string) ($item->id ?? '')];
            }

            public function fetchCategories(): ?array
            {
                return null;
            }

            public function getCategoryQueryParam(): string
            {
                return 'category';
            }
        };

        $adapter = new ApiCardCollectionAdapter($card);
        $this->assertSame([], $adapter->fetchCategories());
    }
}
