<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCardCategoriesResponse;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCardCategoriesListNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCardCategoriesResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiCardCategoriesResponse.');
        }

        return $object->categories;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiCardCategoriesResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCardCategoriesResponse::class => true];
    }
}
