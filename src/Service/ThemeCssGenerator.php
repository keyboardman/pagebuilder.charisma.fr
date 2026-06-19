<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\FontVariant;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Génère un fichier CSS à partir de la config thème (JSON) et met à jour le chemin.
 * Le fichier est versionné (hash dans le nom) pour cache-busting.
 * Inclut @import (Google), @font-face (Custom), :root, blocs body/h1..p et classes boutons (.ch_btn, variantes, hover, disabled, tailles).
 */
class ThemeCssGenerator
{
    /**
     * Whitelist des caractères autorisés dans les valeurs CSS dynamiques.
     * On garde les formats usuels: var(--x), url("https://..."), couleurs hex, pourcentages.
     */
    private const CSS_VALUE_ALLOWED_CHARS_REGEX = '/[^\\p{L}\\p{N}\\s\\(\\)\'"«»_\\-:\\/\\.,#%]/u';

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

    /**
     * Plusieurs emplacements possibles selon l'historique du projet (assets/builder).
     *
     * @var list<string>
     */
    private const BASE_THEME_CSS_ENTRIES = [
        'assets/editeur/assets/themes/base/css/index.css'
    ];

    /** Chemin web par défaut → fichier {@see public/assets/icons/video.svg} (masque placeholder). */
    private const DEFAULT_VIDEO_MASK_ICON_WEB_PATH = '/assets/icons/video.svg';

    /** Chemin web par défaut → fichier {@see public/assets/icons/play2.svg}. */
    private const DEFAULT_VIDEO_PLAYER_ICON_WEB_PATH = '/assets/icons/play2.svg';

    private array $fonts = [];
    public function __construct(
        private readonly string $projectDir,
        private readonly OklchScale $oklchScale,
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly RequestStack $requestStack,
    ) {}

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
        
        $this->fonts = array_reduce($fontsToImport, function (array $acc, Font $font) {
            $acc[$font->getName()] = $font->getFontFamily();
            return $acc;
        }, []);

        if ($fontsToImport !== []) {
            $lines[] = '';
        }

        $lines[] = $this->buildRootCss($config);
        

        $baseCss = $this->buildBaseBuilderCss();

        if ($baseCss !== '') {
            $lines[] = $baseCss;
            $lines[] = '';
        }

        $lines = array_merge($lines, $this->buildNodeOverrideCss($config));
        $lines = array_merge($lines, $this->buildThemeIconsCss($config));

        
        $customCss = trim((string) ($config['custom_css'] ?? ''));
        if ($customCss !== '') {
            $lines[] = '';
            $lines[] = $customCss;
        }

