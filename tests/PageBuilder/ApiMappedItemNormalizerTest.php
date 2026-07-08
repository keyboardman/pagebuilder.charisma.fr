<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\Api\ApiMappedItemNormalizer;
use PHPUnit\Framework\TestCase;

final class ApiMappedItemNormalizerTest extends TestCase
{
    public function testNormalizeKeepsMappedShapeAndRawObjectAsArray(): void
    {
        $normalizer = new ApiMappedItemNormalizer();
        $mapped = [
            'id' => 'item-1',
            'title' => 'Titre',
            'description' => 'Desc',
            'image' => '/img.jpg',
            'labels' => ['a'],
            'link' => '/page',
            'text' => 'Texte',
            'counter' => 123,
            'like' => 45,
            'raw' => (object) ['foo' => 'bar'],
        ];

        $normalized = $normalizer->normalize($mapped);

        $this->assertSame('item-1', $normalized['id']);
        $this->assertSame('Titre', $normalized['title']);
        $this->assertSame('Desc', $normalized['description']);
        $this->assertSame('/img.jpg', $normalized['image']);
        $this->assertSame(['a'], $normalized['labels']);
        $this->assertSame('/page', $normalized['link']);
        $this->assertSame('Texte', $normalized['text']);
        $this->assertSame(123, $normalized['counter']);
        $this->assertSame(45, $normalized['like']);
        $this->assertSame(['foo' => 'bar'], $normalized['raw']);
    }

    public function testNormalizeFillsOptionalFieldsWithNullWhenMissing(): void
    {
        $normalizer = new ApiMappedItemNormalizer();
        $mapped = [
            'id' => 'item-2',
            'title' => 'Only title',
        ];

        $normalized = $normalizer->normalize($mapped);

        $this->assertSame('item-2', $normalized['id']);
        $this->assertSame('Only title', $normalized['title']);
        $this->assertArrayNotHasKey('raw', $normalized);
        $this->assertNull($normalized['description']);
        $this->assertNull($normalized['image']);
        $this->assertNull($normalized['labels']);
        $this->assertNull($normalized['link']);
        $this->assertNull($normalized['text']);
        $this->assertNull($normalized['counter']);
        $this->assertNull($normalized['like']);
    }
}
