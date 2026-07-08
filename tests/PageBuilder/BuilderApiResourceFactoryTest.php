<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\Api\BuilderApiResourceFactory;
use PHPUnit\Framework\TestCase;

final class BuilderApiResourceFactoryTest extends TestCase
{
    public function testCreateItemsPageMapsNestedItems(): void
    {
        $factory = new BuilderApiResourceFactory();

        $page = $factory->createItemsPage([
            'items' => [
                [
                    'id' => 'home',
                    'title' => 'Accueil',
                    'link' => '/',
                    'raw' => ['href' => '/'],
                ],
            ],
            'total' => 1,
        ]);

        $this->assertSame(1, $page->total);
        $this->assertCount(1, $page->items);
        $this->assertSame('home', $page->items[0]->id);
        $this->assertSame('Accueil', $page->items[0]->title);
        $this->assertSame('/', $page->items[0]->link);
        $this->assertSame(['href' => '/'], $page->items[0]->raw);
    }

    public function testCreateItemMapsCounterWhenPresent(): void
    {
        $factory = new BuilderApiResourceFactory();

        $item = $factory->createItem([
            'id' => '1',
            'title' => 'Article',
            'counter' => 42,
            'raw' => ['views' => 42],
        ]);

        $this->assertSame('42', $item->counter);
    }

    public function testCreateItemLeavesCounterNullWhenAbsent(): void
    {
        $factory = new BuilderApiResourceFactory();

        $item = $factory->createItem([
            'id' => '1',
            'title' => 'Article',
            'raw' => [],
        ]);

        $this->assertNull($item->counter);
    }

    public function testCreateItemMapsLikeWhenPresent(): void
    {
        $factory = new BuilderApiResourceFactory();

        $item = $factory->createItem([
            'id' => '1',
            'title' => 'Article',
            'like' => 12,
            'raw' => ['likes' => 12],
        ]);

        $this->assertSame('12', $item->like);
    }
}
