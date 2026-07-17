<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Entrée de resolve dynamic : { apiId, itemId }.
 */
final readonly class ApiCollectionResolveEntry
{
    public function __construct(
        public string $apiId,
        public string $itemId,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): ?self
    {
        $apiId = $data['apiId'] ?? $data['type'] ?? null;
        $itemId = $data['itemId'] ?? $data['id'] ?? null;

        if (!\is_string($apiId) || $apiId === '' || !\is_string($itemId) || $itemId === '') {
            return null;
        }

        return new self($apiId, $itemId);
    }
}
