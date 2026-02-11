<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\FontVariant;
use App\Theme\ThemeSchema;

/**
 * Génère un fichier CSS à partir de la config thème (JSON) et met à jour le chemin.
 * Le fichier est versionné (hash dans le nom) pour cache-busting.
 * Inclut @import (Google), @font-face (Custom), :root, blocs body/h1..p et classes boutons (.ch_btn, variantes, hover, disabled, tailles).
 */
class ThemeCssGenerator
{
    /** Clés des variantes bouton (uniquement couleurs). */
    private const BUTTON_VARIANT_KEYS = ['ch_btn_primary', 'ch_btn_info', 'ch_btn_warning', 'ch_btn_success', 'ch_btn_danger'];

    private const WEIGHT_MAP = [
        'thin' => '100',
        'extra_light' => '200',
        'light' => '300',
        'regular' => '400',
        'medium' => '500',
        'semi_bold' => '600',
        'bold' => '700',
        'extra_bold' => '800',
        'black' => '900',
    ];

    public function __construct(
        private readonly string $projectDir,
        private readonly OklchScale $oklchScale,
    ) {
    }

    /**
     * Génère le CSS à partir du tableau de config (structure theme.yaml) et l'écrit.
     * Supprime l'ancien fichier CSS si fourni. Retourne le chemin relatif du nouveau fichier.
     *
     * @param array<string, mixed> $config
     * @param list<Font>           $fontsToImport
     */
    public function generate(array $config, string $themeDir, ?string $oldCssPath = null, array $fontsToImport = []): string
    {
        $css = $this->buildCss($config, $fontsToImport);
        $version = substr(hash('sha256', json_encode($config) . (string) microtime(true)), 0, 8);
        $filename = 'theme.' . $version . '.css';
        $fullDir = $this->projectDir . '/' . trim($themeDir, '/');
        if (!is_dir($fullDir)) {
            mkdir($fullDir, 0755, true);
        }
        $fullPath = $fullDir . '/' . $filename;
        file_put_contents($fullPath, $css);

        if ($oldCssPath !== null && $oldCssPath !== '') {
            $oldFull = $this->projectDir . '/' . ltrim($oldCssPath, '/');
            if (file_exists($oldFull) && is_file($oldFull)) {
                unlink($oldFull);
            }
        }

        return $themeDir . '/' . $filename;
    }

