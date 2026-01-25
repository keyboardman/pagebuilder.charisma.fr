<?php

declare(strict_types=1);

namespace App\Theme;

/**
 * Schéma de référence pour theme.yaml.
 * Fournit les blocs et variables utilisés par le formulaire dynamique et ThemeCssGenerator.
 */
final class ThemeSchema
{
    public const VAR_KEYS = [
        '--color-white',
        '--color-black',
        '--color-blue',
        '--color-yellow',
        '--color-red',
        '--color-green',
        '--font-size-base',
    ];

    public const BLOCKS = ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p'];

    /**
     * Convertit un nom de variable CSS (ex. --color-white) en nom de champ de formulaire valide.
     * Les noms de champs doivent commencer par une lettre, un chiffre ou _.
     */
    public static function toFormName(string $canonical): string
    {
        $s = str_starts_with($canonical, '--') ? substr($canonical, 2) : $canonical;

        return str_replace('-', '_', $s);
    }

    /**
     * Convertit un nom de champ formulaire (ex. color_white) en nom de variable CSS.
     */
    public static function toCanonicalName(string $formName): string
    {
        return '--' . str_replace('_', '-', $formName);
    }

    /** Sous-clés possibles par bloc (body a les champs étendus) */
    public const BLOCK_KEYS = [
        'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
        'background-color', 'padding', 'margin',
    ];

    /** Blocs qui incluent background-color, padding, margin (ex. body) */
    public const BLOCKS_EXTENDED = ['body'];

    /** Options pour le sélecteur font-weight (valeur CSS => libellé) */
    public const FONT_WEIGHT_CHOICES = [
        '100' => '100 (Thin)',
        '200' => '200 (Extra Light)',
        '300' => '300 (Light)',
        '400' => '400 (Regular / Normal)',
        '500' => '500 (Medium)',
        '600' => '600 (Semi Bold)',
        '700' => '700 (Bold)',
        '800' => '800 (Extra Bold)',
        '900' => '900 (Black)',
    ];

    /** Options pour le sélecteur font-style (valeur CSS => libellé) */
    public const FONT_STYLE_CHOICES = [
        'normal' => 'Normal',
        'italic' => 'Italic',
        'oblique' => 'Oblique',
    ];

    public static function getBlockKeys(string $block): array
    {
        $base = ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height'];
        if (in_array($block, self::BLOCKS_EXTENDED, true)) {
            return [...$base, 'background-color', 'padding', 'margin'];
        }
        if (in_array($block, ['div', 'p'], true)) {
            return [...$base, 'padding', 'margin'];
        }
        return $base;
    }
}
