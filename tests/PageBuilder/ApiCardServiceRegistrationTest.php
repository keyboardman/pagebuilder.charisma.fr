<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\ApiCardRegistry;
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
}
