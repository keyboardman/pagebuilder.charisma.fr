<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Représentation sérialisable d'un item card (hors ressource API Platform).
 */
final class BuilderApiCardItemData
{
    public string $id = '';

    public string $title = '';

    public ?string $description = null;

    public ?string $image = null;

    /** @var list<string>|null */
    public ?array $labels = null;

    public ?string $link = null;

    public ?string $text = null;

    /** @var array<string, mixed>|null */
    public ?array $raw = null;
}
