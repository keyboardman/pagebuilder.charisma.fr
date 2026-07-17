<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCollection\ApiCollectionItemNormalizer;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use App\PageBuilder\ApiCollection\ApiCollectionResolveEntry;
use App\PageBuilder\ApiCollection\ApiCollectionResolver;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class ApiCollectionRegistryTest extends KernelTestCase
{
    public function testLegacyArticleAndImageIdsAreVisibleInCatalog(): void
    {
        self::bootKernel();
        /** @var ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(ApiCollectionRegistry::class);

        $articleFixed = $registry->list('article', 'fixed');
        $articleIds = array_column($articleFixed, 'id');
        $this->assertContains('charisma_article_enaction_home', $articleIds);
        $this->assertContains('charisma_temoignage_home', $articleIds);
        $this->assertContains('flashnews_article_home', $articleIds);

        $imageFixed = $registry->list('image', 'fixed');
        $imageIds = array_column($imageFixed, 'id');
        $this->assertContains('charisma_evenement_home', $imageIds);
        $this->assertContains('charisma_evenement_retrospective', $imageIds);
    }

    public function testDynamicArticleSourcesAreListed(): void
    {
        self::bootKernel();
        /** @var ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(ApiCollectionRegistry::class);

        $dynamic = $registry->list('article', 'dynamic');
        $ids = array_column($dynamic, 'id');
        $this->assertContains('charisma_article_enaction', $ids);
        $this->assertContains('flashnews_article', $ids);
    }

    public function testVideoCardIsExposedAsCollection(): void
    {
        self::bootKernel();
        /** @var ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(ApiCollectionRegistry::class);

        $videos = $registry->list('video', 'fixed');
        $ids = array_column($videos, 'id');
        $this->assertContains('videos', $ids);

        $collection = $registry->get('videos');
        $this->assertNotNull($collection);
        $this->assertSame('video', $collection->getType());
        $this->assertContains('fixed', $collection->getSupportedModes());
        $this->assertContains('dynamic', $collection->getSupportedModes());
    }

    public function testItemNormalizerMapsCounterLikeAndLabel(): void
    {
        $normalized = ApiCollectionItemNormalizer::normalize([
            'id' => '42',
            'title' => 'Hello',
            'image' => 'https://example.com/a.jpg',
            'description' => 'Desc',
            'label' => 'News',
            'counter' => 12,
            'like' => 3,
            'link' => 'https://example.com',
        ]);

        $this->assertSame('42', $normalized['id']);
        $this->assertSame('Hello', $normalized['title']);
        $this->assertSame('https://example.com/a.jpg', $normalized['image']);
        $this->assertSame('Desc', $normalized['description']);
        $this->assertSame('News', $normalized['label']);
        $this->assertSame(['News'], $normalized['labels']);
        $this->assertSame(12, $normalized['counter']);
        $this->assertSame(3, $normalized['like']);
        $this->assertSame('https://example.com', $normalized['link']);
    }

    public function testResolveSkipsUnknownEntries(): void
    {
        self::bootKernel();
        /** @var ApiCollectionResolver $resolver */
        $resolver = self::getContainer()->get(ApiCollectionResolver::class);

        $items = $resolver->resolve([
            new ApiCollectionResolveEntry('unknown_api', '1'),
        ]);

        $this->assertSame([], $items);
    }

    public function testSeededCatalogHasNoDuplicateIdsAndFetchesItems(): void
    {
        self::bootKernel();
        /** @var ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(ApiCollectionRegistry::class);

        $ids = array_column($registry->list(), 'id');
        $this->assertSame($ids, array_unique($ids));

        $fixed = $registry->get('charisma_article_enaction_home');
        $this->assertNotNull($fixed);
        $this->assertStringEndsWith(' — Collection', $fixed->getLabel());
        $page = $fixed->fetchItems(['page' => 1, 'itemsPerPage' => 2]);
        $this->assertGreaterThanOrEqual(0, $page->totalItems);
        $this->assertLessThanOrEqual(2, \count($page->items));

        $dynamic = $registry->get('flashnews_article');
        $this->assertNotNull($dynamic);
        $pageDyn = $dynamic->fetchItems(['page' => 1, 'itemsPerPage' => 2]);
        if ($pageDyn->items !== []) {
            $id = (string) ($pageDyn->items[0]['id'] ?? '');
            $this->assertNotSame('', $id);
            $resolved = $dynamic->fetchItem($id);
            $this->assertNotNull($resolved);
            $this->assertSame($id, $resolved['id'] ?? null);
        }
    }
}
