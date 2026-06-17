<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\Api\ApiCardEndpointProvider;
use App\PageBuilder\Api\ApiCardEndpointProviderException;
use App\PageBuilder\Api\ApiMappedItemNormalizer;
use App\PageBuilder\ApiCard\ApiCardInterface;
use App\PageBuilder\ApiCard\ApiCardRegistry;
use PHPUnit\Framework\TestCase;

final class ApiCardEndpointProviderTest extends TestCase
{
    public function testGetCollectionReturnsNormalizedItemsAndTotal(): void
    {
        $provider = new ApiCardEndpointProvider(
            new ApiCardRegistry([new ProviderTestCard()]),
            new ApiMappedItemNormalizer(),
        );

        $result = $provider->getCollection('test', ['page' => 1, 'limit' => 20]);

        $this->assertSame(1, $result['total']);
        $this->assertCount(1, $result['items']);
        $this->assertSame('1', $result['items'][0]['id']);
        $this->assertSame('Titre 1', $result['items'][0]['title']);
    }

    public function testGetItemThrowsWhenItemDoesNotExist(): void
    {
        $provider = new ApiCardEndpointProvider(
            new ApiCardRegistry([new ProviderTestCard()]),
            new ApiMappedItemNormalizer(),
        );

        $this->expectException(ApiCardEndpointProviderException::class);
        $this->expectExceptionMessage('Item not found: missing');

        $provider->getItem('test', 'missing');
    }

    public function testGetCardCategoryParamNameThrowsWhenApiMissing(): void
    {
        $provider = new ApiCardEndpointProvider(
            new ApiCardRegistry([new ProviderTestCard()]),
            new ApiMappedItemNormalizer(),
        );

        $this->expectException(ApiCardEndpointProviderException::class);
        $this->expectExceptionMessage('API not found: unknown');

        $provider->getCardCategoryParamName('unknown');
    }
}

final class ProviderTestCard implements ApiCardInterface
{
    public function getId(): string
    {
        return 'test';
    }

    public function getLabel(): string
    {
        return 'Test';
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
        return [
            'items' => [(object) ['id' => 1, 'title' => 'Titre 1']],
            'total' => 1,
        ];
    }

    public function fetchItem(string $id): object
    {
        if ($id !== '1') {
            throw new \RuntimeException('not found');
        }

        return (object) ['id' => 1, 'title' => 'Titre 1'];
    }

    public function mapItem(object $item): array
    {
        return [
            'id' => (string) ($item->id ?? ''),
            'title' => (string) ($item->title ?? ''),
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
