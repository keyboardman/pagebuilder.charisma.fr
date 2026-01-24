<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'theme')]
class Theme
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $name = '';

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $slug = null;

    /** Défini par le contrôleur avant persist (writeYaml + ThemeCssGenerator). */
    #[ORM\Column(type: 'string', length: 512)]
    private string $generatedYamlPath = '';

    /** Défini par le contrôleur avant persist (ThemeCssGenerator). */
    #[ORM\Column(type: 'string', length: 512)]
    private string $generatedCssPath = '';

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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getGeneratedYamlPath(): string
    {
        return $this->generatedYamlPath;
    }

    public function setGeneratedYamlPath(string $generatedYamlPath): static
    {
        $this->generatedYamlPath = $generatedYamlPath;
        return $this;
    }

    public function getGeneratedCssPath(): string
    {
        return $this->generatedCssPath;
    }

    public function setGeneratedCssPath(string $generatedCssPath): static
    {
        $this->generatedCssPath = $generatedCssPath;
        return $this;
    }
}
