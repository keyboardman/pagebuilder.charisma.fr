<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'font')]
#[UniqueEntity(fields: ['slug'])]
class Font
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $name = '';

    #[ORM\Column(length: 20, enumType: FontType::class)]
    private FontType $type = FontType::Native;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $fallback = 'sans-serif';

    #[ORM\Column(type: 'string', length: 255, unique: true)]
    #[Assert\NotBlank]
    private string $slug = '';

    #[ORM\Column(type: 'string', length: 512, nullable: true)]
    private ?string $googleFontUrl = null;

    /** @var Collection<int, FontVariant> */
    #[ORM\OneToMany(targetEntity: FontVariant::class, mappedBy: 'font', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $variants;

    public function __construct()
    {
        $this->variants = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): FontType
    {
        return $this->type;
    }

    public function setType(FontType $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getFallback(): string
    {
        return $this->fallback;
    }

    public function setFallback(string $fallback): static
    {
        $this->fallback = $fallback;
        return $this;
    }

    public function __toString(): string
    {
        return $this->toString();
    }

    public function toString(): string
    {
        return $this->name . ', ' . $this->fallback;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getGoogleFontUrl(): ?string
    {
        return $this->googleFontUrl;
    }

    public function setGoogleFontUrl(?string $googleFontUrl): static
    {
        $this->googleFontUrl = $googleFontUrl;
        return $this;
    }

    /** @return Collection<int, FontVariant> */
    public function getVariants(): Collection
    {
        return $this->variants;
    }

    public function addVariant(FontVariant $variant): static
    {
        if (!$this->variants->contains($variant)) {
            $this->variants->add($variant);
            $variant->setFont($this);
        }
        return $this;
    }

    public function removeVariant(FontVariant $variant): static
    {
        $this->variants->removeElement($variant);
        return $this;
    }
}
