<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiListArticle\ApiListArticleRegistry;
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
        /** @var ApiListArticleRegistry $registry */
        $registry = self::getContainer()->get(ApiListArticleRegistry::class);

        $list = $registry->get('charisma_temoignage_home');
        $this->assertNotNull($list);
        $this->assertSame('charisma_temoignage_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
    }

    public function testFlashnewsArticleHomeApiListArticleIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var ApiListArticleRegistry $registry */
        $registry = self::getContainer()->get(ApiListArticleRegistry::class);

        $list = $registry->get('flashnews_article_home');
        $this->assertNotNull($list);
        $this->assertSame('flashnews_article_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
    }

    public function testCharismaArticleAuteurApiListArticleDynamiqueIsRegisteredInBuilderRegistry(): void
    {
        self::bootKernel();
        /** @var \App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry $registry */
        $registry = self::getContainer()->get(\App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry::class);

        $expected = [
            'charisma_article_auteur' => 'Articles Auteur',
            'charisma_article_enaction' => 'En Action',
            'charisma_article_expression' => 'Expressions',
            'charisma_temoignage' => 'Témoignages',
            'flashnews_article' => 'Flashnews',
        ];

        foreach ($expected as $id => $label) {
            $source = $registry->get($id);
            $this->assertNotNull($source, 'Missing source: ' . $id);
            $this->assertSame($id, $source->getId());
            $this->assertSame($label, $source->getLabel());
        }
    }
}
