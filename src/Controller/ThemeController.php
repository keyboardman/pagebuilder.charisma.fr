<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use App\DTO\Theme\ThemeConfigDTO;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/theme', name: 'app_theme_')]
class ThemeController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly SluggerInterface $slugger,
        private readonly string $projectDir,
    ) {
    }

    #[Route('/showcase', name: 'showcase', methods: ['GET'])]
    public function showcase(Request $request): Response
    {
        $themes = $this->em->getRepository(Theme::class)->findBy([], ['name' => 'ASC']);
        $themesWithCss = array_values(array_filter($themes, fn (Theme $t): bool => $t->getGeneratedCssPath() !== ''));

        $selectedId = $request->query->getInt('theme');
        $selectedTheme = null;
        foreach ($themesWithCss as $t) {
            if ($t->getId() === $selectedId) {
                $selectedTheme = $t;
                break;
            }
        }
        if ($selectedTheme === null && $themesWithCss !== []) {
            return $this->redirectToRoute('app_theme_showcase', ['theme' => $themesWithCss[0]->getId()]);
        }

        return $this->render('theme/showcase.html.twig', [
            'themes' => $themesWithCss,
            'selected_theme' => $selectedTheme,
        ]);
    }

    #[Route('/{id}/css', name: 'css', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function css(Theme $theme, Request $request): Response
    {
        $path = $theme->getGeneratedCssPath();
        if ($path === '') {
            return new Response('', Response::HTTP_NOT_FOUND);
        }
        $fullPath = $this->projectDir . '/' . ltrim(str_replace('\\', '/', $path), '/');
        $realPath = realpath($fullPath);
        if ($realPath === false || !is_file($realPath)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }
        $baseDir = realpath($this->projectDir);
        if ($baseDir === false || strpos($realPath, $baseDir) !== 0) {
            return new Response('', Response::HTTP_FORBIDDEN);
        }

        $scoped = $request->query->getBoolean('scoped');
        $content = file_get_contents($realPath);

        if ($scoped && $content !== false) {
            $content = $this->scopeThemeCss($content);
        }

        $finalContent = $content !== false ? $content : '';
        $response = new Response($finalContent);
        $response->headers->set('Content-Type', 'text/css; charset=utf-8');

        return $response;
    }

    /**
     * Scopie le CSS du thème sous .theme-preview-scope pour limiter son impact au canvas.
     */
    private function scopeThemeCss(string $css): string
    {
        $scope = '.theme-preview-scope';

        return preg_replace_callback(
            '/^(\s*)((?![@])(?:[^{])+)\s*\{/m',
            function (array $m) use ($scope): string {
                $sel = preg_replace('/\s+/', ' ', trim($m[2]));
                if ($sel === '') {
                    return $m[0];
                }
                $selectors = array_map('trim', explode(',', $sel));
                $scoped = array_map(static function (string $s) use ($scope): string {
                    return ($s === ':root' || $s === 'body') ? $scope : $scope . ' ' . $s;
                }, $selectors);
                return $m[1] . implode(', ', $scoped) . ' {';
            },
            $css
        );
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $themes = $this->em->getRepository(Theme::class)->findBy([], ['name' => 'ASC']);
        return $this->render('theme/index.html.twig', ['themes' => $themes]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function themeNew(Request $request): Response
    {
        $fonts = $this->em->getRepository(Font::class)->findBy([], ['name' => 'ASC']);

        if ($request->isMethod('POST')) {
            $config = is_array($request->request->all('config')) ? $request->request->all('config') : [];
            $dto = ThemeConfigDTO::fromArray($config);
            $theme = new Theme();
            $theme->setName($dto->getNom() ?: 'Sans nom');
            $theme->setSlug($this->slugger->slug($theme->getName())->toString());
            $theme->setConfigDto($dto);
            $this->em->persist($theme);
            $this->em->flush();
            $this->addFlash('success', sprintf(
                'Thème « %s » créé.',
                $theme->getName()
            ));

            return $this->redirectToRoute('app_theme_edit', ['id' => $theme->getId()]);
        }

        $fontsForJs = array_map(
            static fn (Font $f): array => [
                'id' => $f->getId(),
                'name' => $f->getName(),
            ],
            $fonts
        );

        return $this->render('theme/fonts.html.twig', [
            'theme' => null,
            'post_url' => $this->generateUrl('app_theme_index'),
            'google_font_urls' => $fonts,
            'fonts_for_js' => $fontsForJs,
        ]);
    }

    #[Route('/edit/{id}', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function font(Request $request, Theme $theme): Response
    {
        $fonts = $this->em->getRepository(Font::class)->findBy([], ['name' => 'ASC']);
        $configDto = $theme->getConfigDto();
        $configArray = $configDto !== null ? $configDto->toArray() : [];


        if ($request->isMethod('POST')) {
            $config = is_array($request->request->all('config')) ? $request->request->all('config') : [];
            $dto = ThemeConfigDTO::fromArray($config);

            $theme->setName($dto->getNom() ?: $theme->getName());
            $theme->setSlug($this->slugger->slug($theme->getName())->toString());
            $theme->setConfigDto($dto);

            $this->em->flush();
            $this->addFlash('success', 'Thème « ' . $theme->getName() . ' » mis à jour.');

            return $this->redirectToRoute('app_theme_edit', ['id' => $theme->getId()]);
        }

        $fontsForJs = array_map(
            static fn (Font $f): array => ['id' => $f->getId(), 'name' => $f->getName()],
            $fonts
        );
        $fontsToImport = $this->resolveFontsToImport($configArray['fonts'] ?? []);
        $googleFontUrls = $this->collectGoogleFontUrls($fontsToImport);

        return $this->render('theme/fonts.html.twig', [
            'theme' => $theme,
            'post_url' => $this->generateUrl('app_theme_edit', ['id' => $theme->getId()]),
            'google_font_urls' => $googleFontUrls,
            'fonts_for_js' => $fontsForJs,
            'theme_config_json' => $configArray,
        ]);
    }

    #[Route('/font/{id}/delete', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Theme $theme): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete' . $theme->getId(), $token)) {
            $this->em->remove($theme);
            $this->em->flush();
            $this->addFlash('success', sprintf('Thème « %s » a été supprimé.', $theme->getName()));
        }

        return $this->redirectToRoute('app_theme_index');
    }

    /**
     * @param array<int|string> $ids
     * @return list<Font>
     */
    private function resolveFontsToImport(array $ids): array
    {
        if ($ids === []) {
            return [];
        }
        $fonts = $this->em->getRepository(Font::class)->findBy(['id' => array_map('intval', $ids)]);

        return array_values(array_filter($fonts, fn (Font $f): bool => $f->getType() === FontTypeEnum::Google || $f->getType() === FontTypeEnum::Custom));
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
}
