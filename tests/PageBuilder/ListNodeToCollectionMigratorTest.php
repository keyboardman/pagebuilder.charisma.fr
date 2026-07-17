<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\NodeMigration\ListNodeToCollectionMigrator;
use PHPUnit\Framework\TestCase;

final class ListNodeToCollectionMigratorTest extends TestCase
{
    public function testEmptyAndNullContentAreUnchanged(): void
    {
        $nullResult = ListNodeToCollectionMigrator::migrate(null);
        $this->assertNull($nullResult['content']);
        $this->assertFalse($nullResult['changed']);
        $this->assertSame(0, $nullResult['convertedListApi']);

        $emptyResult = ListNodeToCollectionMigrator::migrate([]);
        $this->assertSame([], $emptyResult['content']);
        $this->assertFalse($emptyResult['changed']);
    }

    public function testMapsNodeListApiToCollection(): void
    {
        $nodes = [
            'n1' => [
                'id' => 'n1',
                'type' => 'node-list-api',
                'parent' => ['id' => 'root', 'order' => 0, 'zone' => 'main'],
                'content' => [
                    'listMode' => 'fixed',
                    'apiId' => 'flashnews_article_home',
                    'page' => 2,
                    'itemsPerPage' => 5,
                    'dynamicItems' => [],
                    'show' => [
                        'title' => true,
                        'description' => false,
                        'counter' => true,
                        'like' => true,
                    ],
                    'list' => ['className' => 'x', 'style' => []],
                    'item' => ['className' => '', 'style' => []],
                    'title' => ['className' => '', 'style' => []],
                    'description' => ['className' => '', 'style' => []],
                    'counter' => ['className' => '', 'style' => []],
                    'like' => ['className' => '', 'style' => []],
                ],
            ],
        ];

        $result = ListNodeToCollectionMigrator::migrate($nodes);
        $this->assertTrue($result['changed']);
        $this->assertSame(1, $result['convertedListApi']);
        $this->assertSame(0, $result['convertedListImage']);

        $node = $result['content']['n1'];
        $this->assertSame('node-collection', $node['type']);
        $this->assertSame('article', $node['content']['collectionType']);
        $this->assertSame('fixed', $node['content']['mode']);
        $this->assertSame('list', $node['content']['display']);
        $this->assertSame('article', $node['content']['view']);
        $this->assertSame('flashnews_article_home', $node['content']['apiId']);
        $this->assertSame(2, $node['content']['page']);
        $this->assertSame(5, $node['content']['itemsPerPage']);
        $this->assertSame([], $node['content']['dynamicArticleItems']);
        $this->assertArrayNotHasKey('listMode', $node['content']);
        $this->assertArrayNotHasKey('dynamicItems', $node['content']);
        $this->assertSame('node-list-api', $node['content']['_migratedFrom']);
        $this->assertTrue($node['content']['show']['image']);
        $this->assertTrue($node['content']['show']['labels']);
        $this->assertFalse($node['content']['show']['description']);
        $this->assertSame(3, $node['content']['list']['gap']);
        $this->assertSame(['id' => 'root', 'order' => 0, 'zone' => 'main'], $node['parent']);
    }

    public function testMapsNodeListApiDynamicItems(): void
    {
        $nodes = [
            'n1' => [
                'id' => 'n1',
                'type' => 'node-list-api',
                'content' => [
                    'listMode' => 'dynamic',
                    'apiId' => '',
                    'dynamicItems' => [
                        ['id' => '42', 'type' => 'charisma_article_enaction'],
                    ],
                ],
            ],
        ];

        $node = ListNodeToCollectionMigrator::migrate($nodes)['content']['n1'];
        $this->assertSame('dynamic', $node['content']['mode']);
        $this->assertSame(
            [['id' => '42', 'type' => 'charisma_article_enaction']],
            $node['content']['dynamicArticleItems']
        );
    }

