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
}
