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

    /** @var array<string, string> Base .ch_btn */
    private array $ch_btn = [];

    /** @var array<string, string> Variant .ch_btn_primary */
    private array $ch_btn_primary = [];

    /** @var array<string, string> Variant .ch_btn_info */
    private array $ch_btn_info = [];

    /** @var array<string, string> Variant .ch_btn_warning */
    private array $ch_btn_warning = [];

    /** @var array<string, string> Variant .ch_btn_success */
    private array $ch_btn_success = [];

    /** @var array<string, string> Variant .ch_btn_danger */
    private array $ch_btn_danger = [];

    /** @var array<string, string> Size .ch_btn_sm */
    private array $ch_btn_sm = [];

    /** @var array<string, string> Size .ch_btn_lg */
    private array $ch_btn_lg = [];

    /** CSS personnalisé ajouté à la fin du fichier généré (classes non prévues par le générateur). */
    private string $customCss = '';

    /** @var array<string, string> Hover pour chaque variante (background-color, color, border-color) */
    private array $ch_btn_hover = [];
    private array $ch_btn_disabled = [];
    private array $ch_btn_primary_hover = [];
    private array $ch_btn_primary_disabled = [];
    private array $ch_btn_info_hover = [];
    private array $ch_btn_info_disabled = [];
    private array $ch_btn_warning_hover = [];
    private array $ch_btn_warning_disabled = [];
    private array $ch_btn_success_hover = [];
    private array $ch_btn_success_disabled = [];
    private array $ch_btn_danger_hover = [];
    private array $ch_btn_danger_disabled = [];

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

    /** @return array<string, string> */
    public function getChBtn(): array
    {
        return $this->ch_btn;
    }

    /** @param array<string, string> $ch_btn */
    public function setChBtn(array $ch_btn): void
    {
        $this->ch_btn = $ch_btn;
    }

    /** @return array<string, string> */
    public function getChBtnPrimary(): array
    {
        return $this->ch_btn_primary;
    }

    /** @param array<string, string> $ch_btn_primary */
    public function setChBtnPrimary(array $ch_btn_primary): void
    {
        $this->ch_btn_primary = $ch_btn_primary;
    }

    /** @return array<string, string> */
    public function getChBtnInfo(): array
    {
        return $this->ch_btn_info;
    }

    /** @param array<string, string> $ch_btn_info */
    public function setChBtnInfo(array $ch_btn_info): void
    {
        $this->ch_btn_info = $ch_btn_info;
    }

    /** @return array<string, string> */
    public function getChBtnWarning(): array
    {
        return $this->ch_btn_warning;
    }

    /** @param array<string, string> $ch_btn_warning */
    public function setChBtnWarning(array $ch_btn_warning): void
    {
        $this->ch_btn_warning = $ch_btn_warning;
    }

    /** @return array<string, string> */
    public function getChBtnSuccess(): array
    {
        return $this->ch_btn_success;
    }

    /** @param array<string, string> $ch_btn_success */
    public function setChBtnSuccess(array $ch_btn_success): void
    {
        $this->ch_btn_success = $ch_btn_success;
    }

    /** @return array<string, string> */
    public function getChBtnDanger(): array
    {
        return $this->ch_btn_danger;
    }

    /** @param array<string, string> $ch_btn_danger */
    public function setChBtnDanger(array $ch_btn_danger): void
    {
        $this->ch_btn_danger = $ch_btn_danger;
    }

    /** @return array<string, string> */
    public function getChBtnSm(): array
    {
        return $this->ch_btn_sm;
    }

    /** @param array<string, string> $ch_btn_sm */
    public function setChBtnSm(array $ch_btn_sm): void
    {
        $this->ch_btn_sm = $ch_btn_sm;
    }

    /** @return array<string, string> */
    public function getChBtnLg(): array
    {
        return $this->ch_btn_lg;
    }

    /** @param array<string, string> $ch_btn_lg */
    public function setChBtnLg(array $ch_btn_lg): void
    {
        $this->ch_btn_lg = $ch_btn_lg;
    }

    public function getCustomCss(): string
    {
        return $this->customCss;
    }

    public function setCustomCss(string $customCss): void
    {
        $this->customCss = $customCss;
    }

    /** @return array<string, string> */
    public function getChBtnHover(): array
    {
        return $this->ch_btn_hover;
    }

    /** @param array<string, string> $ch_btn_hover */
    public function setChBtnHover(array $ch_btn_hover): void
    {
        $this->ch_btn_hover = $ch_btn_hover;
    }

    /** @return array<string, string> */
    public function getChBtnDisabled(): array
    {
        return $this->ch_btn_disabled;
    }

    /** @param array<string, string> $ch_btn_disabled */
    public function setChBtnDisabled(array $ch_btn_disabled): void
    {
        $this->ch_btn_disabled = $ch_btn_disabled;
    }

    /** @return array<string, string> */
    public function getChBtnPrimaryHover(): array
    {
        return $this->ch_btn_primary_hover;
    }

    /** @param array<string, string> $ch_btn_primary_hover */
    public function setChBtnPrimaryHover(array $ch_btn_primary_hover): void
    {
        $this->ch_btn_primary_hover = $ch_btn_primary_hover;
    }

    /** @return array<string, string> */
    public function getChBtnPrimaryDisabled(): array
    {
        return $this->ch_btn_primary_disabled;
    }

    /** @param array<string, string> $ch_btn_primary_disabled */
    public function setChBtnPrimaryDisabled(array $ch_btn_primary_disabled): void
    {
        $this->ch_btn_primary_disabled = $ch_btn_primary_disabled;
    }

    /** @return array<string, string> */
    public function getChBtnInfoHover(): array
    {
        return $this->ch_btn_info_hover;
    }

    /** @param array<string, string> $ch_btn_info_hover */
    public function setChBtnInfoHover(array $ch_btn_info_hover): void
    {
        $this->ch_btn_info_hover = $ch_btn_info_hover;
    }

    /** @return array<string, string> */
    public function getChBtnInfoDisabled(): array
    {
        return $this->ch_btn_info_disabled;
    }

    /** @param array<string, string> $ch_btn_info_disabled */
    public function setChBtnInfoDisabled(array $ch_btn_info_disabled): void
    {
        $this->ch_btn_info_disabled = $ch_btn_info_disabled;
    }

    /** @return array<string, string> */
    public function getChBtnWarningHover(): array
    {
        return $this->ch_btn_warning_hover;
    }

    /** @param array<string, string> $ch_btn_warning_hover */
    public function setChBtnWarningHover(array $ch_btn_warning_hover): void
    {
        $this->ch_btn_warning_hover = $ch_btn_warning_hover;
    }

    /** @return array<string, string> */
    public function getChBtnWarningDisabled(): array
    {
        return $this->ch_btn_warning_disabled;
    }

    /** @param array<string, string> $ch_btn_warning_disabled */
    public function setChBtnWarningDisabled(array $ch_btn_warning_disabled): void
    {
        $this->ch_btn_warning_disabled = $ch_btn_warning_disabled;
    }

    /** @return array<string, string> */
    public function getChBtnSuccessHover(): array
    {
        return $this->ch_btn_success_hover;
    }

    /** @param array<string, string> $ch_btn_success_hover */
    public function setChBtnSuccessHover(array $ch_btn_success_hover): void
    {
        $this->ch_btn_success_hover = $ch_btn_success_hover;
    }

    /** @return array<string, string> */
    public function getChBtnSuccessDisabled(): array
    {
        return $this->ch_btn_success_disabled;
    }

    /** @param array<string, string> $ch_btn_success_disabled */
    public function setChBtnSuccessDisabled(array $ch_btn_success_disabled): void
    {
        $this->ch_btn_success_disabled = $ch_btn_success_disabled;
    }

    /** @return array<string, string> */
    public function getChBtnDangerHover(): array
    {
        return $this->ch_btn_danger_hover;
    }

    /** @param array<string, string> $ch_btn_danger_hover */
    public function setChBtnDangerHover(array $ch_btn_danger_hover): void
    {
        $this->ch_btn_danger_hover = $ch_btn_danger_hover;
    }

    /** @return array<string, string> */
    public function getChBtnDangerDisabled(): array
    {
        return $this->ch_btn_danger_disabled;
    }

    /** @param array<string, string> $ch_btn_danger_disabled */
    public function setChBtnDangerDisabled(array $ch_btn_danger_disabled): void
    {
        $this->ch_btn_danger_disabled = $ch_btn_danger_disabled;
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
            'ch_btn' => $this->ch_btn,
            'ch_btn_primary' => $this->ch_btn_primary,
            'ch_btn_info' => $this->ch_btn_info,
            'ch_btn_warning' => $this->ch_btn_warning,
            'ch_btn_success' => $this->ch_btn_success,
            'ch_btn_danger' => $this->ch_btn_danger,
            'ch_btn_hover' => $this->ch_btn_hover,
            'ch_btn_disabled' => $this->ch_btn_disabled,
            'ch_btn_primary_hover' => $this->ch_btn_primary_hover,
            'ch_btn_primary_disabled' => $this->ch_btn_primary_disabled,
            'ch_btn_info_hover' => $this->ch_btn_info_hover,
            'ch_btn_info_disabled' => $this->ch_btn_info_disabled,
            'ch_btn_warning_hover' => $this->ch_btn_warning_hover,
            'ch_btn_warning_disabled' => $this->ch_btn_warning_disabled,
            'ch_btn_success_hover' => $this->ch_btn_success_hover,
            'ch_btn_success_disabled' => $this->ch_btn_success_disabled,
            'ch_btn_danger_hover' => $this->ch_btn_danger_hover,
            'ch_btn_danger_disabled' => $this->ch_btn_danger_disabled,
            'ch_btn_sm' => $this->ch_btn_sm,
            'ch_btn_lg' => $this->ch_btn_lg,
            'custom_css' => $this->customCss,
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
        $dto->setChBtn(is_array($config['ch_btn'] ?? null) ? $config['ch_btn'] : []);
        $dto->setChBtnPrimary(is_array($config['ch_btn_primary'] ?? null) ? $config['ch_btn_primary'] : []);
        $dto->setChBtnInfo(is_array($config['ch_btn_info'] ?? null) ? $config['ch_btn_info'] : []);
        $dto->setChBtnWarning(is_array($config['ch_btn_warning'] ?? null) ? $config['ch_btn_warning'] : []);
        $dto->setChBtnSuccess(is_array($config['ch_btn_success'] ?? null) ? $config['ch_btn_success'] : []);
        $dto->setChBtnDanger(is_array($config['ch_btn_danger'] ?? null) ? $config['ch_btn_danger'] : []);
        $dto->setChBtnHover(is_array($config['ch_btn_hover'] ?? null) ? $config['ch_btn_hover'] : []);
        $dto->setChBtnDisabled(is_array($config['ch_btn_disabled'] ?? null) ? $config['ch_btn_disabled'] : []);
        $dto->setChBtnPrimaryHover(is_array($config['ch_btn_primary_hover'] ?? null) ? $config['ch_btn_primary_hover'] : []);
        $dto->setChBtnPrimaryDisabled(is_array($config['ch_btn_primary_disabled'] ?? null) ? $config['ch_btn_primary_disabled'] : []);
        $dto->setChBtnInfoHover(is_array($config['ch_btn_info_hover'] ?? null) ? $config['ch_btn_info_hover'] : []);
        $dto->setChBtnInfoDisabled(is_array($config['ch_btn_info_disabled'] ?? null) ? $config['ch_btn_info_disabled'] : []);
        $dto->setChBtnWarningHover(is_array($config['ch_btn_warning_hover'] ?? null) ? $config['ch_btn_warning_hover'] : []);
        $dto->setChBtnWarningDisabled(is_array($config['ch_btn_warning_disabled'] ?? null) ? $config['ch_btn_warning_disabled'] : []);
        $dto->setChBtnSuccessHover(is_array($config['ch_btn_success_hover'] ?? null) ? $config['ch_btn_success_hover'] : []);
        $dto->setChBtnSuccessDisabled(is_array($config['ch_btn_success_disabled'] ?? null) ? $config['ch_btn_success_disabled'] : []);
        $dto->setChBtnDangerHover(is_array($config['ch_btn_danger_hover'] ?? null) ? $config['ch_btn_danger_hover'] : []);
        $dto->setChBtnDangerDisabled(is_array($config['ch_btn_danger_disabled'] ?? null) ? $config['ch_btn_danger_disabled'] : []);
        $dto->setChBtnSm(is_array($config['ch_btn_sm'] ?? null) ? $config['ch_btn_sm'] : []);
        $dto->setChBtnLg(is_array($config['ch_btn_lg'] ?? null) ? $config['ch_btn_lg'] : []);
        $dto->setCustomCss((string) ($config['custom_css'] ?? ''));

        return $dto;
    }
}
