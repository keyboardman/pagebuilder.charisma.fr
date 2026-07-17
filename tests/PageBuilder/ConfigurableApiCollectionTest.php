<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\Entity\ApiCollectionDefinition;
use App\PageBuilder\ApiCollection\ConfigurableApiCollection;
use App\PageBuilder\ApiCollection\DotPathResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

final class ConfigurableApiCollectionTest extends TestCase
{
    public function testDotPathResolver(): void
    {
        $data = ['visuel' => ['url' => 'https://example.com/a.jpg'], 'titre' => 'Hello'];
        $this->assertSame('https://example.com/a.jpg', DotPathResolver::get($data, 'visuel.url'));
        $this->assertSame('Hello', DotPathResolver::get($data, 'titre'));
        $this->assertNull(DotPathResolver::get($data, 'missing.path'));
    }

    public function testHydraPaginationAndFieldMapping(): void
    {
        $client = new MockHttpClient(static function (string $method, string $url): MockResponse {
            self::assertStringContainsString('page=1', $url);
            self::assertStringContainsString('itemsPerPage=2', $url);

            return new MockResponse(json_encode([
                'member' => [
                    ['id' => 1, 'titre' => 'A', 'visuel' => ['url' => 'https://img/a.jpg'], 'vues' => 10, 'likes' => 2],
                    ['id' => 2, 'titre' => 'B', 'visuel' => ['url' => 'https://img/b.jpg'], 'vues' => 0, 'likes' => 0],
                ],
                'totalItems' => 5,
            ], \JSON_THROW_ON_ERROR));
        });

        $definition = (new ApiCollectionDefinition())
            ->setApiId('test_articles')
            ->setLabel('Test')
            ->setType('article')
            ->setSupportedModes(['fixed'])
            ->setEndpointUrl('https://api.example/articles')
            ->setPaginationStyle('hydra')
            ->setMemberPath('member')
            ->setFieldMapping([
                'id' => 'id',
                'title' => 'titre',
                'image' => 'visuel.url',
                'counter' => 'vues',
                'like' => 'likes',
            ]);

        $collection = new ConfigurableApiCollection($definition, $client);
        $page = $collection->fetchItems(['page' => 1, 'itemsPerPage' => 2]);

        $this->assertSame(5, $page->totalItems);
        $this->assertCount(2, $page->items);
        $this->assertSame('1', $page->items[0]['id']);
        $this->assertSame('A', $page->items[0]['title']);
        $this->assertSame('https://img/a.jpg', $page->items[0]['image']);
        $this->assertSame(10, $page->items[0]['counter']);
        $this->assertSame(2, $page->items[0]['like']);
        $this->assertArrayNotHasKey('counter', $page->items[1]);
    }

    public function testPaginationNoneSlicesLocally(): void
    {
        $client = new MockHttpClient(new MockResponse(json_encode([
            'member' => [
                ['id' => '1', 'title' => 'A'],
                ['id' => '2', 'title' => 'B'],
                ['id' => '3', 'title' => 'C'],
            ],
        ], \JSON_THROW_ON_ERROR)));

        $definition = (new ApiCollectionDefinition())
            ->setApiId('local_slice')
            ->setLabel('Local')
            ->setType('article')
            ->setSupportedModes(['fixed'])
            ->setEndpointUrl('https://api.example/all')
            ->setPaginationStyle('none')
            ->setMemberPath('member')
            ->setFieldMapping(['id' => 'id', 'title' => 'title']);

        $collection = new ConfigurableApiCollection($definition, $client);
        $page = $collection->fetchItems(['page' => 2, 'itemsPerPage' => 2]);

        $this->assertSame(3, $page->totalItems);
        $this->assertCount(1, $page->items);
        $this->assertSame('3', $page->items[0]['id']);
    }

    public function testFetchItemViaTemplate(): void
    {
        $client = new MockHttpClient(static function (string $method, string $url): MockResponse {
            self::assertSame('https://api.example/articles/99', $url);

            return new MockResponse(json_encode([
                'id' => 99,
                'titre' => 'Detail',
            ], \JSON_THROW_ON_ERROR));
        });

        $definition = (new ApiCollectionDefinition())
            ->setApiId('detail')
            ->setLabel('Detail')
            ->setType('article')
            ->setSupportedModes(['dynamic'])
            ->setEndpointUrl('https://api.example/articles')
            ->setItemUrlTemplate('{endpoint}/{id}')
            ->setFieldMapping(['id' => 'id', 'title' => 'titre']);

        $collection = new ConfigurableApiCollection($definition, $client);
        $item = $collection->fetchItem('99');

        $this->assertNotNull($item);
        $this->assertSame('99', $item['id']);
        $this->assertSame('Detail', $item['title']);
    }

    public function testImagePrefixAppliedToRelativePathsOnly(): void
    {
        $client = new MockHttpClient(new MockResponse(json_encode([
            'member' => [
                ['id' => '1', 'path' => '/media/a.jpg'],
                ['id' => '2', 'path' => 'https://cdn.other/b.jpg'],
            ],
        ], \JSON_THROW_ON_ERROR)));

        $definition = (new ApiCollectionDefinition())
            ->setApiId('prefixed')
            ->setLabel('Prefixed')
            ->setType('image')
            ->setSupportedModes(['fixed'])
            ->setEndpointUrl('https://api.example/images')
            ->setPaginationStyle('none')
            ->setMemberPath('member')
            ->setImagePrefix('https://cdn.example.com')
            ->setFieldMapping(['id' => 'id', 'image' => 'path']);

        $collection = new ConfigurableApiCollection($definition, $client);
        $page = $collection->fetchItems(['page' => 1, 'itemsPerPage' => 10]);

        $this->assertSame('https://cdn.example.com/media/a.jpg', $page->items[0]['image']);
        $this->assertSame('https://cdn.other/b.jpg', $page->items[1]['image']);
    }
}
