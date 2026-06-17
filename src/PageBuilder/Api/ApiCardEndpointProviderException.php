<?php

declare(strict_types=1);

namespace App\PageBuilder\Api;

final class ApiCardEndpointProviderException extends \RuntimeException
{
    public const API_NOT_FOUND = 'api_not_found';
    public const ITEM_NOT_FOUND = 'item_not_found';

    public function __construct(string $message, public readonly string $reason)
    {
        parent::__construct($message);
    }

    public static function apiNotFound(string $apiId): self
    {
        return new self(\sprintf('API not found: %s', $apiId), self::API_NOT_FOUND);
    }

    public static function itemNotFound(string $itemId): self
    {
        return new self(\sprintf('Item not found: %s', $itemId), self::ITEM_NOT_FOUND);
    }
}
