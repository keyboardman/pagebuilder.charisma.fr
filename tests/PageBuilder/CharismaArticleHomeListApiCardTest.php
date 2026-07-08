<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCard\CharismaArticleEnactionHomeApiList;
use App\PageBuilder\ApiCard\CharismaArticleExpressionHomeApiList;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class CharismaArticleHomeListApiCardTest extends TestCase
{
    /**
     * @return iterable<string, array{class-string, string, string, string}>
     */
    public static function cardProvider(): iterable
    {
        yield 'enaction' => [
            CharismaArticleEnactionHomeApiList::class,
            'charisma_article_enaction_home',
            'En Action (home)',
            'https://api.charisma.fr/api/charisma/article/enactions/home',
        ];
        yield 'expression' => [
            CharismaArticleExpressionHomeApiList::class,
            'charisma_article_expression_home',
            'Expressions (home)',
            'https://api.charisma.fr/api/charisma/article/expressions/home',
        ];
    }

    /**
     * @dataProvider cardProvider
     *
     * @param class-string $class
     */
    public function testFetchCollectionUsesHomeEndpoint(string $class, string $id, string $label, string $url): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->expects($this->once())
            ->method('toArray')
            ->willReturn([
                'member' => [
                    [
                        'id' => 235,
                        'titre' => 'Évangélisation dans un camp de Roms',
                        'resume' => 'Dimanche 13 avril…',
                        'vues' => 12438,
                        'likes' => 336,
                        'url' => 'https://www.charisma.fr/fr/enaction.php?article=235',
                    ],
                ],
                'totalItems' => 10,
            ]);

        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                $url,
                [
                    'query' => [
                        'page' => '1',
                        'itemsPerPage' => '5',
                        'titre' => 'Roms',
                    ],
                    'timeout' => 30,
                ]
            )
            ->willReturn($response);

        $card = new $class($client);
        $result = $card->fetchCollection(['page' => 1, 'limit' => 5, 'search' => 'Roms']);

        $this->assertSame(10, $result['total']);
        $this->assertCount(1, $result['items']);
        $this->assertSame(235, $result['items'][0]->id);
        $this->assertSame('list', $card->getType());
        $this->assertSame($id, $card->getId());
        $this->assertSame($label, $card->getLabel());
        $this->assertSame('fixed', $card->getCollectionMode());
    }

    /**
     * @dataProvider cardProvider
     *
     * @param class-string $class
     */
    public function testFetchCollectionReturnsEmptyPayloadOnHttpFailure(string $class): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new $class($client);
        $result = $card->fetchCollection([]);

        $this->assertSame(['items' => [], 'total' => 0], $result);
    }

    public function testEnactionMapItemUsesVuesAsCounter(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaArticleEnactionHomeApiList($client);

        $raw = (object) [
            'id' => 235,
            'titre' => 'Évangélisation dans un camp de Roms',
            'resume' => 'Dimanche 13 avril…',
            'vues' => 12438,
            'likes' => 336,
            'url' => 'https://www.charisma.fr/fr/enaction.php?article=235',
        ];

        $mapped = $card->mapItem($raw);

        $this->assertSame('235', $mapped['id']);
        $this->assertSame('Évangélisation dans un camp de Roms', $mapped['title']);
        $this->assertSame('Dimanche 13 avril…', $mapped['description']);
        $this->assertSame(12438, $mapped['counter']);
        $this->assertSame(336, $mapped['like']);
        $this->assertSame('https://www.charisma.fr/fr/enaction.php?article=235', $mapped['link']);
        $this->assertNull($mapped['image']);
        $this->assertSame($raw, $mapped['raw']);
    }

    public function testExpressionMapItemUsesVuesAsCounter(): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $card = new CharismaArticleExpressionHomeApiList($client);

        $raw = (object) [
            'id' => 128,
            'titre' => 'Quand un peuple se met à rêver',
            'resume' => 'Finalement un rêve est accompli !',
            'vues' => 13021,
            'likes' => 260,
            'url' => 'https://www.charisma.fr/fr/expression.php?article=128',
        ];

        $mapped = $card->mapItem($raw);

        $this->assertSame('128', $mapped['id']);
        $this->assertSame('Quand un peuple se met à rêver', $mapped['title']);
        $this->assertSame('Finalement un rêve est accompli !', $mapped['description']);
        $this->assertSame(13021, $mapped['counter']);
        $this->assertSame(260, $mapped['like']);
        $this->assertSame('https://www.charisma.fr/fr/expression.php?article=128', $mapped['link']);
        $this->assertNull($mapped['image']);
        $this->assertSame($raw, $mapped['raw']);
    }
}
