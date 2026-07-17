<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

/**
 * Résout une valeur dans un tableau/objet via un chemin pointé (ex. visuel.url).
 */
final class DotPathResolver
{
    public static function get(mixed $data, string $path): mixed
    {
        $path = trim($path);
        if ($path === '') {
            return null;
        }

        $current = $data;
        foreach (explode('.', $path) as $segment) {
            if ($segment === '') {
                return null;
            }
            if (\is_array($current)) {
                if (!array_key_exists($segment, $current)) {
                    return null;
                }
                $current = $current[$segment];
                continue;
            }
            if (\is_object($current)) {
                if (!isset($current->{$segment})) {
                    return null;
                }
                $current = $current->{$segment};
                continue;
            }

            return null;
        }

        return $current;
    }
}
