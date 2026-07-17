<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCollectionResolveResponse;
use App\DTO\BuilderApiCollectionItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCollectionResolveResponseNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCollectionResolveResponse) {
            throw new \InvalidArgumentException('Expected BuilderApiCollectionResolveResponse.');
        }

        return [
            'items' => array_map(
                static function (BuilderApiCollectionItemData $item): array {
                    // Reuse items page normalizer logic inline for consistency
                    $normalized = ['id' => $item->id];
                    if ($item->title !== null && $item->title !== '') {
                        $normalized['title'] = $item->title;
                    }
                    if ($item->description !== null) {
                        $normalized['description'] = $item->description;
                    }
                    if ($item->image !== null) {
                        $normalized['image'] = $item->image;
                    }
                    if ($item->label !== null) {
                        $normalized['label'] = $item->label;
                    }
                    if ($item->labels !== null) {
                        $normalized['labels'] = $item->labels;
                    }
                    if ($item->link !== null) {
                        $normalized['link'] = $item->link;
                    }
                    if ($item->alt !== null) {
                        $normalized['alt'] = $item->alt;
                    }
                    if ($item->counter !== null && $item->counter !== '' && $item->counter !== 0) {
                        $normalized['counter'] = $item->counter;
                    }
                    if ($item->like !== null && $item->like !== '' && $item->like !== 0) {
                        $normalized['like'] = $item->like;
                    }

                    return $normalized;
                },
                $object->items
            ),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiCollectionResolveResponse;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCollectionResolveResponse::class => true];
    }
}
