<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

use App\BuilderForm\BuilderFormCatalogService;

final class BuilderApiFormEndpointProvider
{
    public function __construct(
        private readonly BuilderFormCatalogService $builderFormCatalog,
    ) {
    }

    /**
     * @return list<array{id: string, title: string, action: string, honeypotField: string}>
     */
    public function listCatalogItems(): array
    {
        return $this->builderFormCatalog->listItems();
    }
}
