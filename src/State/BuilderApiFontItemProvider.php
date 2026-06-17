<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiFontItem;
use App\PageBuilder\Api\BuilderApiFontEndpointProvider;

/**
 * @implements ProviderInterface<BuilderApiFontItem>
 */
final class BuilderApiFontItemProvider implements ProviderInterface
{
    public function __construct(
        private readonly BuilderApiFontEndpointProvider $fontEndpointProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): BuilderApiFontItem
    {
        $id = (int) ($uriVariables['id'] ?? 0);
        $payload = $this->fontEndpointProvider->getFont($id);

        return $this->mapFont($payload);
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function mapFont(array $payload): BuilderApiFontItem
    {
        $font = new BuilderApiFontItem();
        $font->id = (int) ($payload['id'] ?? 0);
        $font->name = (string) ($payload['name'] ?? '');
        $font->href = (string) ($payload['href'] ?? '');
        $font->fontFamily = (string) ($payload['fontFamily'] ?? '');
        $font->type = (string) ($payload['type'] ?? '');

        return $font;
    }
}
