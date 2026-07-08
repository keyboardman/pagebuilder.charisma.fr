<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiList\CharismaTemoignageHomeApiList;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class CharismaTemoignageHomeApiListTest extends TestCase
{
    public function testFetchItemsUsesHomeEndpoint(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    ['id' => 140, 'titre' => 'J\'en avais beaucoup souffert', 'url' => 'https://www.charisma.fr/fr/temoignages.php?article=140'],
                ],
                'totalItems' => 10,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://api.charisma.fr/api/charisma/temoignages/home',
                ['timeout' => 30]
            )
            ->willReturn($response);

        $card = new CharismaTemoignageHomeApiList($client);
        $result = $card->fetchItems();

        $this->assertCount(1, $result);
        $this->assertSame('140', $result[0]['id']);
        $this->assertSame('J\'en avais beaucoup souffert', $result[0]['title']);
        $this->assertSame('https://www.charisma.fr/fr/temoignages.php?article=140', $result[0]['link']);
    }

    public function testFetchItemsReturnsEmptyPayloadOnHttpFailure(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new CharismaTemoignageHomeApiList($client);
        $result = $card->fetchItems();

        $this->assertSame([], $result);
    }

    public function testCardMetadataAndBehaviorMatchContract(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaTemoignageHomeApiList($client);

        $this->assertSame('charisma_temoignage_home', $card->getId());
        $this->assertSame('fixed', $card->getCollectionMode());
        $this->assertSame('Témoignages (home)', $card->getLabel());
    }
}
