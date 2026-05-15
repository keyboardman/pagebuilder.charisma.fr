<?php 

declare(strict_types=1);

namespace App\Helper;

use App\DTO\Theme\ThemeConfigDTO;

class ThemeDTOSanitizer
{
    private const CSS_VALUE_ALLOWED_CHARS_REGEX = '/[^\\p{L}\\p{N}\\s\\(\\)\'"«»_\\-:\\/\\.,#%]/u';

    public static function sanitize(ThemeConfigDTO $dto): ThemeConfigDTO
    {

        $dto->setVars(self::sanitizeVars($dto->getVars()));
       
        $dto->setNodeOverrides(self::sanitizeNodeOverride(
            $dto->getNodeOverrides()
        ));
        $dto->setIcons(self::sanitizeIcons($dto->getIcons()));
        $dto->setVideoPlayerIconUrl(self::sanitizeVideoPlayerIconUrl($dto->getVideoPlayerIconUrl()));

        return $dto;
    }

    private static function sanitizeVars(array $vars): array
    {
        $newVars = [];
        $compteur = 0;
        foreach ($vars as $var) {

            if(empty($var)) {
                continue;
            }


            $newVars[$compteur]= [
                'id' => $compteur,
                'name' => $var['name'],
                'value' => self::sanitizeValue($var['value'])
            ];
            $compteur++;
        }

        return $newVars;
    }

    private static function sanitizeNodeOverride(array $nodeOverrides): array
    {
        $newNodeOverrides = [];

        foreach ($nodeOverrides as $selector => $properties) {
            if($selector[0] !== '.' && $selector !== 'body') {
                continue;
            }
            if(!is_array($properties)) {
                continue;
            }
            foreach ($properties as $property => $value) {
                if(empty($value)) {
                    continue;
                }
                    $newNodeOverrides[$selector][$property] = self::sanitizeValue($value);
                }
        }

        return $newNodeOverrides;
    }

    private static function sanitizeValue(string $value): string
    {
       
        $sanitized = preg_replace(self::CSS_VALUE_ALLOWED_CHARS_REGEX, '', $value);
        
        if ($sanitized === null) {
            return '';
        }

        // Réduit les espaces successifs sans casser la lisibilité.
        return preg_replace('/\s+/u', ' ', $sanitized) ?? '';
    }

    /**
     * @param list<array{id:string, name:string, className:string, url:string}> $icons
     * @return list<array{id:string, name:string, className:string, url:string}>
     */
    private static function sanitizeIcons(array $icons): array
    {
        $out = [];
        foreach ($icons as $icon) {
            if (!is_array($icon)) {
                continue;
            }

            $className = trim((string) ($icon['className'] ?? ''));
            $url = trim((string) ($icon['url'] ?? ''));
            if ($className === '' || $url === '') {
                continue;
            }

            $out[] = [
                'id' => self::sanitizeThemeIconId($icon['id'] ?? null),
                'name' => trim((string) ($icon['name'] ?? '')),
                'className' => preg_replace('/[^a-zA-Z0-9_-]/', '', ltrim($className, '.')) ?? '',
                'url' => self::sanitizeThemeIconUrl($url),
            ];
        }

        return array_values(array_filter($out, static fn (array $icon): bool => $icon['className'] !== '' && $icon['url'] !== ''));
    }

    /**
     * URL d'icone (chemin ou absolue) : jeu de caracteres aligne sur ThemeCssGenerator::sanitizeIconUrl.
     */
    private const DEFAULT_VIDEO_PLAYER_ICON_URL = '/assets/icons/play2.svg';

    private static function sanitizeVideoPlayerIconUrl(string $url): string
    {
        $normalized = self::normalizeThemeAssetPath($url);
        if (!str_ends_with(strtolower($normalized), '.svg')) {
            return self::DEFAULT_VIDEO_PLAYER_ICON_URL;
        }

        return self::sanitizeThemeIconUrl($normalized) ?: self::DEFAULT_VIDEO_PLAYER_ICON_URL;
    }

    /**
     * Chemin web relatif depuis la racine (ex. /media/foo.svg), y compris si URL absolue même origine.
     */
    private static function normalizeThemeAssetPath(string $url): string
    {
        $trimmed = trim($url);
        if ($trimmed === '') {
            return self::DEFAULT_VIDEO_PLAYER_ICON_URL;
        }
        if (preg_match('#^https?://#i', $trimmed) === 1) {
            $path = parse_url($trimmed, PHP_URL_PATH);

            return \is_string($path) && $path !== '' ? $path : self::DEFAULT_VIDEO_PLAYER_ICON_URL;
        }

        return str_starts_with($trimmed, '/') ? $trimmed : '/' . $trimmed;
    }

    private static function sanitizeThemeIconUrl(string $url): string
    {
        $trimmed = trim($url);
        if ($trimmed === '') {
            return '';
        }
        $sanitized = preg_replace('/[^a-zA-Z0-9_\\.\\-:\\/\\?&=%#]/', '', $trimmed);

        return \is_string($sanitized) ? trim($sanitized) : '';
    }

    private static function sanitizeThemeIconId(mixed $id): string
    {
        if (\is_int($id)) {
            return (string) $id;
        }

        if (\is_string($id)) {
            $s = trim($id);
            if ($s !== '' && preg_match('/^[a-zA-Z0-9][a-zA-Z0-9._\\-]{0,127}$/', $s) === 1) {
                return $s;
            }
        }

        return self::generateThemeIconId();
    }

    private static function generateThemeIconId(): string
    {
        $data = random_bytes(16);
        $data[6] = \chr(\ord($data[6]) & 0x0f | 0x40);
        $data[8] = \chr(\ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    
}