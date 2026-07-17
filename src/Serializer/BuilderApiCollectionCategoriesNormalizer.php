<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCollectionCategoriesResponse;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCollectionCategoriesNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCollectionCategoriesResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiCollectionCategoriesResponse.');
        }

        return [
            'categories' => $object->categories,
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiCollectionCategoriesResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCollectionCategoriesResponse::class => true];
    }
}
