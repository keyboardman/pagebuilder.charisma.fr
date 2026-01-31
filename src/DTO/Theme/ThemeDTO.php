<?php 

declare(strict_types=1);

namespace App\DTO\Theme;

use App\Entity\Font;

class ThemeDTO
{
    /** @var list<Font> */
    private array $fonts = [];

    public function getFonts(): array
    {
        return $this->fonts;
    }

    public function setFonts(iterable $fonts): void
    {
        $this->fonts = $fonts instanceof \Traversable ? iterator_to_array($fonts, false) : (array) $fonts;
    }
}   