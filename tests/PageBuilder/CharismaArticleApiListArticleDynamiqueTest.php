<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiListArticleDynamique\CharismaArticleAuteurApiListArticleDynamique;
use App\PageBuilder\ApiListArticleDynamique\CharismaArticleEnactionApiListArticleDynamique;
use App\PageBuilder\ApiListArticleDynamique\CharismaArticleExpressionApiListArticleDynamique;
use App\PageBuilder\ApiListArticleDynamique\CharismaTemoignageApiListArticleDynamique;
use App\PageBuilder\ApiListArticleDynamique\FlashnewsArticleApiListArticleDynamique;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class CharismaArticleApiListArticleDynamiqueTest extends TestCase
{
    /**
     * @return iterable<string, array{class-string, string, string, string}>
     */
    public static function charismaArticleProvider(): iterable
    {
        yield 'auteur' => [
            CharismaArticleAuteurApiListArticleDynamique::class,
            'charisma_article_auteur',
            'Articles Auteur',
            'https://api.charisma.fr/api/charisma/article/auteurs',
        ];
        yield 'enaction' => [
            CharismaArticleEnactionApiListArticleDynamique::class,
            'charisma_article_enaction',
            'En Action',
            'https://api.charisma.fr/api/charisma/article/enactions',
        ];
        yield 'expression' => [
            CharismaArticleExpressionApiListArticleDynamique::class,
            'charisma_article_expression',
            'Expressions',
            'https://api.charisma.fr/api/charisma/article/expressions',
        ];
    }

    /**
     * @dataProvider charismaArticleProvider
     *
     * @param class-string $class
     */
    public function testFetchItemsAndFetchItemUseCharismaEndpoints(string $class, string $id, string $label, string $url): void
    {
        $collectionResponse = $this->createMock(ResponseInterface::class);
        $collectionResponse->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    [
                        'id' => 42,
                        'titre' => 'Titre test',
                        'resume' => 'Résumé test',
                        'vues' => 100,
                        'likes' => 5,
                        'url' => 'https://www.charisma.fr/fr/article.php?id=42',
                    ],
                ],
                'totalItems' => 1,
            ]);

        $itemResponse = $this->createMock(ResponseInterface::class);
        $itemResponse->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'id' => 99,
                'titre' => 'Article direct',
                'resume' => 'Résumé direct',
                'vues' => 10,
                'likes' => 2,
                'url' => 'https://www.charisma.fr/fr/article.php?id=99',
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->exactly(2))
            ->method('request')
            ->willReturnCallback(function (string $method, string $requestUrl) use ($url, $collectionResponse, $itemResponse) {
                if ($method === 'GET' && $requestUrl === $url) {
                    return $collectionResponse;
                }
                if ($method === 'GET' && $requestUrl === $url . '/99') {
                    return $itemResponse;
                }

                throw new \RuntimeException('Unexpected request: ' . $requestUrl);
            });

        $source = new $class($client);

        $this->assertSame($id, $source->getId());
        $this->assertSame($label, $source->getLabel());

        $collection = $source->fetchItems(['page' => 1, 'itemsPerPage' => 10]);
        $this->assertCount(1, $collection->items);
        $this->assertSame('42', $collection->items[0]['id']);
        $this->assertSame('Titre test', $collection->items[0]['title']);
        $this->assertSame(100, $collection->items[0]['counter']);
        $this->assertSame(5, $collection->items[0]['like']);

        $item = $source->fetchItem('99');
        $this->assertNotNull($item);
        $this->assertSame('99', $item['id']);
        $this->assertSame('Article direct', $item['title']);
    }

    public function testTemoignageFetchItemsMapsThumbnails(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    [
                        'id' => 7,
                        'titre' => 'Témoignage',
                        'resume' => 'Histoire inspirante',
                        'url' => 'https://www.charisma.fr/fr/temoignage.php?id=7',
                        'thumbnails' => ['normal' => 'https://cdn.example/photo.jpg'],
                    ],
                ],
                'totalItems' => 1,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://api.charisma.fr/api/charisma/temoignages',
                $this->callback(static fn (array $options): bool => isset($options['query']['page']))
            )
            ->willReturn($response);

        $source = new CharismaTemoignageApiListArticleDynamique($client);
        $result = $source->fetchItems(['page' => 1, 'itemsPerPage' => 10]);

        $this->assertSame('charisma_temoignage', $source->getId());
        $this->assertSame('Témoignages', $source->getLabel());
        $this->assertSame('https://cdn.example/photo.jpg', $result->items[0]['image']);
        $this->assertSame('Histoire inspirante', $result->items[0]['description']);
    }

    public function testFlashnewsFetchItemsAndFetchItem(): void
    {
        $collectionResponse = $this->createMock(ResponseInterface::class);
        $collectionResponse->method('toArray')->willReturn([
            'member' => [
                [
                    'id' => 3157,
                    'titre' => 'La France de la corruption',
                    'viewResume' => 'Une loi-cadeau.',
                    'compteur' => 42,
                    'likes' => 3,
                    'link' => 'https://www.flashnews.fr/article/3157',
                ],
            ],
            'totalItems' => 1,
        ]);

        $itemResponse = $this->createMock(ResponseInterface::class);
        $itemResponse->method('toArray')->willReturn([
            'id' => 3157,
            'titre' => 'La France de la corruption',
            'viewResume' => 'Une loi-cadeau.',
            'compteur' => 42,
            'likes' => 3,
            'link' => 'https://www.flashnews.fr/article/3157',
        ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->exactly(2))
            ->method('request')
            ->willReturnCallback(function (string $method, string $url, array $options = []) use ($collectionResponse, $itemResponse) {
                if ($url === 'https://www.flashnews.fr/api/articles') {
                    $this->assertSame('desc', $options['query']['order[publication]'] ?? null);

                    return $collectionResponse;
                }
                if ($url === 'https://www.flashnews.fr/api/articles/3157') {
                    return $itemResponse;
                }

                throw new \RuntimeException('Unexpected: ' . $url);
            });

        $source = new FlashnewsArticleApiListArticleDynamique($client);

        $this->assertSame('flashnews_article', $source->getId());
        $this->assertSame('Flashnews', $source->getLabel());

        $collection = $source->fetchItems(['page' => 1, 'itemsPerPage' => 20]);
        $this->assertSame('3157', $collection->items[0]['id']);
        $this->assertSame(42, $collection->items[0]['counter']);

        $item = $source->fetchItem('3157');
        $this->assertNotNull($item);
        $this->assertSame('La France de la corruption', $item['title']);
    }
}
