<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use App\PageBuilder\ApiListImage\ApiListImageRegistry;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class ApiCardServiceRegistrationTest extends KernelTestCase
{
    public function testRetrospectiveApiCardIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiCardRegistry $registry */
        $registry = self::getContainer()->get(ApiCardRegistry::class);

        $card = $registry->get('charisma_evenement_retrospective');
        $this->assertNotNull($card);
        $this->assertSame('charisma_evenement_retrospective', $card->getId());
        $this->assertSame('image', $card->getType());
    }

    public function testTemoignageHomeIsAvailableViaApiCollection(): void
    {
        self::bootKernel();
        /** @var \App\PageBuilder\ApiCollection\ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(\App\PageBuilder\ApiCollection\ApiCollectionRegistry::class);

        $collection = $registry->get('charisma_temoignage_home');
        $this->assertNotNull($collection);
        $this->assertSame('charisma_temoignage_home', $collection->getId());
        $this->assertSame('article', $collection->getType());
        $this->assertContains('fixed', $collection->getSupportedModes());
        $this->assertStringEndsWith(' — Collection', $collection->getLabel());
    }

    public function testFlashnewsArticleHomeIsAvailableViaApiCollection(): void
    {
        self::bootKernel();
        /** @var \App\PageBuilder\ApiCollection\ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(\App\PageBuilder\ApiCollection\ApiCollectionRegistry::class);

        $collection = $registry->get('flashnews_article_home');
        $this->assertNotNull($collection);
        $this->assertSame('flashnews_article_home', $collection->getId());
        $this->assertContains('fixed', $collection->getSupportedModes());
        $this->assertStringEndsWith(' — Collection', $collection->getLabel());
    }

    public function testSeededDynamicArticlesAreAvailableViaApiCollection(): void
    {
        self::bootKernel();
        /** @var \App\PageBuilder\ApiCollection\ApiCollectionRegistry $registry */
        $registry = self::getContainer()->get(\App\PageBuilder\ApiCollection\ApiCollectionRegistry::class);

        $expected = [
            'charisma_article_auteur',
            'charisma_article_enaction',
            'charisma_article_expression',
            'charisma_temoignage',
            'flashnews_article',
        ];

        foreach ($expected as $id) {
            $collection = $registry->get($id);
            $this->assertNotNull($collection, 'Missing collection: ' . $id);
            $this->assertSame($id, $collection->getId());
            $this->assertContains('dynamic', $collection->getSupportedModes());
            $this->assertStringEndsWith(' — Collection', $collection->getLabel());
        }
    }

    public function testEvenementHomeApiListImageIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiListImageRegistry $registry */
        $registry = self::getContainer()->get(ApiListImageRegistry::class);

        $list = $registry->get('charisma_evenement_home');
        $this->assertNotNull($list);
        $this->assertSame('charisma_evenement_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
        $this->assertSame('Evènements Home', $list->getLabel());
    }

    public function testEvenementRetrospectiveApiListImageIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiListImageRegistry $registry */
        $registry = self::getContainer()->get(ApiListImageRegistry::class);

        $list = $registry->get('charisma_evenement_retrospective');
        $this->assertNotNull($list);
        $this->assertSame('charisma_evenement_retrospective', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
        $this->assertSame('Evènements retrospective', $list->getLabel());
    }
}
