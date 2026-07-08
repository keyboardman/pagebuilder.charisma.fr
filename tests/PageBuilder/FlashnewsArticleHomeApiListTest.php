<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiList\FlashnewsArticleHomeApiList;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class FlashnewsArticleHomeApiListTest extends TestCase
{
    public function testFetchItemsUsesArticlesEndpoint(): void
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
                        'image' => '/upload/flashnews/58b94a018d067.png',
                        'themes' => ['Justice', 'Politique'],
                        'vues' => 42,
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
                'https://www.flashnews.fr/api/articles?page=1&itemsPerPage=10&order[publication]=desc',
                ['timeout' => 30]
            )
            ->willReturn($response);

        $card = new FlashnewsArticleHomeApiList($client);
        $result = $card->fetchItems();

        $this->assertCount(1, $result);
        $this->assertSame('3157', $result[0]['id']);
        $this->assertSame('La France de la corruption', $result[0]['title']);
        $this->assertSame('Une « loi-cadeau ».', $result[0]['description']);
        $this->assertSame(
            'https://www.flashnews.fr/upload/flashnews/58b94a018d067.png',
            $result[0]['image']
        );
        $this->assertSame(['Justice', 'Politique'], $result[0]['labels']);
        $this->assertSame(
            'https://www.flashnews.fr/article/la-france-de-la-corruption-poursuit-joyeusement-son-chemin-3157',
            $result[0]['link']
        );
        $this->assertSame(42, $result[0]['counter']);
        $this->assertSame(3, $result[0]['like']);
    }

    public function testFetchItemsReturnsEmptyPayloadOnHttpFailure(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new FlashnewsArticleHomeApiList($client);
        $result = $card->fetchItems();

        $this->assertSame([], $result);
    }

    public function testCardMetadataAndBehaviorMatchContract(): void
    {
        $card = new FlashnewsArticleHomeApiList($this->createStub(HttpClientInterface::class));

        $this->assertSame('flashnews_article_home', $card->getId());
        $this->assertSame('Flashnews (home)', $card->getLabel());
        $this->assertSame('fixed', $card->getCollectionMode());
    }
}
