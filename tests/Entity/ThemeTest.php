<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Theme;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ThemeTest extends KernelTestCase
{
    public function testThemePersist(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setSlug('test-theme');
        $theme->setGeneratedYamlPath('storage/themes/test-theme/theme.yaml');
        $theme->setGeneratedCssPath('storage/themes/test-theme/theme.abc123.css');
        $em->persist($theme);
        $em->flush();
        $this->assertNotNull($theme->getId());
        $this->assertStringContainsString('theme.', $theme->getGeneratedCssPath());
        $this->assertStringContainsString('.css', $theme->getGeneratedCssPath());
    }
}
