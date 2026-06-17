<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

use App\ApiResource\BuilderApiCard;
use App\DTO\BuilderApiCardCategoryData;
use App\ApiResource\BuilderApiCardItem;
use App\ApiResource\BuilderApiCardItemsPage;
use App\DTO\BuilderApiCardItemData;

final class BuilderApiResourceFactory
{
    /**
     * @param array{
     *   id: string,
     *   label: string,
     *   type: string,
     *   category: string|null,
     *   collectionMode: string
     * } $data
     */
    public function createCard(array $data): BuilderApiCard
    {
        $card = new BuilderApiCard();
        $card->id = $data['id'];
        $card->label = $data['label'];
        $card->type = $data['type'];
        $card->category = $data['category'];
        $card->collectionMode = $data['collectionMode'];

        return $card;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function createItem(array $data): BuilderApiCardItem
    {
        return $this->mapItemData($data, new BuilderApiCardItem());
    }

    public function createItemData(array $data): BuilderApiCardItemData
    {
        return $this->mapItemData($data, new BuilderApiCardItemData());
    }

    /**
     * @template T of BuilderApiCardItem|BuilderApiCardItemData
     * @param T $item
     * @return T
     */
    private function mapItemData(array $data, BuilderApiCardItem|BuilderApiCardItemData $item): BuilderApiCardItem|BuilderApiCardItemData
    {
        $item->id = (string) ($data['id'] ?? '');
        $item->title = (string) ($data['title'] ?? '');
        $item->description = isset($data['description']) ? (string) $data['description'] : null;
        $item->image = isset($data['image']) ? (string) $data['image'] : null;
        $item->labels = \is_array($data['labels'] ?? null) ? array_values($data['labels']) : null;
        $item->link = isset($data['link']) ? (string) $data['link'] : null;
        $item->text = isset($data['text']) ? (string) $data['text'] : null;
        $raw = $data['raw'] ?? null;
        $item->raw = \is_array($raw) ? $raw : null;

        return $item;
    }

    /**
     * @param array{items: list<array<string, mixed>>, total: int} $data
     */
    public function createItemsPage(array $data): BuilderApiCardItemsPage
    {
        $page = new BuilderApiCardItemsPage();
        $page->total = $data['total'];

        foreach ($data['items'] as $itemData) {
            $page->items[] = $this->createItemData($itemData);
        }

        return $page;
    }

    /**
     * @param array{id: string, label: string} $data
     */
    public function createCategory(array $data): BuilderApiCardCategoryData
    {
        $category = new BuilderApiCardCategoryData();
        $category->id = $data['id'];
        $category->label = $data['label'];

        return $category;
    }
}
