<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiListArticle\ApiListArticlePageResult;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamique;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueEntry;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class ApiListArticleDynamiqueResolverTest extends TestCase
{
    public function testResolveReturnsItemsFromApiListArticleDynamiqueInOrder(): void
    {
        $resolver = new ApiListArticleDynamiqueResolver(
            new ApiListArticleDynamiqueRegistry([new DynamicResolverTestSource($this->createMock(HttpClientInterface::class))]),
        );

        $items = $resolver->resolve([
            new ApiListArticleDynamiqueEntry('item-b', 'test-source'),
            new ApiListArticleDynamiqueEntry('item-a', 'test-source'),
        ]);

        $this->assertCount(2, $items);
        $this->assertSame('item-b', $items[0]['id']);
        $this->assertSame('Item B', $items[0]['title']);
        $this->assertSame('item-a', $items[1]['id']);
        $this->assertSame('Item A', $items[1]['title']);
    }

    public function testResolveSupportsMultipleSources(): void
    {
        $resolver = new ApiListArticleDynamiqueResolver(
            new ApiListArticleDynamiqueRegistry([
                new DynamicResolverTestSource($this->createMock(HttpClientInterface::class)),
                new DynamicResolverSecondTestSource($this->createMock(HttpClientInterface::class)),
            ]),
        );

        $items = $resolver->resolve([
            new ApiListArticleDynamiqueEntry('other-1', 'other-source'),
            new ApiListArticleDynamiqueEntry('item-a', 'test-source'),
        ]);

        $this->assertCount(2, $items);
        $this->assertSame('other-1', $items[0]['id']);
        $this->assertSame('Autre 1', $items[0]['title']);
        $this->assertSame('item-a', $items[1]['id']);
    }

    public function testResolveSkipsMissingItemsAndUnknownSources(): void
    {
        $resolver = new ApiListArticleDynamiqueResolver(
            new ApiListArticleDynamiqueRegistry([new DynamicResolverTestSource($this->createMock(HttpClientInterface::class))]),
        );

        $items = $resolver->resolve([
            new ApiListArticleDynamiqueEntry('item-a', 'test-source'),
            new ApiListArticleDynamiqueEntry('missing', 'test-source'),
            new ApiListArticleDynamiqueEntry('item-b', 'unknown-source'),
        ]);

        $this->assertCount(1, $items);
        $this->assertSame('item-a', $items[0]['id']);
    }
}

final class DynamicResolverTestSource extends ApiListArticleDynamique
{
    public function getId(): string
    {
        return 'test-source';
    }

    public function getLabel(): string
    {
        return 'Test Source';
    }

    public function fetchItems(array $params = []): ApiListArticlePageResult
    {
        return new ApiListArticlePageResult(
            [
                ['id' => 'item-a', 'title' => 'Item A'],
                ['id' => 'item-b', 'title' => 'Item B'],
            ],
            2,
            1,
            1,
            100,
        );
    }

    public function fetchItem(string $id): ?array
    {
        return match ($id) {
            'item-a' => ['id' => 'item-a', 'title' => 'Item A'],
            'item-b' => ['id' => 'item-b', 'title' => 'Item B'],
            default => null,
        };
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        return is_array($item) ? $item : [];
    }
}

final class DynamicResolverSecondTestSource extends ApiListArticleDynamique
{
    public function getId(): string
    {
        return 'other-source';
    }

    public function getLabel(): string
    {
        return 'Other Source';
    }

    public function fetchItems(array $params = []): ApiListArticlePageResult
    {
        return new ApiListArticlePageResult(
            [['id' => 'other-1', 'title' => 'Autre 1']],
            1,
            1,
            1,
            100,
        );
    }

    public function fetchItem(string $id): ?array
    {
        return $id === 'other-1' ? ['id' => 'other-1', 'title' => 'Autre 1'] : null;
    }

    protected function mapRemoteItemToNodeList(mixed $item): array
    {
        return is_array($item) ? $item : [];
    }
}
