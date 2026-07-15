<?php

declare(strict_types=1);

namespace App\Serializer;

use App\ApiResource\BuilderApiListImageItemsPage;
use App\DTO\BuilderApiListImageItemData;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('serializer.normalizer', ['priority' => 100])]
final class BuilderApiListImageItemsPageNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof BuilderApiListImageItemsPage) {
            throw new \InvalidArgumentException('Expected BuilderApiListImageItemsPage.');
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
        return $data instanceof BuilderApiListImageItemsPage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [BuilderApiListImageItemsPage::class => true];
    }

    /**
     * @return array<string, mixed>
     */
    private function normalizeItem(BuilderApiListImageItemData $item): array
    {
        $normalized = [
            'id' => $item->id,
            'image' => $item->image,
        ];

        if ($item->link !== null) {
            $normalized['link'] = $item->link;
        }
        if ($item->alt !== null) {
            $normalized['alt'] = $item->alt;
        }

        return $normalized;
    }
}
