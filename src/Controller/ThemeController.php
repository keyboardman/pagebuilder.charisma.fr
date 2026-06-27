<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\Theme\ThemeConfigDTO;
use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use App\Helper\ThemeDTOSanitizer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/admin/theme', name: 'app_theme_')]
class ThemeController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly SluggerInterface $slugger,
    ) {
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
            $decoded = json_decode($request->request->getString('config'), true);
            $config = \is_array($decoded) ? $decoded : [];
            $dto = ThemeDTOSanitizer::sanitize(ThemeConfigDTO::fromArray($config));
            $theme = new Theme();
            $theme->setName($dto->getName() ?: 'Sans nom');
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
            'post_url' => $this->generateUrl('app_theme_new'),
            'google_font_urls' => $fonts,
            'fonts_for_js' => $fontsForJs,
        ]);
    }

    #[Route('/edit/{id}', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Theme $theme): Response
    {
       
        $fonts = $this->em->getRepository(Font::class)->findBy([], ['name' => 'ASC']);
        $configDto = $theme->getConfigDto();
        $configArray = $configDto !== null ? $configDto->toArray() : [];
        if ($request->isMethod('POST')) {
            $post = json_decode($request->request->getString('config'), true);
            $dto = ThemeDTOSanitizer::sanitize(ThemeConfigDTO::fromArray($post));
  
         
            $theme->setName($dto->getName());
            $theme->setSlug($this->slugger->slug($dto->getName())->toString());
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

    #[Route('/duplicate/{id}', name: 'duplicate', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function duplicate(Request $request, Theme $theme): Response
    {
        $token = $request->request->getString('_token');
        if (!$this->isCsrfTokenValid('duplicate' . $theme->getId(), $token)) {
            $this->addFlash('error', 'Le jeton de securite est invalide.');
            return $this->redirectToRoute('app_theme_index');
        }

        $copyName = $theme->getName() . ' (copie)';
        $copy = new Theme();
        $copy->setName($copyName);
        $copy->setSlug($this->generateUniqueCopySlug($theme));

        $sourceDto = $theme->getConfigDto();
        if ($sourceDto !== null) {
            $copyDto = ThemeConfigDTO::fromArray($sourceDto->toArray());
            $copyDto->setName($copyName);
            $copy->setConfigDto($copyDto);
        }

        $this->em->persist($copy);
        $this->em->flush();

        $this->addFlash('success', sprintf('Thème « %s » dupliqué.', $copy->getName()));

        return $this->redirectToRoute('app_theme_edit', ['id' => $copy->getId()]);
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

    private function generateUniqueCopySlug(Theme $sourceTheme): string
    {
        $baseSlug = $this->slugger->slug(($sourceTheme->getSlug() ?? $sourceTheme->getName()) . '-copie')->lower()->toString();
        $slug = $baseSlug;
        $suffix = 2;

        while ($this->em->getRepository(Theme::class)->findOneBy(['slug' => $slug]) !== null) {
            $slug = sprintf('%s-%d', $baseSlug, $suffix);
            ++$suffix;
        }

        return $slug;
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
