<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiListArticleDynamicResolveResponse;
use App\DTO\BuilderApiCardItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiListArticleDynamicResolveResponseNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiListArticleDynamicResolveResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiListArticleDynamicResolveResponse.');
        }

        return [
            'items' => array_map($this->normalizeItem(...), $object->items),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiListArticleDynamicResolveResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiListArticleDynamicResolveResponse::class => true];
    }

    /**
     * @return array<string, mixed>
     */
    private function normalizeItem(BuilderApiCardItemData $item): array
    {
        $normalized = [
            'id' => $item->id,
            'title' => $item->title,
        ];

        if ($item->description !== null) {
            $normalized['description'] = $item->description;
        }
        if ($item->image !== null) {
            $normalized['image'] = $item->image;
        }
        if ($item->labels !== null) {
            $normalized['labels'] = $item->labels;
        }
        if ($item->link !== null) {
            $normalized['link'] = $item->link;
        }
        if ($item->text !== null) {
            $normalized['text'] = $item->text;
        }
        if ($this->hasMetricValue($item->counter)) {
            $normalized['counter'] = $item->counter;
        }
        if ($this->hasMetricValue($item->like)) {
            $normalized['like'] = $item->like;
        }
        if ($item->raw !== null) {
            $normalized['raw'] = $item->raw;
        }

        return $normalized;
    }

    private function hasMetricValue(?string $value): bool
    {
        if ($value === null) {
            return false;
        }

        $trimmed = trim($value);

        return $trimmed !== '' && $trimmed !== '0';
    }
}
