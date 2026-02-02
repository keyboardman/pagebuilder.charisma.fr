<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiCard\StubApiCard;
use PHPUnit\Framework\TestCase;

class ApiCardRegistryTest extends TestCase
{
    public function testListReturnsMetadataForRegisteredCards(): void
    {
        $registry = new ApiCardRegistry([new StubApiCard()]);
        $list = $registry->list();
        $this->assertIsArray($list);
        $this->assertCount(1, $list);
        $this->assertSame('stub-articles', $list[0]['id']);
        $this->assertSame('Articles (démo)', $list[0]['label']);
        $this->assertSame('article', $list[0]['type']);
        $this->assertNull($list[0]['category']);
    }

    public function testGetReturnsCardById(): void
    {
        $stub = new StubApiCard();
        $registry = new ApiCardRegistry([$stub]);
        $this->assertSame($stub, $registry->get('stub-articles'));
        $this->assertNull($registry->get('unknown'));
    }

    public function testStubApiCardFetchCollectionReturnsItemsAndTotal(): void
    {
        $stub = new StubApiCard();
        $result = $stub->fetchCollection(['page' => 1, 'limit' => 5]);
        $this->assertArrayHasKey('items', $result);
        $this->assertArrayHasKey('total', $result);
        $this->assertSame(42, $result['total']);
        $this->assertCount(5, $result['items']);
    }

    public function testStubApiCardMapItemReturnsStandardShape(): void
    {
        $stub = new StubApiCard();
        $item = (object) ['id' => 'x', 'title' => 'T', 'excerpt' => 'E'];
        $mapped = $stub->mapItem($item);
        $this->assertSame('x', $mapped['id']);
        $this->assertSame('T', $mapped['title']);
        $this->assertSame('E', $mapped['description']);
        $this->assertSame($item, $mapped['raw']);
    }
}
