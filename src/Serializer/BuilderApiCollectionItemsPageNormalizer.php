<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiCollectionItemsPage;
use App\DTO\BuilderApiCollectionItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiCollectionItemsPageNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiCollectionItemsPage) {
            throw new \InvalidArgumentException('Expected BuilderApiCollectionItemsPage.');
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
        return $data instanceof BuilderApiCollectionItemsPage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiCollectionItemsPage::class => true];
    }

    /**
     * @return array<string, mixed>
     */
    private function normalizeItem(BuilderApiCollectionItemData $item): array
    {
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

    private function hasMetricValue(string|int|null $value): bool
    {
        if ($value === null) {
            return false;
        }
        if (\is_int($value)) {
            return $value !== 0;
        }

        $trimmed = trim($value);

        return $trimmed !== '' && $trimmed !== '0';
    }
}
