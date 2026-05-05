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
    ) {}

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
            $name = $font->getName();
            $fontFamily = $name . ', ' . ($font->getFallback() ?: 'sans-serif');
            if ($font->getType() === FontTypeEnum::Google && $font->getGoogleFontUrl() !== null && $font->getGoogleFontUrl() !== '') {
                $result[] = ['name' => $name, 'href' => $font->getGoogleFontUrl(), 'fontFamily' => $fontFamily];
            } elseif ($font->getType() === FontTypeEnum::Custom) {
                $variant = $font->getVariants()->first();
                if ($variant) {
                    $path = $variant->getPath();
                    $href = $this->urlGenerator->generate('app_font_file', ['path' => $path], UrlGeneratorInterface::ABSOLUTE_URL);
                    $result[] = ['name' => $name, 'href' => $href, 'fontFamily' => $fontFamily];
                }
            } elseif ($font->getType() === FontTypeEnum::Native) {
                $result[] = ['name' => $name, 'href' => 'builtin:native-' . $font->getSlug(), 'fontFamily' => $fontFamily];
            }
        }
        return $result;
    }
}
