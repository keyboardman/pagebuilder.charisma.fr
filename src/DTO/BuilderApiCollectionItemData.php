<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Item standard ApiCollection (NodeCollection).
 */
final class BuilderApiCollectionItemData
{
    public string $id = '';

    public ?string $image = null;

    public ?string $title = null;

    public ?string $description = null;

    public ?string $label = null;

    /** @var list<string>|null */
    public ?array $labels = null;

    public string|int|null $counter = null;

    public string|int|null $like = null;

    public ?string $link = null;

    public ?string $alt = null;

    public ?string $text = null;

    /** @var array<string, mixed>|null */
    public ?array $raw = null;
}
