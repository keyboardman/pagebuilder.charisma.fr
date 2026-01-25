<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Génère une échelle de teintes 100-900 en OKLCH à partir d'une couleur de base.
 * La couleur saisie = palier 500. Dégradé de 10 % par cran : 100–400 plus clairs, 600–900 plus foncés.
 * Plus clair : +10 % de la distance vers le blanc (L=1) à chaque cran ; plus foncé : −10 % (×0,9) par cran.
 */
final class OklchScale
{
    private const STEPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

    private const L_MAX = 0.97;
    private const L_MIN = 0.15;
    private const STEP_PCT = 0.10;

    private const DEFAULT_C = 0.2;
    private const DEFAULT_H = 250;

    /**
     * Retourne les 9 teintes en OKLCH : ['100' => 'oklch(...)', ..., '900' => 'oklch(...)'].
     * 500 = couleur de base. 100–400 : +10 % vers le blanc par cran ; 600–900 : −10 % (×0,9) par cran.
     *
     * @return array<string, string>
     */
    public function shadesFromBase(string $base): array
    {
        $parsed = $this->parseBase($base);
        $baseL = $parsed['L'];
        $C = $parsed['C'];
        $H = $parsed['H'];

        $out = [];
        foreach (self::STEPS as $step) {
            $L = $this->lightnessForStep((int) $step, $baseL);
            $out[$step] = sprintf('oklch(%.4f %.4f %.4f)', $L, $C, $H);
        }

        return $out;
    }

    /**
     * L pour un palier : 500 = baseL.
     * 100–400 : à chaque cran, +10 % de la distance restante vers L=1 (blanc).
     * 600–900 : à chaque cran, ×0,9 (−10 %).
     */
    private function lightnessForStep(int $step, float $baseL): float
    {
        if ($step === 500) {
            return $baseL;
        }
        if ($step < 500) {
            $n = (500 - $step) / 100;
            $L = $baseL;
            for ($i = 0; $i < $n; $i++) {
                $L = min(self::L_MAX, $L + self::STEP_PCT * (1 - $L));
            }
            return $L;
        }
        $n = ($step - 500) / 100;
        $L = $baseL;
        for ($i = 0; $i < $n; $i++) {
            $L = max(self::L_MIN, $L * (1 - self::STEP_PCT));
        }
        return $L;
    }

    /**
     * @return array{L: float, C: float, H: float}
     */
    private function parseBase(string $base): array
    {
        $base = trim($base);
        if ($base === '') {
            return ['L' => 0.55, 'C' => self::DEFAULT_C, 'H' => self::DEFAULT_H];
        }

        if (preg_match('/^oklch\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/', $base, $m)) {
            $L = (float) $m[1];
            if ($L > 1) {
                $L /= 100;
            }
            return ['L' => $L, 'C' => (float) $m[2], 'H' => (float) $m[3]];
        }

        $hex = $this->normalizeHex($base);
        if ($hex !== null) {
            return $this->hexToOklch($hex);
        }

        return ['L' => 0.55, 'C' => self::DEFAULT_C, 'H' => self::DEFAULT_H];
    }

    private function normalizeHex(string $s): ?string
    {
        $s = preg_replace('/^#/', '', trim($s));
        if (preg_match('/^([0-9a-fA-F]{3})$/', $s)) {
            return $s[0] . $s[0] . $s[1] . $s[1] . $s[2] . $s[2];
        }
        if (preg_match('/^[0-9a-fA-F]{6}$/', $s)) {
            return $s;
        }

        return null;
    }

    /**
     * @return array{L: float, C: float, H: float}
     */
    private function hexToOklch(string $hex): array
    {
        $r = hexdec(substr($hex, 0, 2)) / 255;
        $g = hexdec(substr($hex, 2, 2)) / 255;
        $b = hexdec(substr($hex, 4, 2)) / 255;

        $r = $r <= 0.04045 ? $r / 12.92 : (($r + 0.055) / 1.055) ** 2.4;
        $g = $g <= 0.04045 ? $g / 12.92 : (($g + 0.055) / 1.055) ** 2.4;
        $b = $b <= 0.04045 ? $b / 12.92 : (($b + 0.055) / 1.055) ** 2.4;

        $X = 0.41239079926595934 * $r + 0.357584339383878 * $g + 0.1804807884018343 * $b;
        $Y = 0.21263900587151027 * $r + 0.715168678767756 * $g + 0.07219231536073371 * $b;
        $Z = 0.01933081871559182 * $r + 0.11919477979462598 * $g + 0.9505321522496607 * $b;

        $l = 0.8189330101 * $X + 0.3618667424 * $Y - 0.1288597137 * $Z;
        $m = 0.0329845436 * $X + 0.9293118715 * $Y + 0.0361456387 * $Z;
        $n = 0.0482003018 * $X + 0.2643662691 * $Y + 0.6338517072 * $Z;

        $lp = $l > 0.0088564516790356308 ? $l ** (1 / 3) : (903.2962962962963 * $l + 16) / 116;
        $mp = $m > 0.0088564516790356308 ? $m ** (1 / 3) : (903.2962962962963 * $m + 16) / 116;
        $np = $n > 0.0088564516790356308 ? $n ** (1 / 3) : (903.2962962962963 * $n + 16) / 116;

        $L = 0.2104542553 * $lp + 0.7936177850 * $mp - 0.0040720468 * $np;
        $a = 1.9779984951 * $lp - 2.4285922050 * $mp + 0.4505937099 * $np;
        $b_ = 0.0259040371 * $lp + 0.7827717662 * $mp - 0.8086757660 * $np;

        $C = sqrt($a * $a + $b_ * $b_);
        $H = atan2($b_, $a) * 180 / M_PI;
        if ($H < 0) {
            $H += 360;
        }

        return ['L' => $L, 'C' => $C, 'H' => $H];
    }
}
