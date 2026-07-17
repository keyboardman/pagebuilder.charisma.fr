<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Résout une valeur dans un tableau/objet via un chemin pointé (ex. visuel.url).
 *
 * Joker de liste (pluck) : `?`, `*` ou `[]` parcourt chaque élément d’un tableau
 * et continue le chemin. Ex. `classements.?.nom` → liste des `nom`.
 * Variante collée : `classements[].nom`.
 */
final class DotPathResolver
{
    public static function get(mixed $data, string $path): mixed
    {
        $path = trim($path);
        if ($path === '') {
            return null;
        }

        $segments = self::parseSegments($path);
        if ($segments === []) {
            return null;
        }

        return self::resolve($data, $segments);
    }

    /**
     * @return list<string>
     */
    private static function parseSegments(string $path): array
    {
        $segments = [];
        foreach (explode('.', $path) as $raw) {
            if ($raw === '') {
                return [];
            }
            // "classements[]" → ["classements", "[]"]
            if ($raw !== '[]' && str_ends_with($raw, '[]')) {
                $key = substr($raw, 0, -2);
                if ($key === '') {
                    return [];
                }
                $segments[] = $key;
                $segments[] = '[]';
                continue;
            }
            $segments[] = $raw;
        }

        return $segments;
    }

    /**
     * @param list<string> $segments
     */
    private static function resolve(mixed $current, array $segments): mixed
    {
        if ($segments === []) {
            return $current;
        }

        $segment = $segments[0];
        $rest = \array_slice($segments, 1);

        if (self::isWildcard($segment)) {
            if (!\is_array($current)) {
                return null;
            }
            $out = [];
            foreach (array_values($current) as $item) {
                $value = self::resolve($item, $rest);
                if ($value === null) {
                    continue;
                }
                if (\is_array($value) && array_is_list($value)) {
                    foreach ($value as $nested) {
                        $out[] = $nested;
                    }
                } else {
                    $out[] = $value;
                }
            }

            return $out;
        }

        $next = self::readKey($current, $segment);
        if ($next === null && !self::keyExists($current, $segment)) {
            return null;
        }

        return self::resolve($next, $rest);
    }

    private static function isWildcard(string $segment): bool
    {
        return $segment === '?' || $segment === '*' || $segment === '[]';
    }

    private static function keyExists(mixed $current, string $key): bool
    {
        if (\is_array($current)) {
            return array_key_exists($key, $current);
        }
        if (\is_object($current)) {
            return isset($current->{$key}) || property_exists($current, $key);
        }

        return false;
    }

    private static function readKey(mixed $current, string $key): mixed
    {
        if (\is_array($current)) {
            return $current[$key] ?? null;
        }
        if (\is_object($current)) {
            return $current->{$key} ?? null;
        }

        return null;
    }
}