    public function testMapsNodeListImageToCollection(): void
    {
        $nodes = [
            'img1' => [
                'id' => 'img1',
                'type' => 'node-list-image',
                'content' => [
                    'listMode' => 'dynamic',
                    'apiId' => '',
                    'page' => 1,
                    'itemsPerPage' => 10,
                    'dynamicItems' => [
                        [
                            'id' => 'm1',
                            'type' => 'media',
                            'src' => 'https://example.com/a.jpg',
                            'alt' => 'A',
                        ],
                    ],
                    'list' => ['className' => '', 'style' => []],
                    'item' => ['className' => '', 'style' => []],
                    'image' => ['className' => '', 'style' => []],
                ],
            ],
        ];

        $result = ListNodeToCollectionMigrator::migrate($nodes);
        $this->assertSame(0, $result['convertedListApi']);
        $this->assertSame(1, $result['convertedListImage']);

        $node = $result['content']['img1'];
        $this->assertSame('node-collection', $node['type']);
        $this->assertSame('image', $node['content']['collectionType']);
        $this->assertSame('dynamic', $node['content']['mode']);
        $this->assertSame('list', $node['content']['display']);
        $this->assertSame('default', $node['content']['view']);
        $this->assertSame('node-list-image', $node['content']['_migratedFrom']);
        $this->assertCount(1, $node['content']['dynamicImageItems']);
        $this->assertSame('https://example.com/a.jpg', $node['content']['dynamicImageItems'][0]['src']);
        $this->assertArrayNotHasKey('dynamicItems', $node['content']);
    }

    public function testIdempotentOnAlreadyMigratedAndOtherNodes(): void
    {
        $nodes = [
            'c1' => [
                'id' => 'c1',
                'type' => 'node-collection',
                'content' => [
                    'collectionType' => 'article',
                    'mode' => 'fixed',
                    'apiId' => 'x',
                    '_migratedFrom' => 'node-list-api',
                ],
            ],
            't1' => [
                'id' => 't1',
                'type' => 'node-text',
                'content' => ['text' => 'hello'],
            ],
        ];

        $result = ListNodeToCollectionMigrator::migrate($nodes);
        $this->assertFalse($result['changed']);
        $this->assertSame(0, $result['convertedListApi']);
        $this->assertSame($nodes, $result['content']);

        // Second pass after a real migration stays stable
        $legacy = [
            'n1' => [
                'id' => 'n1',
                'type' => 'node-list-api',
                'content' => ['listMode' => 'fixed', 'apiId' => 'a'],
            ],
        ];
        $once = ListNodeToCollectionMigrator::migrate($legacy);
        $twice = ListNodeToCollectionMigrator::migrate($once['content']);
        $this->assertFalse($twice['changed']);
        $this->assertSame($once['content'], $twice['content']);
    }

    public function testReverseViaMigratedFrom(): void
    {
        $migrated = ListNodeToCollectionMigrator::migrate([
            'n1' => [
                'id' => 'n1',
                'type' => 'node-list-api',
                'content' => [
                    'listMode' => 'dynamic',
                    'apiId' => '',
                    'dynamicItems' => [['id' => '1', 'type' => 'api']],
                    'show' => ['title' => true],
                ],
            ],
            'n2' => [
                'id' => 'n2',
                'type' => 'node-list-image',
                'content' => [
                    'listMode' => 'fixed',
                    'apiId' => 'banners',
                    'dynamicItems' => [],
                ],
            ],
        ]);

        $reversed = ListNodeToCollectionMigrator::reverse($migrated['content']);
        $this->assertTrue($reversed['changed']);
        $this->assertSame(1, $reversed['revertedListApi']);
        $this->assertSame(1, $reversed['revertedListImage']);
        $this->assertSame('node-list-api', $reversed['content']['n1']['type']);
        $this->assertSame('dynamic', $reversed['content']['n1']['content']['listMode']);
        $this->assertSame(
            [['id' => '1', 'type' => 'api']],
            $reversed['content']['n1']['content']['dynamicItems']
        );
        $this->assertSame('node-list-image', $reversed['content']['n2']['type']);
        $this->assertSame('banners', $reversed['content']['n2']['content']['apiId']);
    }
}
