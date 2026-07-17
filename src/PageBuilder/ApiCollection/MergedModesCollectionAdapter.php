<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Fusionne deux ApiCollection de même id (ex. liste fixed + source dynamic) en cumulant les modes.
 *
 * @deprecated since 2026-07 — fusion fixed/dynamic plus utilisée (sources article seedées). Conservé pour rollback.
 */
final class MergedModesCollectionAdapter implements ApiCollectionInterface
{
    public function __construct(
        private readonly ApiCollectionInterface $primary,
        private readonly ApiCollectionInterface $secondary,
    ) {
    }

    public function getId(): string
    {
        return $this->primary->getId();
    }

    public function getLabel(): string
    {
        return $this->primary->getLabel();
    }

    public function getType(): string
    {
        return $this->primary->getType();
    }

    public function getSupportedModes(): array
    {
        $modes = array_values(array_unique(array_merge(
            $this->primary->getSupportedModes(),
            $this->secondary->getSupportedModes()
        )));
        sort($modes);

        return $modes;
    }

    public function fetchItems(array $params = []): ApiCollectionPageResult
    {
        // Prefer secondary (dynamic) when search is present; otherwise primary (fixed) if available.
        $preferDynamic = isset($params['search']) && \is_string($params['search']) && $params['search'] !== '';
        if ($preferDynamic && \in_array('dynamic', $this->secondary->getSupportedModes(), true)) {
            return $this->secondary->fetchItems($params);
        }
        if (\in_array('fixed', $this->primary->getSupportedModes(), true)) {
            return $this->primary->fetchItems($params);
        }

        return $this->secondary->fetchItems($params);
    }

    public function fetchItem(string $id): ?array
    {
        if (\in_array('dynamic', $this->secondary->getSupportedModes(), true)) {
            $item = $this->secondary->fetchItem($id);
            if ($item !== null) {
                return $item;
            }
        }

        return $this->primary->fetchItem($id);
    }
}
