<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\FontVariant;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class FontTest extends KernelTestCase
{
    public function testFontAndVariantPersist(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
        $font = new Font();
        $font->setName('Test Font');
        $font->setType(FontTypeEnum::Native);
        $font->setFallback('sans-serif');
        $font->setSlug('test-font');
        $em->persist($font);
        $em->flush();
        $this->assertNotNull($font->getId());

        $font->setType(FontTypeEnum::Custom);
        $v = new FontVariant();
        $v->setWeight('regular');
        $v->setStyle('normal');
        $v->setWidth('normal');
        $v->setPath('test-font/Regular.woff2');
        $font->addVariant($v);
        $em->flush();
        $this->assertNotNull($v->getId());
    }
}
