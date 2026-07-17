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
        $apiId = self::stringifyId($data['apiId'] ?? $data['type'] ?? null);
        $itemId = self::stringifyId($data['itemId'] ?? $data['id'] ?? null);

        if ($apiId === null || $apiId === '' || $itemId === null || $itemId === '') {
            return null;
        }

        return new self($apiId, $itemId);
    }

    /**
     * Accepte string ou nombre JSON (legacy NodeVideoApi / ApiCard stockaient parfois itemId en int).
     */
    private static function stringifyId(mixed $value): ?string
    {
        if (\is_string($value)) {
            return $value;
        }
        if (\is_int($value) || \is_float($value)) {
            return (string) $value;
        }

        return null;
    }
}
