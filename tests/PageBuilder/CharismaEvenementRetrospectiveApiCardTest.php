<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\CharismaEvenementRetrospectiveApiCard;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class CharismaEvenementRetrospectiveApiCardTest extends TestCase
{
    public function testFetchCollectionUsesRetrospectiveEndpointAndQuery(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    ['id' => 594, 'titre' => '28/06/2026 Kong Hee', 'source' => 'https://example.test/a.png', 'link' => 'https://example.test/invite'],
                ],
                'totalItems' => 9,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://api.charisma.fr/api/charisma/banniere/evenements/retrospective',
                [
                    'query' => [
                        'page' => '2',
                        'itemsPerPage' => '3',
                        'titre' => 'Kong',
                    ],
                    'timeout' => 30,
                ]
            )
            ->willReturn($response);

        $card = new CharismaEvenementRetrospectiveApiCard($client);
        $result = $card->fetchCollection(['page' => 2, 'limit' => 3, 'search' => 'Kong']);

        $this->assertSame(9, $result['total']);
        $this->assertCount(1, $result['items']);
        $this->assertSame(594, $result['items'][0]->id);
    }

    public function testFetchCollectionReturnsEmptyPayloadOnHttpFailure(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new CharismaEvenementRetrospectiveApiCard($client);
        $result = $card->fetchCollection([]);

        $this->assertSame(['items' => [], 'total' => 0], $result);
    }

    public function testMapItemBuildsExpectedShape(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaEvenementRetrospectiveApiCard($client);

        $raw = (object) [
            'id' => 590,
            'titre' => '10/05/2026 Jens Garnfeldt',
            'source' => 'https://www.charisma.fr/fr/upload/evenements/10052026-jens-garnfeldt-banniere-date.png',
            'link' => 'https://www.charisma.fr/fr/invites.php?invite=185',
        ];

        $mapped = $card->mapItem($raw);

        $this->assertSame('590', $mapped['id']);
        $this->assertSame('10/05/2026 Jens Garnfeldt', $mapped['title']);
        $this->assertSame('https://www.charisma.fr/fr/upload/evenements/10052026-jens-garnfeldt-banniere-date.png', $mapped['image']);
        $this->assertSame('https://www.charisma.fr/fr/invites.php?invite=185', $mapped['link']);
        $this->assertSame($raw, $mapped['raw']);
    }

    public function testMapItemSupportsPartialPayload(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaEvenementRetrospectiveApiCard($client);

        $mapped = $card->mapItem((object) []);

        $this->assertSame('', $mapped['id']);
        $this->assertSame('', $mapped['title']);
        $this->assertNull($mapped['image']);
        $this->assertNull($mapped['link']);
    }

    public function testCardMetadataAndBehaviorMatchContract(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaEvenementRetrospectiveApiCard($client);

        $this->assertSame('charisma_evenement_retrospective', $card->getId());
        $this->assertSame('Evènements retrospective', $card->getLabel());
        $this->assertSame('image', $card->getType());
        $this->assertSame('fixed', $card->getCollectionMode());
        $this->assertNull($card->getCategory());
    }
}
