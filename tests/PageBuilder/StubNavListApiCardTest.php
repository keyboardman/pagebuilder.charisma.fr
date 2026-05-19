<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiCard\StubNavListApiCard;
use PHPUnit\Framework\TestCase;

class StubNavListApiCardTest extends TestCase
{
    public function testMapItemReturnsNavigationFields(): void
    {
        $card = new StubNavListApiCard();
        $mapped = $card->mapItem((object) [
            'id' => 'news',
            'label' => 'Actualités',
            'href' => '/actualites',
        ]);

        $this->assertSame('news', $mapped['id']);
        $this->assertSame('Actualités', $mapped['title']);
        $this->assertSame('/actualites', $mapped['link']);
        $this->assertArrayNotHasKey('target', $mapped);
    }

    public function testFetchCollectionReturnsFixedMenuItems(): void
    {
        $card = new StubNavListApiCard();
        $result = $card->fetchCollection(['page' => 1, 'limit' => 10]);

        $this->assertSame(4, $result['total']);
        $this->assertCount(4, $result['items']);
    }

    public function testRegistryListsStubNavListApiCard(): void
    {
        $registry = new ApiCardRegistry([new StubNavListApiCard()]);
        $list = $registry->list();

        $this->assertCount(1, $list);
        $this->assertSame('stub-nav-list', $list[0]['id']);
        $this->assertSame('list', $list[0]['type']);
        $this->assertSame('fixed', $list[0]['collectionMode']);
    }
}
