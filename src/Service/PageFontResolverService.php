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

        $font = $this->em->getRepository(Font::class)->findOneBy(['name' => $primary]);
        if ($font !== null) {
            return $font;
        }

        $all = $this->em->getRepository(Font::class)->findAll();
        foreach ($all as $candidate) {
            if (strcasecmp($this->extractPrimaryFamilyName($candidate->getFontFamily()), $primary) === 0) {
                return $candidate;
            }
        }

        return null;
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
        $primary = trim(explode(',', $normalized)[0] ?? $normalized);

        return trim($primary, " \t\n\r\0\x0B'\"");
    }
}
