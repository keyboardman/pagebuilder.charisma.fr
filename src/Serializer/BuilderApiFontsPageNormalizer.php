<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiFontsPage;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiFontsPageNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiFontsPage) {
            throw new \InvalidArgumentException('Expected BuilderApiFontsPage.');
        }

        return [
            'items' => $object->items,
            'total' => $object->total,
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiFontsPage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiFontsPage::class => true];
    }
}
