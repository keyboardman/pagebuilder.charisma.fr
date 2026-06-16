<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;

class PageFontResolverService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ThemeFontBuilderService $themeFontBuilderService,
    ) {
    }

    /**
     * @param string|array<string, mixed>|null $content
     * @return list<array{id: int, name: string, href: string, fontFamily: string, type: string}>
     */
    public function resolveFromContent(string|array|null $content, Theme $theme): array
    {
        if ($content === null || $content === '' || $content === []) {
            return [];
        }

        if (\is_string($content)) {
            $decoded = json_decode($content, true);
            if (!\is_array($decoded)) {
                return [];
            }
            $content = $decoded;
        }

        $families = $this->extractFontFamilies($content);
        if ($families === []) {
            return [];
        }

        $themeFontIds = array_flip($this->themeFontBuilderService->getThemeFontIds($theme));
        $themeFamilies = [];
        foreach ($this->themeFontBuilderService->build($theme) as $font) {
            $themeFamilies[$font['fontFamily']] = true;
        }

        $payloads = [];
        $seenIds = [];

        foreach (array_keys($families) as $fontFamily) {
            if (isset($themeFamilies[$fontFamily])) {
                continue;
            }

            $font = $this->findFontByPrimaryFamily($fontFamily);
            if ($font === null || $font->getType() === FontTypeEnum::Native) {
                continue;
            }

            $id = $font->getId();
            if ($id === null || isset($themeFontIds[$id]) || isset($seenIds[$id])) {
                continue;
            }

            $payload = $this->themeFontBuilderService->buildFontPayload($font);
            if ($payload === null) {
                continue;
            }

            $seenIds[$id] = true;
            $payloads[] = $payload;
        }

        return $payloads;
    }

    public function findFontByPrimaryFamily(string $fontFamily): ?Font
    {
        $primary = $this->extractPrimaryFamilyName($fontFamily);
        if ($primary === '') {
            return null;
        }

        $searchCandidates = $this->buildSearchCandidates($primary);
        foreach ($searchCandidates as $candidateName) {
            $font = $this->em->getRepository(Font::class)->findOneBy(['name' => $candidateName]);
            if ($font !== null) {
                return $font;
            }
        }

        $all = $this->em->getRepository(Font::class)->findAll();
        $searchKeys = array_fill_keys(array_map($this->buildFamilyCompareKey(...), $searchCandidates), true);
        foreach ($all as $candidate) {
            $candidatePrimary = $this->extractPrimaryFamilyName($candidate->getFontFamily());
            $candidateNames = [$candidate->getName(), $candidatePrimary];
            foreach ($candidateNames as $name) {
                foreach ($searchCandidates as $search) {
                    if (strcasecmp($name, $search) === 0) {
                        return $candidate;
                    }
                }
                if (isset($searchKeys[$this->buildFamilyCompareKey($name)])) {
                    return $candidate;
                }
            }
        }

        foreach ($all as $candidate) {
            $candidateNameKey = $this->buildFamilyCompareKey($candidate->getName());
            foreach (array_keys($searchKeys) as $searchKey) {
                if ($candidateNameKey !== '' && str_starts_with($searchKey, $candidateNameKey)) {
                    return $candidate;
                }
            }
            $candidatePrimaryKey = $this->buildFamilyCompareKey($this->extractPrimaryFamilyName($candidate->getFontFamily()));
            foreach (array_keys($searchKeys) as $searchKey) {
                if ($candidatePrimaryKey !== '' && str_starts_with($searchKey, $candidatePrimaryKey)) {
                    return $candidate;
                }
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private function buildSearchCandidates(string $primary): array
    {
        $candidates = [];
        $add = static function (string $value) use (&$candidates): void {
            $value = trim($value);
            if ($value === '') {
                return;
            }
            if (!\in_array($value, $candidates, true)) {
                $candidates[] = $value;
            }
        };

        $add($primary);
        $segments = preg_split('/\s*,\s*/u', $primary) ?: [];
        if ($segments !== []) {
            $add($segments[0] ?? '');
            if (\count($segments) > 1) {
                $add(implode(' ', $segments));
            }
        }

        return $candidates;
    }

    private function buildFamilyCompareKey(string $value): string
    {
        $normalized = str_replace(["\xc2\xa0", '&nbsp;'], ' ', $value);
        $normalized = mb_strtolower($normalized);
        $normalized = preg_replace('/[^[:alnum:]]+/u', '', $normalized) ?? '';

        return $normalized;
    }

    /**
     * Extrait la première famille CSS en respectant les quotes.
     */
    private function splitPrimaryFamily(string $fontFamily): string
    {
        $quote = null;
        $length = strlen($fontFamily);
        for ($i = 0; $i < $length; ++$i) {
            $char = $fontFamily[$i];
            if (($char === "'" || $char === '"') && ($i === 0 || $fontFamily[$i - 1] !== '\\')) {
                if ($quote === null) {
                    $quote = $char;
                } elseif ($quote === $char) {
                    $quote = null;
                }
                continue;
            }
            if ($char === ',' && $quote === null) {
                return substr($fontFamily, 0, $i);
            }
        }

        return $fontFamily;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, true>
     */
    private function extractFontFamilies(array $data): array
    {
        $families = [];
        $this->walk($data, $families);

        return $families;
    }

    /**
     * @param array<string, true> $families
     */
    private function walk(mixed $value, array &$families): void
    {
        if (!\is_array($value)) {
            return;
        }

        foreach ($value as $key => $child) {
            if ($key === 'fontFamily' && \is_string($child) && trim($child) !== '') {
                $families[trim($child)] = true;
            } else {
                $this->walk($child, $families);
            }
        }
    }

    private function extractPrimaryFamilyName(string $fontFamily): string
    {
        $normalized = str_replace(["\xc2\xa0", '&nbsp;'], ' ', $fontFamily);
        $primary = trim($this->splitPrimaryFamily($normalized));

        return trim($primary, " \t\n\r\0\x0B'\"");
    }
}
