<?php

declare(strict_types=1);

namespace App\DTO\Theme;

use App\Entity\Theme;

/**
 * DTO correspondant au formulaire de configuration du thème (ThemeFormComponent).
 * Structure envoyée : config[nom], config[fonts][], config[vars][--var], config[body][...], config[h1][...], …, config[p][...].
 */
class ThemeConfigDTO
{
    private string $name = '';

    /** @var list<int> IDs des polices à importer */
    private array $fonts = [];

    /** @var array<string, string> Variables CSS (ex. --color-primary => #570df8) */
    private array $vars = [];

    /** @var array<string, string> Overrides CSS par node builder (déclarations CSS sans sélecteur). */
    private array $node_overrides = [];

    /** @var array<string, string> Styles du bloc body (font-family, font-size, line-height, color, margin, padding) */
    private array $body = [];

    /** CSS personnalisé ajouté à la fin du fichier généré (classes non prévues par le générateur). */
    private string $customCss = '';


    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /** @return list<int> */
    public function getFonts(): array
    {
        return $this->fonts;
    }

    /** @param list<int>|iterable $fonts */
    public function setFonts(iterable $fonts): void
    {
        $this->fonts = $fonts instanceof \Traversable ? iterator_to_array($fonts, false) : array_values((array) $fonts);
        $this->fonts = array_values(array_filter(array_map('intval', $this->fonts), fn (int $n): bool => $n > 0));
    }

    /** @return array<string, string> */
    public function getVars(): array
    {
        return $this->vars;
    }

    /** @param array<string, string> $vars */
    public function setVars(array $vars): void
    {
        $this->vars = $vars;
    }

    /** @return array<string, string> */
    public function getNodeOverrides(): array
    {
        return $this->node_overrides;
    }

    /** @param array<string, string> $nodeOverrides */
    public function setNodeOverrides(array $nodeOverrides): void
    {
        $this->node_overrides = $nodeOverrides;
    }

    /** @return array<string, string> */
    public function getBody(): array
    {
        return $this->body;
    }

    /** @param array<string, string> $body */
    public function setBody(array $body): void
    {
        $this->body = $body;
    }

    public function getCustomCss(): string
    {
        return $this->customCss;
    }

    public function setCustomCss(string $customCss): void
    {
        $this->customCss = $customCss;
    }


    /**
     * Convertit le DTO en tableau config tel qu'attendu par theme.yaml / ThemeCssGenerator / writeYaml.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $out = [
            'name' => $this->name,
            'fonts' => $this->fonts,
            'vars' => $this->vars,
            'node_overrides' => $this->node_overrides,
            'body' => $this->body,
            'custom_css' => $this->customCss,
        ];

        return $out;
    }

    public static function fromEntity(Theme $theme): self
    {
        $dto = new self();
        $dto->setName($theme->getName());
        $dto->setFonts($theme->getConfig()['fonts'] ?? []);
        $dto->setVars($theme->getConfig()['vars'] ?? []);
        $dto->setNodeOverrides($theme->getConfig()['node_overrides'] ?? []);
        $dto->setBody($theme->getConfig()['body'] ?? []);
        $dto->setCustomCss($theme->getConfig()['custom_css'] ?? '');
        return $dto;
    }

    public static function fromArray(array $array): self
    {
        $dto = new self();
        $dto->setName($array['name'] ?? '');
        $dto->setFonts($array['fonts'] ?? []);
        $dto->setVars($array['vars'] ?? []);
        $dto->setNodeOverrides($array['node_overrides'] ?? []);
        $dto->setBody($array['body'] ?? []);
        $dto->setCustomCss($array['custom_css'] ?? '');

        return $dto;
    }
}
