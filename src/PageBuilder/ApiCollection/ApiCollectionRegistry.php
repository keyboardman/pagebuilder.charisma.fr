<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\PageBuilder\ApiCard\ApiCardRegistry;
use App\PageBuilder\ApiListArticle\ApiListArticleRegistry;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueRegistry;
use App\PageBuilder\ApiListImage\ApiListImageRegistry;

/**
 * Registre unifié ApiCollection : adapters legacy + définitions admin enabled.
 *
 * @psalm-type ApiCollectionMeta = array{
 *   id: string,
 *   label: string,
 *   type: string,
 *   supportedModes: list<string>
 * }
 */
final class ApiCollectionRegistry
{
    /** @var array<string, ApiCollectionInterface>|null */
    private ?array $collections = null;

    /**
     * @param iterable<ApiCollectionInterface> $extraCollections
     */
    public function __construct(
        private readonly ApiListArticleRegistry $articleLists,
        private readonly ApiListImageRegistry $imageLists,
        private readonly ApiListArticleDynamiqueRegistry $dynamicArticles,
        private readonly ApiCardRegistry $cards,
        private readonly ?ConfigurableApiCollectionProvider $configurableProvider = null,
        private readonly iterable $extraCollections = [],
    ) {
    }

    /**
     * @return list<array{id: string, label: string, type: string, supportedModes: list<string>}>
     */
    public function list(?string $type = null, ?string $mode = null): array
    {
        $out = [];
        foreach ($this->all() as $collection) {
            if ($type !== null && $collection->getType() !== $type) {
                continue;
            }
            if ($mode !== null && !\in_array($mode, $collection->getSupportedModes(), true)) {
                continue;
            }
            $out[] = [
                'id' => $collection->getId(),
                'label' => $collection->getLabel(),
                'type' => $collection->getType(),
                'supportedModes' => $collection->getSupportedModes(),
            ];
        }

        return $out;
    }

    public function get(string $id): ?ApiCollectionInterface
    {
        return $this->all()[$id] ?? null;
    }

    /**
     * Ids réservés par les adapters PHP (collision interdit pour les définitions admin).
     *
     * @return list<string>
     */
    public function getReservedAdapterIds(): array
    {
        $ids = [];
        foreach ($this->buildAdapterCollections() as $id => $_) {
            $ids[] = $id;
        }

        return $ids;
    }

    /**
     * @return array<string, ApiCollectionInterface>
     */
    private function all(): array
    {
        if ($this->collections !== null) {
            return $this->collections;
        }

        $collections = $this->buildAdapterCollections();

        $extras = [];
        if ($this->configurableProvider !== null) {
            foreach ($this->configurableProvider as $collection) {
                $extras[] = $collection;
            }
        }
        foreach ($this->extraCollections as $collection) {
            if ($collection instanceof ApiCollectionInterface) {
                $extras[] = $collection;
            }
        }

        foreach ($extras as $collection) {
            $id = $collection->getId();
            if (isset($collections[$id])) {
                // Skip colliding admin definitions at runtime (validation blocks create/edit).
                continue;
            }
            $collections[$id] = $collection;
        }

        $this->collections = $collections;

        return $this->collections;
    }

    /**
     * @return array<string, ApiCollectionInterface>
     */
    private function buildAdapterCollections(): array
    {
        $collections = [];

        foreach ($this->articleLists->list() as $meta) {
            $source = $this->articleLists->get($meta['id']);
            if ($source === null) {
                continue;
            }
            $adapter = new ApiListArticleCollectionAdapter($source);
            $collections[$adapter->getId()] = $adapter;
        }

        foreach ($this->imageLists->list() as $meta) {
            $source = $this->imageLists->get($meta['id']);
            if ($source === null) {
                continue;
            }
            $adapter = new ApiListImageCollectionAdapter($source);
            $collections[$adapter->getId()] = $adapter;
        }

        foreach ($this->dynamicArticles->list() as $meta) {
            $source = $this->dynamicArticles->get($meta['id']);
            if ($source === null) {
                continue;
            }
            $adapter = new ApiListArticleDynamiqueCollectionAdapter($source);
            // Dynamic article ids can collide with fixed home lists (different purpose).
            // Prefer keeping both only if ids differ; if same id, dynamic wins for dual-mode merge.
            $existing = $collections[$adapter->getId()] ?? null;
            if ($existing !== null) {
                $collections[$adapter->getId()] = new MergedModesCollectionAdapter($existing, $adapter);
            } else {
                $collections[$adapter->getId()] = $adapter;
            }
        }

        foreach ($this->cards->list() as $meta) {
            if (($meta['type'] ?? '') !== 'video') {
                continue;
            }
            $card = $this->cards->get($meta['id']);
            if ($card === null) {
                continue;
            }
            $adapter = new ApiCardCollectionAdapter($card);
            if (isset($collections[$adapter->getId()])) {
                continue;
            }
            $collections[$adapter->getId()] = $adapter;
        }

        return $collections;
    }
}