    /**
     * @param array<string, mixed> $config
     * @param list<Font>           $fontsToImport
     */
    public function buildCss(array $config, array $fontsToImport = []): string
    {
        $lines = [];

        foreach ($fontsToImport as $font) {
            if ($font->getType() === FontTypeEnum::Google && $font->getGoogleFontUrl() !== null && $font->getGoogleFontUrl() !== '') {
                $lines[] = "@import url('" . str_replace("'", "\\'", $font->getGoogleFontUrl()) . "');";
            } elseif ($font->getType() === FontTypeEnum::Custom) {
                foreach ($font->getVariants() as $v) {
                    foreach ($this->fontFaceLines($font->getName(), $v) as $line) {
                        $lines[] = $line;
                    }
                }
            }
        }
        if ($fontsToImport !== []) {
            $lines[] = '';
        }

        $vars = $config['vars'] ?? [];
        if (!empty($vars)) {
            $root = [];
            foreach ($vars as $key => $value) {
                if ($value !== '' && $value !== null) {
                    $root[] = '  ' . $key . ': ' . $this->formatCssValue($this->resolveColorValue($this->valueToString($value), $vars), $key) . ';';
                }
            }
            if ($root !== []) {
                $lines[] = ':root {';
                $lines[] = implode("\n", $root);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        foreach (ThemeSchema::BLOCKS as $block) {
            $data = $config[$block] ?? [];
            if (!is_array($data)) {
                continue;
            }
            $rules = [];
            foreach ($data as $prop => $value) {
                // Ne pas émettre background sur body : le builder (canvas) contrôle le fond.
                if ($block === 'body' && ($prop === 'background' || $prop === 'background-color')) {
                    continue;
                }
                if ($value !== '' && $value !== null) {
                    $rules[] = '  ' . $prop . ': ' . $this->formatCssValue($this->resolveColorValue($this->valueToString($value), $vars), $prop) . ';';
                }
            }
            if ($rules !== []) {
                $lines[] = $block . ' {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        $lines = array_merge($lines, $this->buildButtonCss($config, $vars));

        $customCss = trim((string) ($config['custom_css'] ?? ''));
        if ($customCss !== '') {
            $lines[] = '';
            $lines[] = $customCss;
        }

        return trim(implode("\n", $lines)) . "\n";
    }

    /**
     * Génère les règles CSS pour les classes boutons (.ch_btn, variantes, hover, disabled, tailles).
     *
     * @param array<string, mixed> $config
     * @param array<string, mixed> $vars
     * @return list<string>
     */
    private function buildButtonCss(array $config, array $vars = []): array
    {
        $lines = [];
        $base = $config['ch_btn'] ?? [];
        if (is_array($base) && $base !== []) {
            $rules = $this->buttonRulesFromArray($base, true, $vars);
            if ($rules !== []) {
                $lines[] = '.ch_btn {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        foreach (self::BUTTON_VARIANT_KEYS as $variant) {
            if ($variant === 'ch_btn') {
                continue;
            }
            $data = $config[$variant] ?? [];
            if (!is_array($data) || $data === []) {
                continue;
            }
            $rules = $this->buttonRulesFromArray($data, false, $vars);
            if ($rules !== []) {
                $lines[] = '.' . $variant . ' {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        $hoverDisabled = [
            'ch_btn_hover' => ['.ch_btn:hover'],
            'ch_btn_disabled' => ['.ch_btn:disabled', '.ch_btn.disabled'],
            'ch_btn_primary_hover' => ['.ch_btn_primary:hover'],
            'ch_btn_primary_disabled' => ['.ch_btn_primary:disabled', '.ch_btn_primary.disabled'],
            'ch_btn_info_hover' => ['.ch_btn_info:hover'],
            'ch_btn_info_disabled' => ['.ch_btn_info:disabled', '.ch_btn_info.disabled'],
            'ch_btn_warning_hover' => ['.ch_btn_warning:hover'],
            'ch_btn_warning_disabled' => ['.ch_btn_warning:disabled', '.ch_btn_warning.disabled'],
            'ch_btn_success_hover' => ['.ch_btn_success:hover'],
            'ch_btn_success_disabled' => ['.ch_btn_success:disabled', '.ch_btn_success.disabled'],
            'ch_btn_danger_hover' => ['.ch_btn_danger:hover'],
            'ch_btn_danger_disabled' => ['.ch_btn_danger:disabled', '.ch_btn_danger.disabled'],
        ];
        foreach ($hoverDisabled as $key => $selectors) {
            $data = $config[$key] ?? [];
            if (!is_array($data) || $data === []) {
                continue;
            }
            $rules = $this->buttonRulesFromArray($data, false, $vars);
            if ($rules !== []) {
                $lines[] = implode(', ', $selectors) . ' {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        foreach (['ch_btn_sm' => '.ch_btn_sm', 'ch_btn_lg' => '.ch_btn_lg'] as $key => $selector) {
            $data = $config[$key] ?? [];
            if (!is_array($data) || $data === []) {
                continue;
            }
            $rules = $this->buttonRulesFromArray($data, false, $vars);
            if ($rules !== []) {
                $lines[] = $selector . ' {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        return $lines;
    }

    /**
     * @param array<string, mixed> $data
     * @param array<string, mixed> $vars
     * @return list<string>
     */
    private function buttonRulesFromArray(array $data, bool $isBase, array $vars = []): array
    {
        $rules = [];
        $hasBorderWidth = false;
        foreach ($data as $prop => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            if ($prop === 'border-width') {
                $hasBorderWidth = true;
            }
            $cssProp = ($prop === 'background-color' || $prop === 'background') ? 'background' : $prop;
            $str = $this->valueToString($value);
            $resolved = $this->resolveColorValue($str, $vars);
            $rules[] = '  ' . $cssProp . ': ' . $this->formatCssValue($resolved, $prop) . ';';
        }
        if ($isBase && $hasBorderWidth) {
            $rules[] = '  border-style: solid;';
        }
        if ($isBase) {
            $rules[] = '  text-decoration: none;';
        }
        return $rules;
    }

    /**
     * Convertit une valeur (string, Font, etc.) en chaîne pour le CSS.
     * Le champ font-family peut parfois contenir un objet Font (ChoiceType).
     */
    private function valueToString(mixed $value): string
    {
        if ($value instanceof Font) {
            return $value->getName() . ', ' . $value->getFallback();
        }
        if (is_scalar($value) || (is_object($value) && method_exists($value, '__toString'))) {
            return (string) $value;
        }

        return '';
    }

    /**
     * Résout darken(color, X%) et lighten(color, X%) en couleur hex pour le CSS généré.
     * Si la couleur est var(--xxx), elle est remplacée par la valeur du thème (vars).
     * Ne convertit pas en oklch : sortie en #rrggbb.
     *
     * @param array<string, mixed> $vars Variables du thème (:root)
     */
    private function resolveColorValue(string $value, array $vars = []): string
    {
        $trimmed = trim($value);
        if (strlen($trimmed) >= 2 && $trimmed[0] === '"' && $trimmed[strlen($trimmed) - 1] === '"') {
            $trimmed = substr($trimmed, 1, -1);
        }
        if ($trimmed === '') {
            return $value;
        }

        $resolveInner = function (string $inner) use ($vars): string {
            $inner = trim($inner);
            if (preg_match('/^var\s*\(\s*(--[a-zA-Z0-9_-]+)\s*\)\s*$/s', $inner, $vm)) {
                $varName = $vm[1];
                $resolved = $vars[$varName] ?? $inner;
                return is_scalar($resolved) ? trim((string) $resolved) : $inner;
            }
            return $inner;
        };

        if (preg_match('/^darken\s*\(\s*(.+?)\s*,\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/is', $trimmed, $m)) {
            $inner = $resolveInner($m[1]);
            $amount = min(100.0, max(0.0, (float) $m[2])) / 100.0;
            $parsed = $this->oklchScale->parseToOklch($inner);
            if ($parsed !== null) {
                $newL = max(0.0, $parsed['L'] - $amount);

                return $this->oklchScale->oklchToHex($newL, $parsed['C'], $parsed['H']);
            }
        }

        if (preg_match('/^lighten\s*\(\s*(.+?)\s*,\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/is', $trimmed, $m)) {
            $inner = $resolveInner($m[1]);
            $amount = min(100.0, max(0.0, (float) $m[2])) / 100.0;
            $parsed = $this->oklchScale->parseToOklch($inner);
            if ($parsed !== null) {
                $newL = min(1.0, $parsed['L'] + $amount);

                return $this->oklchScale->oklchToHex($newL, $parsed['C'], $parsed['H']);
            }
        }

        return $value;
    }

    /**
     * Formate une valeur pour le CSS. Padding et margin sans guillemets.
     */
    private function formatCssValue(string $value, string $prop): string
    {
        $v = trim($value);
        if ($v === '') {
            return '""';
        }
        if ($prop === 'padding' || $prop === 'margin') {
            return $v;
        }
        if (str_contains($v, ' ') || str_contains($v, ',') || str_contains($v, ';')) {
            return '"' . str_replace('"', '\\22', $v) . '"';
        }
        return $v;
    }

    /**
     * @return list<string>
     */
    private function fontFaceLines(string $family, FontVariant $v): array
    {
        $path = $v->getPath();
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $format = match ($ext) {
            'woff2' => 'woff2',
            'woff' => 'woff',
            'ttf' => 'truetype',
            default => 'woff2',
        };
        $url = '/font/file/' . $path;
        $weight = self::WEIGHT_MAP[$v->getWeight()] ?? '400';
        $style = $v->getStyle();
        $quoted = (str_contains($family, ' ') || str_contains($family, "'")) ? "'" . str_replace("'", "\\'", $family) . "'" : $family;

        return [
            '@font-face {',
            '  font-family: ' . $quoted . ';',
            "  src: url('" . str_replace("'", "\\'", $url) . "') format('" . $format . "');",
            '  font-weight: ' . $weight . ';',
            '  font-style: ' . $style . ';',
            '}',
        ];
    }
}
