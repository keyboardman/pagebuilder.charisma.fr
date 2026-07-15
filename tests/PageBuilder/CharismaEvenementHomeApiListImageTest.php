<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiListImage\CharismaEvenementHomeApiListImage;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class CharismaEvenementHomeApiListImageTest extends TestCase
{
    public function testFetchItemsUsesHomeEndpointWithApiPlatformPagination(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    ['id' => 12, 'source' => 'https://cdn.example/banner.jpg', 'link' => 'https://example/event'],
                ],
                'totalItems' => 24,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://api.charisma.fr/api/charisma/banniere/evenements/home',
                [
                    'query' => [
                        'page' => '1',
                        'itemsPerPage' => '10',
                    ],
                    'timeout' => 30,
                ]
            )
            ->willReturn($response);

        $list = new CharismaEvenementHomeApiListImage($client);
        $result = $list->fetchItems(['page' => 1, 'itemsPerPage' => 10]);

        $this->assertCount(1, $result->items);
        $this->assertSame('12', $result->items[0]['id']);
        $this->assertSame('https://cdn.example/banner.jpg', $result->items[0]['image']);
        $this->assertSame('https://example/event', $result->items[0]['link']);
        $this->assertArrayNotHasKey('title', $result->items[0]);
        $this->assertArrayNotHasKey('description', $result->items[0]);
        $this->assertSame(24, $result->totalItems);
        $this->assertSame(3, $result->totalPages);
    }

    public function testFetchItemsReturnsEmptyPayloadOnHttpFailure(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $list = new CharismaEvenementHomeApiListImage($client);
        $result = $list->fetchItems();

        $this->assertSame([], $result->items);
    }

    public function testListMetadataAndBehaviorMatchContract(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $list = new CharismaEvenementHomeApiListImage($client);

        $this->assertSame('charisma_evenement_home', $list->getId());
        $this->assertSame('fixed', $list->getCollectionMode());
        $this->assertSame('Evènements Home', $list->getLabel());
    }
}
