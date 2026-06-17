<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCardItemsPage;
use App\DTO\BuilderApiCardItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCardItemsPageNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCardItemsPage) {
            throw new \InvalidArgumentException('Expected BuilderApiCardItemsPage.');
        }

        return [
            'items' => array_map($this->normalizeItem(...), $object->items),
            'total' => $object->total,
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiCardItemsPage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCardItemsPage::class => true];
    }

    /**
     * @return array<string, mixed>
     */
    private function normalizeItem(BuilderApiCardItemData $item): array
    {
        $normalized = [
            'id' => $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'image' => $item->image,
            'labels' => $item->labels,
            'link' => $item->link,
            'text' => $item->text,
        ];

        if ($item->raw !== null) {
            $normalized['raw'] = $item->raw;
        }

        return $normalized;
    }
}
