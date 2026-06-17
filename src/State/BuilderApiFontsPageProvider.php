<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiFontsPage;
use App\PageBuilder\Api\BuilderApiFontEndpointProvider;
use Symfony\Component\HttpFoundation\Request;

/**
 * @implements ProviderInterface<BuilderApiFontsPage>
 */
final class BuilderApiFontsPageProvider implements ProviderInterface
{
    public function __construct(
        private readonly BuilderApiFontEndpointProvider $fontEndpointProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiFontsPage
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('Request is required to list fonts.');
        }

        $result = $this->fontEndpointProvider->listFonts($request);
        $page = new BuilderApiFontsPage();
        $page->items = $result['items'];
        $page->total = $result['total'];

        return $page;
    }
}
