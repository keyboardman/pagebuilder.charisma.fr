<?php

declare(strict_types=1);

namespace App\Entity;

use App\DTO\Theme\ThemeConfigDTO;
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

    /**
     * Configuration du thème (ThemeConfigDTO) au format JSON.
     *
     * @var array<string, mixed>|null
     */
    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $config = null;

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

    /**
     * @return array<string, mixed>|null
     */
    public function getConfig(): ?array
    {
        return $this->config;
    }

    /**
     * @param array<string, mixed>|null $config
     */
    public function setConfig(?array $config): static
    {
        $this->config = $config;
        return $this;
    }

    public function getConfigDto(): ?ThemeConfigDTO
    {
        if ($this->config === null || $this->config === []) {
            return null;
        }

        return ThemeConfigDTO::fromArray($this->config);
    }

    public function setConfigDto(?ThemeConfigDTO $dto): static
    {
        $this->config = $dto !== null ? $dto->toArray() : null;
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
