<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Font;
use App\Theme\ThemeSchema;

/**
 * Génère un fichier CSS à partir de la structure theme.yaml et met à jour le chemin.
 * Le fichier est versionné (hash dans le nom) pour cache-busting.
 */
class ThemeCssGenerator
{
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
     */
    public function generate(array $config, string $themeDir, ?string $oldCssPath = null): string
    {
        $css = $this->buildCss($config);
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
     */
    public function buildCss(array $config): string
    {
        $lines = [];

        $vars = $config['vars'] ?? [];
        if (!empty($vars)) {
            $root = [];
            foreach ($vars as $key => $value) {
                if ($value !== '' && $value !== null) {
                    $root[] = '  ' . $key . ': ' . $this->escapeCssValue($this->valueToString($value)) . ';';
                }
            }
            if ($root !== []) {
                $lines[] = ':root {';
                $lines[] = implode("\n", $root);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        $baseBlue = $vars['--color-blue'] ?? '';
        $blueShades = $this->oklchScale->shadesFromBase($baseBlue);
        foreach (['100', '200', '300', '400', '500', '600', '700', '800', '900'] as $step) {
            $value = $blueShades[$step];
            $lines[] = '.text-blue-' . $step . ' { color: ' . $value . '; }';
            $lines[] = '.bg-blue-' . $step . ' { background-color: ' . $value . '; }';
        }

        $baseYellow = $vars['--color-yellow'] ?? '';
        $yellowShades = $this->oklchScale->shadesFromBase($baseYellow);
        foreach (['100', '200', '300', '400', '500', '600', '700', '800', '900'] as $step) {
            $value = $yellowShades[$step];
            $lines[] = '.text-yellow-' . $step . ' { color: ' . $value . '; }';
            $lines[] = '.bg-yellow-' . $step . ' { background-color: ' . $value . '; }';
        }

        $baseRed = $vars['--color-red'] ?? '';
        $redShades = $this->oklchScale->shadesFromBase($baseRed);
        foreach (['100', '200', '300', '400', '500', '600', '700', '800', '900'] as $step) {
            $value = $redShades[$step];
            $lines[] = '.text-red-' . $step . ' { color: ' . $value . '; }';
            $lines[] = '.bg-red-' . $step . ' { background-color: ' . $value . '; }';
        }

        $baseGreen = $vars['--color-green'] ?? 'oklch(0.6 0.15 140)';
        $greenShades = $this->oklchScale->shadesFromBase($baseGreen);
        foreach (['100', '200', '300', '400', '500', '600', '700', '800', '900'] as $step) {
            $value = $greenShades[$step];
            $lines[] = '.text-green-' . $step . ' { color: ' . $value . '; }';
            $lines[] = '.bg-green-' . $step . ' { background-color: ' . $value . '; }';
        }
        $lines[] = '';

        foreach (ThemeSchema::BLOCKS as $block) {
            $data = $config[$block] ?? [];
            if (!is_array($data)) {
                continue;
            }
            $rules = [];
            foreach ($data as $prop => $value) {
                if ($value !== '' && $value !== null) {
                    $rules[] = '  ' . $prop . ': ' . $this->escapeCssValue($this->valueToString($value)) . ';';
                }
            }
            if ($rules !== []) {
                $lines[] = $block . ' {';
                $lines[] = implode("\n", $rules);
                $lines[] = '}';
                $lines[] = '';
            }
        }

        return trim(implode("\n", $lines)) . "\n";
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

    private function escapeCssValue(string $value): string
    {
        $v = trim($value);
        if ($v === '') {
            return '""';
        }
        if (str_contains($v, ' ') || str_contains($v, ',') || str_contains($v, ';')) {
            return '"' . str_replace('"', '\\22', $v) . '"';
        }
        return $v;
    }
}
