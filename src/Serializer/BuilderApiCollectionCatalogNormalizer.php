<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCollectionCatalogResponse;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCollectionCatalogNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCollectionCatalogResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiCollectionCatalogResponse.');
        }

        return ['items' => $object->items];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiCollectionCatalogResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCollectionCatalogResponse::class => true];
    }
}
