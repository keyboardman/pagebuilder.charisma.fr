<?php

declare(strict_types=1);

namespace App\DTO\Theme;

use App\Theme\ThemeSchema;

/**
 * DTO correspondant au formulaire de configuration du thème (ThemeFormComponent).
 * Structure envoyée : config[nom], config[fonts][], config[vars][--var], config[body][...], config[h1][...], …, config[p][...].
 */
class ThemeConfigDTO
{
    private string $nom = '';

    /** @var list<int> IDs des polices à importer */
    private array $fonts = [];

    /** @var array<string, string> Variables CSS (ex. --color-primary => #570df8) */
    private array $vars = [];

    /** @var array<string, string> Styles du bloc body (font-family, font-size, line-height, color, margin, padding) */
    private array $body = [];

    /** @var array<string, string> */
    private array $h1 = [];

    /** @var array<string, string> */
    private array $h2 = [];

    /** @var array<string, string> */
    private array $h3 = [];

    /** @var array<string, string> */
    private array $h4 = [];

    /** @var array<string, string> */
    private array $h5 = [];

    /** @var array<string, string> */
    private array $h6 = [];

    /** @var array<string, string> */
    private array $div = [];

    /** @var array<string, string> */
    private array $p = [];

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): void
    {
        $this->nom = $nom;
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
    public function getBody(): array
    {
        return $this->body;
    }

    /** @param array<string, string> $body */
    public function setBody(array $body): void
    {
        $this->body = $body;
    }

    /** @return array<string, string> */
    public function getH1(): array
    {
        return $this->h1;
    }

    /** @param array<string, string> $h1 */
    public function setH1(array $h1): void
    {
        $this->h1 = $h1;
    }

    /** @return array<string, string> */
    public function getH2(): array
    {
        return $this->h2;
    }

    /** @param array<string, string> $h2 */
    public function setH2(array $h2): void
    {
        $this->h2 = $h2;
    }

    /** @return array<string, string> */
    public function getH3(): array
    {
        return $this->h3;
    }

    /** @param array<string, string> $h3 */
    public function setH3(array $h3): void
    {
        $this->h3 = $h3;
    }

    /** @return array<string, string> */
    public function getH4(): array
    {
        return $this->h4;
    }

    /** @param array<string, string> $h4 */
    public function setH4(array $h4): void
    {
        $this->h4 = $h4;
    }

    /** @return array<string, string> */
    public function getH5(): array
    {
        return $this->h5;
    }

    /** @param array<string, string> $h5 */
    public function setH5(array $h5): void
    {
        $this->h5 = $h5;
    }

    /** @return array<string, string> */
    public function getH6(): array
    {
        return $this->h6;
    }

    /** @param array<string, string> $h6 */
    public function setH6(array $h6): void
    {
        $this->h6 = $h6;
    }

    /** @return array<string, string> */
    public function getDiv(): array
    {
        return $this->div;
    }

    /** @param array<string, string> $div */
    public function setDiv(array $div): void
    {
        $this->div = $div;
    }

    /** @return array<string, string> */
    public function getP(): array
    {
        return $this->p;
    }

    /** @param array<string, string> $p */
    public function setP(array $p): void
    {
        $this->p = $p;
    }

    /**
     * Convertit le DTO en tableau config tel qu'attendu par theme.yaml / ThemeCssGenerator / writeYaml.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $out = [
            'nom' => $this->nom,
            'fonts' => $this->fonts,
            'vars' => $this->vars,
            'body' => $this->body,
            'h1' => $this->h1,
            'h2' => $this->h2,
            'h3' => $this->h3,
            'h4' => $this->h4,
            'h5' => $this->h5,
            'h6' => $this->h6,
            'div' => $this->div,
            'p' => $this->p,
        ];

        foreach (ThemeSchema::BLOCKS as $block) {
            if (!isset($out[$block]) || !is_array($out[$block])) {
                $out[$block] = [];
            }
        }

        return $out;
    }

    /**
     * Crée un ThemeConfigDTO à partir du tableau config (ex. chargé depuis theme.yaml).
     *
     * @param array<string, mixed> $config
     */
    public static function fromArray(array $config): self
    {
        $dto = new self();
        $dto->setNom((string) ($config['nom'] ?? ''));
        $fonts = $config['fonts'] ?? [];
        if (is_string($fonts)) {
            $fonts = $fonts === '' ? [] : array_values(array_filter(array_map('intval', explode(',', $fonts)), fn (int $n): bool => $n > 0));
        }
        $dto->setFonts($fonts);
        $dto->setVars(is_array($config['vars'] ?? null) ? $config['vars'] : []);
        $dto->setBody(is_array($config['body'] ?? null) ? $config['body'] : []);
        $dto->setH1(is_array($config['h1'] ?? null) ? $config['h1'] : []);
        $dto->setH2(is_array($config['h2'] ?? null) ? $config['h2'] : []);
        $dto->setH3(is_array($config['h3'] ?? null) ? $config['h3'] : []);
        $dto->setH4(is_array($config['h4'] ?? null) ? $config['h4'] : []);
        $dto->setH5(is_array($config['h5'] ?? null) ? $config['h5'] : []);
        $dto->setH6(is_array($config['h6'] ?? null) ? $config['h6'] : []);
        $dto->setDiv(is_array($config['div'] ?? null) ? $config['div'] : []);
        $dto->setP(is_array($config['p'] ?? null) ? $config['p'] : []);

        return $dto;
    }
}