        return trim(implode("\n", $lines)) . "\n";
    }

    private function buildRootCss(array $config): string
    {
        $lines = [':root {'];

        $normalizedVars = $this->normalizeThemeVarsConfig($config['vars'] ?? []);
        foreach ($normalizedVars['entries'] as $var) {
            $lines[] = '  ' . $var['name'] . ': ' . $this->formatCssValue(
                $this->resolveColorValue($var['value'], $normalizedVars['map']),
                $var['name']
            ) . ';';
        }

        $maskPath = str_replace("'", "\\'", $this->resolvePublicWebPath(self::DEFAULT_VIDEO_MASK_ICON_WEB_PATH));
        $lines[] = "  --ce-builder-icon-video-mask-url: url('" . $maskPath . "');";

        $playerIcon = $this->normalizeThemePublicAssetWebPath(
            trim((string) ($config['video_player_icon_url'] ?? ''))
        );
        if (!$this->themePublicAssetExists($playerIcon)) {
            $playerIcon = self::DEFAULT_VIDEO_PLAYER_ICON_WEB_PATH;
        }
        $playerPath = str_replace("'", "\\'", $this->resolvePublicWebPath($playerIcon));
        $lines[] = "  --ce-video-player-icon-url: url('" . $playerPath . "');";
        $lines[] = '}';
        $lines[] = '';

        return implode("\n", $lines);
    }

    /**
     * Accepte les vars au format associatif (--name => value) ou liste d'objets { name, value }.
     *
     * @param mixed $vars
     *
     * @return array{entries: list<array{name: string, value: string}>, map: array<string, string>}
     */
    private function normalizeThemeVarsConfig(mixed $vars): array
    {
        if (!is_array($vars)) {
            return ['entries' => [], 'map' => []];
        }

        $entries = [];
        $map = [];

        foreach ($vars as $key => $var) {
            if (is_array($var)) {
                $name = trim((string) ($var['name'] ?? ''));
                $value = $var['value'] ?? '';
            } elseif (is_string($key) && str_starts_with($key, '--')) {
                $name = $key;
                $value = $var;
            } else {
                continue;
            }

            if ($name === '' || $value === '' || $value === null) {
                continue;
            }

            $valueStr = $this->valueToString($value);
            if ($valueStr === '') {
                continue;
            }

            $entries[] = ['name' => $name, 'value' => $valueStr];
            $map[$name] = $valueStr;
        }

        return ['entries' => $entries, 'map' => $map];
    }

    /**
     * @param array<string, mixed> $config
     * @return list<string>
     */
    private function buildThemeIconsCss(array $config): array
    {
        $icons = $config['icons'] ?? [];
        if (!is_array($icons) || $icons === []) {
            return [];
        }

        $lines = ['', '/* Icones du theme (SVG: masque + currentColor; PNG/JPG et autres rasters: background-image uniquement) */'];

        foreach ($icons as $icon) {
            if (!is_array($icon)) {
                continue;
            }

            $className = trim((string) ($icon['className'] ?? ''));
            $url = trim((string) ($icon['url'] ?? ''));

            $selector = $this->normalizeIconSelector($className);
            if ($selector === '' || $url === '') {
                continue;
            }

            $safeUrl = $this->sanitizeIconUrl($url);
            if ($safeUrl === '') {
                continue;
            }

            $escapedUrl = str_replace("'", "\\'", $safeUrl);

            if ($this->isThemeIconUrlSvg($safeUrl)) {
                foreach ($this->buildThemeIconSvgCssBlock($selector, $escapedUrl) as $line) {
                    $lines[] = $line;
                }
            } else {
                foreach ($this->buildThemeIconRasterCssBlock($selector, $escapedUrl) as $line) {
                    $lines[] = $line;
                }
            }

            $lines[] = '';
        }

        return $lines;
    }

    /**
     * PNG / JPEG : une seule propriété {@see background-image} (pas de masque).
     *
     * @return list<string>
     */
    private function buildThemeIconRasterCssBlock(string $selector, string $escapedUrl): array
    {
        return [
            $selector . ' {',
            "  background-image: url('" . $escapedUrl . "');",
            '}',
        ];
    }

    /**
     * SVG : masque + {@see currentColor} pour suivre la couleur du texte héritée.
     *
     * @return list<string>
     */
    private function buildThemeIconSvgCssBlock(string $selector, string $escapedUrl): array
    {
        return [
            $selector . ' {',
            '  display: inline-block;',
            '  vertical-align: middle;',
            '  flex-shrink: 0;',
            '  box-sizing: border-box;',
            '  height: 1.5em;',
            '  width: auto;',
            '  min-width: 0.25em;',
            '  max-width: min(100%, 16rem);',
            '  padding: 0;',
            '  background-color: currentColor;',
            "  mask-image: url('" . $escapedUrl . "');",
            '  mask-repeat: no-repeat;',
            '  mask-position: center;',
            '  mask-size: auto 100%;',
            "  -webkit-mask-image: url('" . $escapedUrl . "');",
            '  -webkit-mask-repeat: no-repeat;',
            '  -webkit-mask-position: center;',
            '  -webkit-mask-size: auto 100%;',
            '}',
        ];
    }

    private function isThemeIconUrlSvg(string $safeUrl): bool
    {
        $path = parse_url($safeUrl, PHP_URL_PATH);
        if (!is_string($path) || $path === '') {
            return false;
        }

        return strcasecmp((string) pathinfo($path, PATHINFO_EXTENSION), 'svg') === 0;
    }

    private function normalizeIconSelector(string $className): string
    {
        $normalized = preg_replace('/[^a-zA-Z0-9_-]/', '', ltrim($className, '.'));
        if (!is_string($normalized) || $normalized === '') {
            return '';
        }

        return '.' . $normalized;
    }

    private function sanitizeIconUrl(string $url): string
    {
        $sanitized = preg_replace('/[^a-zA-Z0-9_\\.\\-:\\/\\?&=%#]/', '', $url);
        if ($sanitized === null) {
            return '';
        }

        return trim($sanitized);
    }

    /**
     * @param array<string, mixed> $config
     * @return list<string>
     */
    private function buildNodeOverrideCss(array $config): array
    {
        $lines = [];
        $overrides = $config['node_overrides'] ?? [];
        if (!is_array($overrides) || $overrides === []) {
            return $lines;
        }

        $declaration = [];
        foreach ($overrides as $selector => $raw) {
            if (!str_starts_with($selector, '.')) {
                continue;
            }

            if($this->declarationIsEmpty($raw)) {
                continue;
            }

            $this->buildDeclaration($declaration, $selector, $raw);   
        }
    
        $lines[] = implode("\n", $declaration);
        return $lines;
    }

    /**
     * Chemin web relatif (ex. /assets/icons/play2.svg) → fichier sous {@see public/}.
     */
    private function themePublicAssetExists(string $webPath): bool
    {
        $relative = ltrim($webPath, '/');
        if ($relative === '') {
            return false;
        }

        return is_file($this->projectDir . '/public/' . $relative);
    }

    /**
     * Normalise un chemin d’asset statique (public/ ou médiathèque /media/…).
     *
     * @return non-empty-string
     */
    private function normalizeThemePublicAssetWebPath(string $url): string
    {
        $playerIcon = $url !== '' ? $url : self::DEFAULT_VIDEO_PLAYER_ICON_WEB_PATH;
        if (preg_match('#^https?://#i', $playerIcon) === 1) {
            $path = parse_url($playerIcon, PHP_URL_PATH);
            $playerIcon = \is_string($path) && $path !== '' ? $path : self::DEFAULT_VIDEO_PLAYER_ICON_WEB_PATH;
        } elseif (!str_starts_with($playerIcon, '/')) {
            $playerIcon = '/' . $playerIcon;
        }
        if (!str_ends_with(strtolower($playerIcon), '.svg')) {
            return self::DEFAULT_VIDEO_PLAYER_ICON_WEB_PATH;
        }

        return $playerIcon;
    }

    /**
     * Préfixe le chemin web avec le basePath Symfony (sous-dossier de déploiement).
     *
     * @param non-empty-string $pathFromWebRoot chemin commençant par / (ex. /assets/icons/video.svg)
     *
     * @return non-empty-string
     */
    private function resolvePublicWebPath(string $pathFromWebRoot): string
    {
        $path = '/' . ltrim($pathFromWebRoot, '/');
        $request = $this->requestStack->getCurrentRequest();

        if ($request === null) {
            return $path;
        }

        $basePath = $request->getBasePath();
        if ($basePath === '' || $basePath === '/') {
            return $path;
        }

        return rtrim($basePath, '/') . $path;
    }

    private function buildBaseBuilderCss(): string
    {
        $chunks = [];
        foreach (self::BASE_THEME_CSS_ENTRIES as $entry) {
            $entryPath = $this->projectDir . '/' . $entry;
            ;
            if (!is_file($entryPath)) {
                continue;
            }

            $css = trim($this->readCssWithImports($entryPath, []));

            if ($css === '') {
                continue;
            }

            $chunks[] = $css;
        }

        if ($chunks === []) {
            return '';
        }


        return implode("\n\n", array_values(array_unique($chunks)));
    }

    /**
     * @param array<string, bool> $visited
     */
    private function readCssWithImports(string $filePath, array $visited): string
    {
        $realPath = realpath($filePath);
        if ($realPath === false || isset($visited[$realPath])) {
            return '';
        }
        $visited[$realPath] = true;

        $content = file_get_contents($realPath);
        if ($content === false) {
            return '';
        }

        $dir = dirname($realPath);
        $pattern = '/^\s*@import\s+["\']([^"\']+)["\']\s*;\s*$/m';
    
        return preg_replace_callback(
            $pattern,
            function (array $matches) use ($dir, $visited): string {
                $importPath = $dir . '/' . $matches[1];
                
                $importRealPath = realpath($importPath);
                
                if ($importRealPath === false) {
                    return '';
                }
                
                return $this->readCssWithImports($importRealPath, $visited);
            },
            $content
        ) ?? $content;


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
        
        $url = $this->urlGenerator->generate(
            'app_font_file',
            ['path' => $path],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
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

    private function declarationIsEmpty(mixed $properties): bool
    {
        // Si properties est vide, on retourne true
        if($properties === ''|| empty($properties)) {
            return true;
        }

        // Si properties n'est pas un array, on retourne true
        if(!is_array($properties)) {
            return true;
        }

        $arrayProperties = array_filter($properties, fn ($value) => $value !== '' && $value !== null);
        if(empty($arrayProperties)) {
            return true;
        }

        return false;
    }

    private function buildDeclaration(array& $declaration, string $selector,mixed $properties):void
    {

        $declaration[] = $selector . ' {';
        foreach ($properties as $property => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            $declaration[] = '  ' . $property . ': ' . $this->formatCssValue($value, $property) . ';';
        }
        $declaration[] = '}';
        $declaration[] = '';
    }

    private function formatCssValue(string $value, string|int $prop): string
    {
        $v = trim($this->sanitizeCssValue($value));
 
        if ($v === '') {
            return '""';
        }

        return $v;
    }

    private function sanitizeCssValue(string $value): string
    {
        $sanitized = preg_replace(self::CSS_VALUE_ALLOWED_CHARS_REGEX, '', $value);
        
        if ($sanitized === null) {
            return '';
        }

        // Réduit les espaces successifs sans casser la lisibilité.
        return preg_replace('/\s+/u', ' ', $sanitized) ?? '';
    }
}
