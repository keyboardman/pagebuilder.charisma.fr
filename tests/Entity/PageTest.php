<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Page;
use App\Entity\Theme;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PageTest extends KernelTestCase
{
    public function testPagePersist(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();

        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setSlug('test-theme');
        $theme->setGeneratedYamlPath('storage/themes/test-theme/theme.yaml');
        $theme->setGeneratedCssPath('storage/themes/test-theme/theme.css');
        $em->persist($theme);
        $em->flush();

        $page = new Page();
        $page->setTitle('Ma page');
        $page->setSlug('ma-page');
        $page->setTheme($theme);
        $page->setDescription('Description SEO');
        $page->setContent('Contenu de la page');
        $em->persist($page);
        $em->flush();

        $this->assertNotNull($page->getId());
        $this->assertSame('Ma page', $page->getTitle());
        $this->assertSame('ma-page', $page->getSlug());
        $this->assertSame($theme, $page->getTheme());
        $this->assertSame('Description SEO', $page->getDescription());
        $this->assertSame('Contenu de la page', $page->getContent());
    }
}
