<?php

declare(strict_types=1);

namespace App\Tests\Serializer;

use App\ApiResource\BuilderApiCollectionCategoriesResponse;
use App\Serializer\BuilderApiCollectionCategoriesNormalizer;
use PHPUnit\Framework\TestCase;

final class BuilderApiCollectionCategoriesNormalizerTest extends TestCase
{
    public function testNormalizeWrapsCategories(): void
    {
        $response = new BuilderApiCollectionCategoriesResponse();
        $response->categories = [
            ['id' => 'actu', 'label' => 'Actualités'],
        ];

        $normalizer = new BuilderApiCollectionCategoriesNormalizer();
        $this->assertSame([
            'categories' => [
                ['id' => 'actu', 'label' => 'Actualités'],
            ],
        ], $normalizer->normalize($response));
    }

    public function testNormalizeEmptyCategories(): void
    {
        $response = new BuilderApiCollectionCategoriesResponse();
        $normalizer = new BuilderApiCollectionCategoriesNormalizer();
        $this->assertSame(['categories' => []], $normalizer->normalize($response));
    }
}
