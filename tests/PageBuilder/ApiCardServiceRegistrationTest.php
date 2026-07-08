<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiList\ApiListRegistry;
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

    public function testTemoignageHomeApiListIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiListRegistry $registry */
        $registry = self::getContainer()->get(ApiListRegistry::class);

        $list = $registry->get('charisma_temoignage_home');
        $this->assertNotNull($list);
        $this->assertSame('charisma_temoignage_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
    }

    public function testFlashnewsArticleHomeApiListIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiListRegistry $registry */
        $registry = self::getContainer()->get(ApiListRegistry::class);

        $list = $registry->get('flashnews_article_home');
        $this->assertNotNull($list);
        $this->assertSame('flashnews_article_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
    }
}
