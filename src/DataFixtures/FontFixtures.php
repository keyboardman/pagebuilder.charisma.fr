<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Font;
use App\Entity\FontType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class FontFixtures extends Fixture
{
    /** Polices natives (web safe, disponibles dans tous les navigateurs) */
    private const NATIVE_FONTS = [
        ['name' => 'Arial', 'slug' => 'arial', 'fallback' => 'Helvetica, sans-serif'],
        ['name' => 'Helvetica', 'slug' => 'helvetica', 'fallback' => 'Arial, sans-serif'],
        ['name' => 'Times New Roman', 'slug' => 'times-new-roman', 'fallback' => 'Times, serif'],
        ['name' => 'Georgia', 'slug' => 'georgia', 'fallback' => 'serif'],
        ['name' => 'Verdana', 'slug' => 'verdana', 'fallback' => 'sans-serif'],
        ['name' => 'Tahoma', 'slug' => 'tahoma', 'fallback' => 'sans-serif'],
        ['name' => 'Trebuchet MS', 'slug' => 'trebuchet-ms', 'fallback' => 'sans-serif'],
        ['name' => 'Courier New', 'slug' => 'courier-new', 'fallback' => 'Courier, monospace'],
        ['name' => 'Lucida Console', 'slug' => 'lucida-console', 'fallback' => 'monospace'],
        ['name' => 'Lucida Sans Unicode', 'slug' => 'lucida-sans-unicode', 'fallback' => 'sans-serif'],
        ['name' => 'Palatino Linotype', 'slug' => 'palatino-linotype', 'fallback' => 'serif'],
        ['name' => 'Comic Sans MS', 'slug' => 'comic-sans-ms', 'fallback' => 'cursive'],
        ['name' => 'Impact', 'slug' => 'impact', 'fallback' => 'sans-serif'],
    ];

    /** Polices Google populaires : [nom, slug, paramètres wght pour l’URL css2] */
    private const GOOGLE_FONTS = [
        ['Roboto', 'roboto', '300;400;500;700'],
        ['Open Sans', 'open-sans', '300;400;600;700'],
        ['Lato', 'lato', '300;400;700'],
        ['Montserrat', 'montserrat', '300;400;500;600;700'],
        ['Oswald', 'oswald', '300;400;500;600;700'],
        ['Source Sans 3', 'source-sans-3', '300;400;600;700'],
        ['Poppins', 'poppins', '300;400;500;600;700'],
        ['Raleway', 'raleway', '300;400;500;600;700'],
        ['Inter', 'inter', '300;400;500;600;700'],
        ['Playfair Display', 'playfair-display', '400;500;600;700'],
        ['Merriweather', 'merriweather', '300;400;700'],
        ['PT Sans', 'pt-sans', '400;700'],
        ['Nunito', 'nunito', '300;400;600;700'],
        ['Ubuntu', 'ubuntu', '300;400;500;700'],
        ['Rubik', 'rubik', '300;400;500;600;700'],
        ['Bebas Neue', 'bebas-neue', '400'],
        ['Work Sans', 'work-sans', '300;400;500;600;700'],
        ['DM Sans', 'dm-sans', '400;500;700'],
        ['Outfit', 'outfit', '300;400;500;600;700'],
        ['Quicksand', 'quicksand', '300;400;500;600;700'],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::NATIVE_FONTS as $row) {
            $font = (new Font())
                ->setName($row['name'])
                ->setType(FontType::Native)
                ->setSlug($row['slug'])
                ->setFallback($row['fallback'])
                ->setGoogleFontUrl(null);
            $manager->persist($font);
        }

        foreach (self::GOOGLE_FONTS as [$name, $slug, $wght]) {
            $family = str_replace(' ', '+', $name);
            $url = sprintf(
                'https://fonts.googleapis.com/css2?family=%s:wght@%s&display=swap',
                $family,
                $wght
            );
            $font = (new Font())
                ->setName($name)
                ->setType(FontType::Google)
                ->setSlug($slug)
                ->setFallback('sans-serif')
                ->setGoogleFontUrl($url);
            $manager->persist($font);
        }

        $manager->flush();
    }
}
