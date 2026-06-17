<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiFontResolveResponse;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiFontResolveNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|null
    {
        if (!$object instanceof BuilderApiFontResolveResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiFontResolveResponse.');
        }

        return $object->font;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiFontResolveResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiFontResolveResponse::class => true];
    }
}
