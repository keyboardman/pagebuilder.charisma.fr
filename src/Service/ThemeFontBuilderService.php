<?php

namespace App\Service;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class ThemeFontBuilderService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UrlGeneratorInterface $urlGenerator
    ) {
    }

    /**
     * @return array{id: int, name: string, href: string, fontFamily: string, type: string}|null
     */
    public function buildFontPayload(Font $font): ?array
    {
        $id = $font->getId();
        if ($id === null) {
            return null;
        }

        $name = $font->getName();
        $fontFamily = $font->getFontFamily();
        $type = $font->getType()->value;

        if ($font->getType() === FontTypeEnum::Google && $font->getGoogleFontUrl() !== null && $font->getGoogleFontUrl() !== '') {
            return [
                'id' => $id,
                'name' => $name,
                'href' => $font->getGoogleFontUrl(),
                'fontFamily' => $fontFamily,
                'type' => $type,
            ];
        }

        if ($font->getType() === FontTypeEnum::Custom) {
            $variant = $font->getVariants()->first();
            if (!$variant) {
                return null;
            }
            $path = $variant->getPath();
            $href = $this->urlGenerator->generate('app_font_file', ['path' => $path], UrlGeneratorInterface::ABSOLUTE_URL);

            return [
                'id' => $id,
                'name' => $name,
                'href' => $href,
                'fontFamily' => $fontFamily,
                'type' => $type,
            ];
        }

        if ($font->getType() === FontTypeEnum::Native) {
            return [
                'id' => $id,
                'name' => $name,
                'href' => 'builtin:native-' . $font->getSlug(),
                'fontFamily' => $fontFamily,
                'type' => $type,
            ];
        }

        return null;
    }

    /**
     * @return list<array{name: string, href: string, fontFamily: string}>
     */
    public function build(Theme $theme): array
    {
        $config = $theme->getConfigDto()?->toArray() ?? [];

        $fontIds = array_map('intval', (array) ($config['fonts'] ?? []));
        $fontIds = array_values(array_filter($fontIds, fn (int $id): bool => $id > 0));
        if ($fontIds === []) {
            return [];
        }

        $fonts = $this->em->getRepository(Font::class)->findBy(['id' => $fontIds]);
        $result = [];
        foreach ($fonts as $font) {
            $payload = $this->buildFontPayload($font);
            if ($payload !== null) {
                $result[] = [
                    'name' => $payload['name'],
                    'href' => $payload['href'],
                    'fontFamily' => $payload['fontFamily'],
                ];
            }
        }

        return $result;
    }

    /**
     * @return list<int>
     */
    public function getThemeFontIds(Theme $theme): array
    {
        $config = $theme->getConfigDto()?->toArray() ?? [];
        $fontIds = array_map('intval', (array) ($config['fonts'] ?? []));
        return array_values(array_filter($fontIds, fn (int $id): bool => $id > 0));
    }
}
