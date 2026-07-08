<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiList\CharismaArticleEnactionHomeApiList;
use App\PageBuilder\ApiList\CharismaArticleExpressionHomeApiList;
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
    public function testFetchItemsUsesHomeEndpointAndMapsFields(string $class, string $id, string $label, string $url): void
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
                ['timeout' => 30]
            )
            ->willReturn($response);

        /** @var object{fetchItems: callable(): array, getId: callable(): string, getLabel: callable(): string, getCollectionMode: callable(): string} $card */
        $card = new $class($client);
        $result = $card->fetchItems();

        $this->assertCount(1, $result);
        $this->assertSame('235', $result[0]['id']);
        $this->assertSame('Évangélisation dans un camp de Roms', $result[0]['title']);
        $this->assertSame('Dimanche 13 avril…', $result[0]['description']);
        $this->assertSame(12438, $result[0]['counter']);
        $this->assertSame(336, $result[0]['like']);
        $this->assertSame('https://www.charisma.fr/fr/enaction.php?article=235', $result[0]['link'] ?? $result[0]['link']);
        $this->assertNull($result[0]['image']);

        $this->assertSame($id, $card->getId());
        $this->assertSame($label, $card->getLabel());
        $this->assertSame('fixed', $card->getCollectionMode());
    }

    /**
     * @dataProvider cardProvider
     *
     * @param class-string $class
     */
    public function testFetchItemsReturnsEmptyPayloadOnHttpFailure(string $class): void
    {
        $client = $this->createMock(HttpClientInterface::class);
        $client->expects($this->once())
            ->method('request')
            ->willThrowException(new \RuntimeException('boom'));

        $card = new $class($client);
        $result = $card->fetchItems();

        $this->assertSame([], $result);
    }
}

