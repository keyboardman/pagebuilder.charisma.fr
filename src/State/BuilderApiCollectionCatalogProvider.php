<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCollectionCatalogResponse;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use Symfony\Component\HttpFoundation\Request;

/**
 * @implements ProviderInterface<BuilderApiCollectionCatalogResponse>
 */
final class BuilderApiCollectionCatalogProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCollectionRegistry $registry,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiCollectionCatalogResponse
    {
        $request = $context['request'] ?? null;
        $type = null;
        $mode = null;
        if ($request instanceof Request) {
            $typeRaw = $request->query->get('type');
            $modeRaw = $request->query->get('mode');
            $type = \is_string($typeRaw) && $typeRaw !== '' ? $typeRaw : null;
            $mode = \is_string($modeRaw) && $modeRaw !== '' ? $modeRaw : null;
        }

        $response = new BuilderApiCollectionCatalogResponse();
        $response->items = $this->registry->list($type, $mode);

        return $response;
    }
}
