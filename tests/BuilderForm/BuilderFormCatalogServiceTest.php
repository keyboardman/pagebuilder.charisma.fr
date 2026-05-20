<?php

declare(strict_types=1);

namespace App\Tests\BuilderForm;

use App\BuilderForm\BuilderFormCatalogService;
use App\Entity\BuilderFormConfig;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class BuilderFormCatalogServiceTest extends KernelTestCase
{
    public function testListItemsContainsSlugAndAction(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $slug = 'catalog-test-' . bin2hex(random_bytes(3));
        $form = (new BuilderFormConfig())
            ->setSlug($slug)
            ->setLabel('Catalog test')
            ->setRecipientEmails(['t@example.org'])
            ->setEmailSubjectTemplate('{{ form_label }}')
            ->setEmailBodyTemplate('{% for row in rows %}{{ row.value }}{% endfor %}');
        $em->persist($form);
        $em->flush();

        try {
            /** @var BuilderFormCatalogService $svc */
            $svc = $container->get(BuilderFormCatalogService::class);
            $items = $svc->listItems();
            $match = null;
            foreach ($items as $item) {
                if ($item['id'] === $slug) {
                    $match = $item;
                    break;
                }
            }
            self::assertNotNull($match);
            self::assertSame('Catalog test', $match['title']);
            self::assertStringContainsString($slug, $match['action']);
            self::assertSame('_builder_form_hp', $match['honeypotField']);
        } finally {
            $em->remove($form);
            $em->flush();
        }
    }
}
