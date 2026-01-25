<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use App\Form\ThemeConfigType;
use App\Form\ThemeType;
use App\Service\OklchScale;
use App\Service\ThemeCssGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Yaml\Yaml;

#[Route('/theme', name: 'app_theme_')]
class ThemeController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ThemeCssGenerator $themeCssGenerator,
        private readonly OklchScale $oklchScale,
        private readonly SluggerInterface $slugger,
        private readonly string $projectDir,
    ) {
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $themes = $this->em->getRepository(Theme::class)->findBy([], ['name' => 'ASC']);
        return $this->render('theme/index.html.twig', ['themes' => $themes]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $theme = new Theme();
        $config = [];
        $fonts = $this->em->getRepository(Font::class)->findBy([], ['name' => 'ASC']);
        $googleFontUrls = $this->collectGoogleFontUrls($fonts);
        $form = $this->createFormBuilder()
            ->add('theme', ThemeType::class, ['data' => $theme])
            ->add('config', ThemeConfigType::class, ['data' => $config, 'fonts' => $fonts])
            ->getForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $theme = $form->get('theme')->getData();
            
            $config = $form->get('config')->getData() ?? [];
            $theme->setSlug($this->slugger->slug($theme->getName())->toString());
            $themeDir = 'storage/themes/' . $theme->getSlug();
            $theme->setGeneratedYamlPath($themeDir . '/theme.yaml');
            $config['nom'] = $theme->getName();
            $this->writeYaml($themeDir, $config);
            $cssPath = $this->themeCssGenerator->generate($config, $themeDir, null);
            $theme->setGeneratedCssPath($cssPath);
            $this->em->persist($theme);
            $this->em->flush();
            return $this->redirectToRoute('app_theme_index');
        }

        $vars = $config['vars'] ?? [];
        $blueScale = $this->oklchScale->shadesFromBase($vars['--color-blue'] ?? '');
        $yellowScale = $this->oklchScale->shadesFromBase($vars['--color-yellow'] ?? 'oklch(0.9 0.15 90)');
        $redScale = $this->oklchScale->shadesFromBase($vars['--color-red'] ?? 'oklch(0.55 0.2 25)');
        $greenScale = $this->oklchScale->shadesFromBase($vars['--color-green'] ?? 'oklch(0.6 0.15 140)');

        return $this->render('theme/form.html.twig', [
            'theme' => $theme,
            'form' => $form,
            'google_font_urls' => $googleFontUrls,
            'blue_scale' => $blueScale,
            'yellow_scale' => $yellowScale,
            'red_scale' => $redScale,
            'green_scale' => $greenScale,
        ]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Theme $theme): Response
    {
        $config = $this->loadConfig($theme);
        $fonts = $this->em->getRepository(Font::class)->findBy([], ['name' => 'ASC']);
        $googleFontUrls = $this->collectGoogleFontUrls($fonts);
        $form = $this->createFormBuilder()
            ->add('theme', ThemeType::class, ['data' => $theme])
            ->add('config', ThemeConfigType::class, ['data' => $config, 'fonts' => $fonts])
            ->getForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $theme = $form->get('theme')->getData();
            
            $config = $form->get('config')->getData() ?? [];
            
            $theme->setSlug($this->slugger->slug($theme->getName())->toString());
            $themeDir = 'storage/themes/' . $theme->getSlug();
            $theme->setGeneratedYamlPath($themeDir . '/theme.yaml');
            $config['nom'] = $theme->getName();
            $this->writeYaml($themeDir, $config);
            $oldCss = $theme->getGeneratedCssPath();
            $cssPath = $this->themeCssGenerator->generate($config, $themeDir, $oldCss);
            $theme->setGeneratedCssPath($cssPath);
            $this->em->flush();
            return $this->redirectToRoute('app_theme_index');
        }

        $vars = $config['vars'] ?? [];
        $blueScale = $this->oklchScale->shadesFromBase($vars['--color-blue'] ?? '');
        $yellowScale = $this->oklchScale->shadesFromBase($vars['--color-yellow'] ?? 'oklch(0.9 0.15 90)');
        $redScale = $this->oklchScale->shadesFromBase($vars['--color-red'] ?? 'oklch(0.55 0.2 25)');
        $greenScale = $this->oklchScale->shadesFromBase($vars['--color-green'] ?? 'oklch(0.6 0.15 140)');

        return $this->render('theme/form.html.twig', [
            'theme' => $theme,
            'form' => $form,
            'google_font_urls' => $googleFontUrls,
            'blue_scale' => $blueScale,
            'yellow_scale' => $yellowScale,
            'red_scale' => $redScale,
            'green_scale' => $greenScale,
        ]);
    }

    #[Route('/{id}/{filename}', name: 'css', methods: ['GET'], requirements: ['id' => '\d+', 'filename' => 'theme\.[a-zA-Z0-9]+\.css'])]
    public function css(Theme $theme, string $filename): Response
    {
        $generatedPath = $theme->getGeneratedCssPath();
        if (basename($generatedPath) !== $filename) {
            throw $this->createNotFoundException('CSS du thème introuvable.');
        }
        $path = $this->projectDir . '/' . ltrim($generatedPath, '/');
        $real = realpath($path);
        $projectReal = realpath($this->projectDir);
        if ($real === false || $projectReal === false || !is_file($real) || !str_starts_with($real, $projectReal)) {
            throw $this->createNotFoundException('CSS du thème introuvable.');
        }

        return new BinaryFileResponse($real, 200, ['Content-Type' => 'text/css']);
    }

    #[Route('/{id}', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Theme $theme): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete' . $theme->getId(), $token)) {
            $this->em->remove($theme);
            $this->em->flush();
        }
        return $this->redirectToRoute('app_theme_index');
    }

    /** @param list<Font> $fonts */
    private function collectGoogleFontUrls(array $fonts): array
    {
        $urls = [];
        foreach ($fonts as $f) {
            if ($f->getType() === FontTypeEnum::Google && $f->getGoogleFontUrl() !== null) {
                $urls[$f->getGoogleFontUrl()] = true;
            }
        }

        return array_keys($urls);
    }

    /** @return array<string, mixed> */
    private function loadConfig(Theme $theme): array
    {
        $path = $this->projectDir . '/' . $theme->getGeneratedYamlPath();
        if (!is_file($path)) {
            return [];
        }
        $parsed = Yaml::parseFile($path);
        return is_array($parsed) ? $parsed : [];
    }

    /** @param array<string, mixed> $config */
    private function writeYaml(string $themeDir, array $config): void
    {
        $fullDir = $this->projectDir . '/' . trim($themeDir, '/');
        if (!is_dir($fullDir)) {
            mkdir($fullDir, 0755, true);
        }
        $path = $fullDir . '/theme.yaml';
        $normalized = $this->normalizeConfigForYaml($config);
        file_put_contents($path, Yaml::dump($normalized, 4, 2));
    }

    /**
     * Parcourt la config et convertit les Font en chaînes "Nom, fallback" pour Yaml::dump.
     *
     * @param array<string, mixed> $config
     * @return array<string, mixed>
     */
    private function normalizeConfigForYaml(array $config): array
    {
        $out = [];
        foreach ($config as $k => $v) {
            if ($v instanceof Font) {
                $out[$k] = $v->toString();
            } elseif (is_array($v)) {
                $out[$k] = $this->normalizeConfigForYaml($v);
            } else {
                $out[$k] = $v;
            }
        }

        return $out;
    }
}
