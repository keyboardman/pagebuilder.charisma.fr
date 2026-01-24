<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'font_variant')]
class FontVariant
{
    public const WEIGHTS = ['thin', 'extra_light', 'light', 'regular', 'medium', 'semi_bold', 'bold', 'extra_bold', 'black'];
    public const STYLES = ['normal', 'italic', 'oblique'];
    public const WIDTHS = ['normal', 'condensed', 'expanded', 'extra_condensed', 'extra_expanded'];

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Font::class, inversedBy: 'variants')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Font $font = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::WEIGHTS)]
    private string $weight = 'regular';

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::STYLES)]
    private string $style = 'normal';

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::WIDTHS)]
    private string $width = 'normal';

    /** Chemin relatif dans le stockage fonts (ex. ma-police/Bold-Italic.woff2) */
    #[ORM\Column(type: 'string', length: 512)]
    #[Assert\NotBlank]
    private string $path = '';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFont(): ?Font
    {
        return $this->font;
    }

    public function setFont(?Font $font): static
    {
        $this->font = $font;
        return $this;
    }

    public function getWeight(): string
    {
        return $this->weight;
    }

    public function setWeight(string $weight): static
    {
        $this->weight = $weight;
        return $this;
    }

    public function getStyle(): string
    {
        return $this->style;
    }

    public function setStyle(string $style): static
    {
        $this->style = $style;
        return $this;
    }

    public function getWidth(): string
    {
        return $this->width;
    }

    public function setWidth(string $width): static
    {
        $this->width = $width;
        return $this;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;
        return $this;
    }
}
