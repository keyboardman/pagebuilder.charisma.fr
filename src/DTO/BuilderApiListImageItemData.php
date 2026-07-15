<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Représentation sérialisable d'un item ApiListImage (image-only).
 */
final class BuilderApiListImageItemData
{
    public string $id = '';

    public string $image = '';

    public ?string $link = null;

    public ?string $alt = null;
}
