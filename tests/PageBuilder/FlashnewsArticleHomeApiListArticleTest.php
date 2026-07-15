<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiListArticle\FlashnewsArticleHomeApiListArticle;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class FlashnewsArticleHomeApiListArticleTest extends TestCase
{
    public function testFetchItemsUsesArticlesEndpointWithApiPlatformPagination(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    [
                        'id' => 3157,
                        'titre' => 'La France de la corruption',
                        'viewResume' => 'Une « loi-cadeau ».',
                        'compteur' => 42,
                        'likes' => 3,
                        'link' => 'https://www.flashnews.fr/article/la-france-de-la-corruption-poursuit-joyeusement-son-chemin-3157',
                    ],
                ],
                'totalItems' => 568,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://www.flashnews.fr/api/articles',
                [
                    'query' => [
                        'order[publication]' => 'desc',
                        'page' => '2',
                        'itemsPerPage' => '20',
                    ],
                    'timeout' => 30,
                ]
            )
            ->willReturn($response);

        $card = new FlashnewsArticleHomeApiListArticle($client);
        $result = $card->fetchItems(['page' => 2, 'itemsPerPage' => 20]);

        $this->assertCount(1, $result->items);
        $this->assertSame('3157', $result->items[0]['id']);
        $this->assertSame('La France de la corruption', $result->items[0]['title']);
        $this->assertSame('Une « loi-cadeau ».', $result->items[0]['description']);
        $this->assertSame(
            'https://www.flashnews.fr/article/la-france-de-la-corruption-poursuit-joyeusement-son-chemin-3157',
            $result->items[0]['link']
        );
        $this->assertSame(42, $result->items[0]['counter']);
        $this->assertSame(3, $result->items[0]['like']);
        $this->assertSame(568, $result->totalItems);
        $this->assertSame(29, $result->totalPages);
        $this->assertSame(2, $result->page);
        $this->assertSame(20, $result->itemsPerPage);
    }

    public function testFetchItemsReturnsEmptyPayloadOnHttpFailure(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new FlashnewsArticleHomeApiListArticle($client);
        $result = $card->fetchItems(['page' => 1, 'itemsPerPage' => 10]);

        $this->assertSame([], $result->items);
        $this->assertSame(0, $result->totalItems);
        $this->assertSame(0, $result->totalPages);
    }

    public function testCardMetadataAndBehaviorMatchContract(): void
    {
        $card = new FlashnewsArticleHomeApiListArticle($this->createStub(HttpClientInterface::class));

        $this->assertSame('flashnews_article_home', $card->getId());
        $this->assertSame('Flashnews (home)', $card->getLabel());
        $this->assertSame('fixed', $card->getCollectionMode());
    }
}
