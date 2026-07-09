<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiListItemsPage;
use App\DTO\BuilderApiCardItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiListItemsPageNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiListItemsPage) {
            throw new \InvalidArgumentException('Expected BuilderApiListItemsPage.');
        }

        return [
            'items' => array_map($this->normalizeItem(...), $object->items),
            'totalItems' => $object->totalItems,
            'totalPages' => $object->totalPages,
            'page' => $object->page,
            'itemsPerPage' => $object->itemsPerPage,
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof BuilderApiListItemsPage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiListItemsPage::class => true];
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

