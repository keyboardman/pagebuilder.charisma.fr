<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\Page;
use App\Entity\Theme;
use App\Entity\FontType as FontTypeEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/page', name: 'app_page_')]
class PageController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly SluggerInterface $slugger,
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $pages = $this->em->getRepository(Page::class)->findBy([], ['title' => 'ASC']);
        return $this->render('page/index.html.twig', ['pages' => $pages]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('page_form', $request->request->getString('_token'))) {
                $this->addFlash('error', 'Token de sécurité invalide.');
                return $this->redirectToRoute('app_page_new');
            }
            $title = $request->request->getString('title');
            $themeId = $request->request->getInt('theme_id');
            $description = $request->request->get('description');

            if ($title === '') {
                $this->addFlash('error', 'Le titre est obligatoire.');
                return $this->redirectToRoute('app_page_new');
            }

            $slug = $this->slugger->slug($title)->lower()->toString();
            $theme = $this->em->getRepository(Theme::class)->find($themeId);
            if ($theme === null) {
                $this->addFlash('error', 'Veuillez choisir un thème.');
                return $this->redirectToRoute('app_page_new');
            }

            $page = new Page();
            $page->setTitle($title);
            $page->setSlug($slug);
            $page->setTheme($theme);
            $page->setDescription(\is_string($description) ? $description : null);
            $page->setContent(['cylsqgudkwtz' => ['id' => 'cylsqgudkwtz', 'type' => 'node-root', 'parent' => null, 'content' => ['title' => '']]]);

            $this->em->persist($page);
            try {
                $this->em->flush();
            } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException) {
                $this->addFlash('error', 'Ce slug est déjà utilisé.');
                return $this->redirectToRoute('app_page_new');
            }

            $this->addFlash('success', sprintf('Page « %s » créée.', $page->getTitle()));
            return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
        }

        $themes = $this->em->getRepository(Theme::class)->findBy([], ['name' => 'ASC']);
        $themesForJs = array_map(
            static fn (Theme $t): array => ['id' => $t->getId(), 'name' => $t->getName()],
            $themes
        );
        return $this->render('page/new.html.twig', [
            'page' => null,
            'themes' => $themes,
            'themes_for_js' => $themesForJs,
            'post_url' => $this->generateUrl('app_page_new'),
        ]);
    }

    #[Route('/edit/{id}', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Page $page): Response
    {
        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('page_form', $request->request->getString('_token'))) {
                $this->addFlash('error', 'Token de sécurité invalide.');
                return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
            }
            $title = $request->request->getString('title');
            $themeId = $request->request->getInt('theme_id');
            $description = $request->request->get('description');

            if ($title === '') {
                $this->addFlash('error', 'Le titre est obligatoire.');
                return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
            }

            $slug = $this->slugger->slug($title)->lower()->toString();
            $theme = $this->em->getRepository(Theme::class)->find($themeId);
            if ($theme === null) {
                $this->addFlash('error', 'Veuillez choisir un thème.');
                return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
            }

            $page->setTitle($title);
            $page->setSlug($slug);
            $page->setTheme($theme);
            $page->setDescription(\is_string($description) ? $description : null);

            try {
                $this->em->flush();
            } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException) {
                $this->addFlash('error', 'Ce slug est déjà utilisé.');
                return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
            }

            $this->addFlash('success', sprintf('Page « %s » mise à jour.', $page->getTitle()));
            return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
        }

        $themes = $this->em->getRepository(Theme::class)->findBy([], ['name' => 'ASC']);
        $themesForJs = array_map(
            static fn (Theme $t): array => ['id' => $t->getId(), 'name' => $t->getName()],
            $themes
        );
        return $this->render('page/edit.html.twig', [
            'page' => $page,
            'themes' => $themes,
            'themes_for_js' => $themesForJs,
            'post_url' => $this->generateUrl('app_page_edit', ['id' => $page->getId()]),
        ]);
    }

    #[Route('/{id}/builder', name: 'builder', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function builder(Page $page, Request $request): Response
    {
        $themeFonts = $this->buildThemeFontsForBuilder($page->getTheme(), $request);
        return $this->render('page/builder.html.twig', ['page' => $page, 'theme_fonts' => $themeFonts]);
    }

    /**
     * Construit la liste des polices du thème pour le builder (format attendu par registerFont).
     *
     * @return list<array{name: string, href: string, fontFamily: string}>
     */
    private function buildThemeFontsForBuilder(Theme $theme, Request $request): array
    {
        $config = $theme->getConfigDto()?->toArray() ?? [];
        $fontIds = array_map('intval', (array) ($config['fonts'] ?? []));
        $fontIds = array_values(array_filter($fontIds, fn (int $id): bool => $id > 0));
        if ($fontIds === []) {
            return [];
        }
        $fonts = $this->em->getRepository(Font::class)->findBy(['id' => $fontIds]);
        $baseUrl = $request->getSchemeAndHttpHost() . $request->getBasePath();
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
                    $href = $baseUrl . $this->generateUrl('app_font_file', ['path' => $path]);
                    $result[] = ['name' => $name, 'href' => $href, 'fontFamily' => $fontFamily];
                }
            } elseif ($font->getType() === FontTypeEnum::Native) {
                $result[] = ['name' => $name, 'href' => 'builtin:native-' . $font->getSlug(), 'fontFamily' => $fontFamily];
            }
        }
        return $result;
    }

    #[Route('/{id}/content', name: 'api_content', methods: ['PATCH', 'PUT'], requirements: ['id' => '\d+'])]
    public function apiContent(Request $request, Page $page): Response
    {
        try {
            $data = json_decode((string) $request->getContent(), true) ?: [];
            $token = $data['_token'] ?? '';
            if (!$this->isCsrfTokenValid('page_form', $token)) {
                return new Response('', 403);
            }
            $contentRaw = $data['content'] ?? null;
            if (!\is_string($contentRaw)) {
                return new Response('', 400);
            }
            if ($contentRaw !== '' && json_decode($contentRaw) === null && json_last_error() !== \JSON_ERROR_NONE) {
                return new Response('', 400);
            }
            $page->setContent(content: $contentRaw);
            $renderRaw = $data['render'] ?? null;
            if (\is_string($renderRaw) && $renderRaw !== '') {
                $page->setRender($renderRaw);
            }
            $this->em->persist($page);
            $this->em->flush();
            return new Response('', 204);
        } catch (\Throwable $e) {
            return new Response($e->getMessage(), 500, ['Content-Type' => 'text/plain']);
        }
    }

    #[Route('/preview/{id}', name: 'preview', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function preview(Page $page): Response
    {
        return $this->render('page/preview.html.twig', ['page' => $page]);
    }

    /**
     * GET contenu render par id ou slug : /page/render/1 ou /page/render/mon-slug
     */
    #[Route('/render/{idOrSlug}', name: 'render', methods: ['GET'])]
    public function renderPage(Request $request, string $idOrSlug): Response
    {
        $page = \is_numeric($idOrSlug)
            ? $this->em->getRepository(Page::class)->find((int) $idOrSlug)
            : $this->em->getRepository(Page::class)->findOneBy(['slug' => $idOrSlug]);
        return $this->renderPageContent($page, $request);
    }

    /**
     * GET contenu render par id : /page/1/render (même réponse que /page/render/1).
     */
    #[Route('/{id}/render', name: 'render_by_id', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function renderPageById(Request $request, Page $page): Response
    {
        return $this->renderPageContent($page, $request);
    }

    private function renderPageContent(?Page $page, Request $request): Response
    {
        if ($page === null) {
            throw new NotFoundHttpException('Page not found.');
        }
        $render = $page->getRender();
        if ($render === null || $render === '') {
            throw new NotFoundHttpException('No render content for this page.');
        }

        $baseUrl = rtrim($request->getSchemeAndHttpHost() . $request->getBasePath(), '/');
        $assetsHead = $this->renderView('page/_render_assets_head.html.twig');
        $assetsBody = $this->renderView('page/_render_assets_body.html.twig');
        $absoluteUrl = static fn (string $s): string => preg_replace('#(href|src)="/(?!\/)#', '$1="' . $baseUrl . '/', $s);
        $assetsHead = $absoluteUrl($assetsHead);
        $assetsBody = $absoluteUrl($assetsBody);
        $html = preg_replace('/<\/head>/', $assetsHead . '</head>', $render, 1) ?? $render;
        $html = preg_replace('/<\/body>/', $assetsBody . '</body>', $html, 1) ?? $html;

        $title = $page->getTitle();
        if ($title !== null && $title !== '') {
            $escapedTitle = htmlspecialchars($title, \ENT_QUOTES | \ENT_SUBSTITUTE | \ENT_HTML5, 'UTF-8');
            $titleReplaced = preg_replace('/<title>\s*.*?\s*<\/title>/is', '<title>' . $escapedTitle . '</title>', $html, 1);
            $html = $titleReplaced !== null ? $titleReplaced : $html;
        }

        $description = $page->getDescription();
        $escapedDescription = $description !== null && $description !== ''
            ? htmlspecialchars($description, \ENT_QUOTES | \ENT_SUBSTITUTE | \ENT_HTML5, 'UTF-8')
            : '';
        $metaDescription = '<meta name="description" content="' . $escapedDescription . '">';
        $metaCount = 0;
        $replaced = preg_replace('/<meta\s+name=["\']description["\'][^>]*>/i', $metaDescription, $html, 1, $metaCount);
        if ($metaCount === 0) {
            $html = preg_replace('/<\/head>/', $metaDescription . "\n</head>", $html, 1);
        } else {
            $html = $replaced ?? $html;
        }

        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }

    #[Route('/{id}/render', name: 'api_render', methods: ['PATCH', 'PUT'], requirements: ['id' => '\d+'])]
    public function apiRender(Request $request, Page $page): Response
    {
        try {
            $data = json_decode((string) $request->getContent(), true) ?: [];
            $token = $data['_token'] ?? '';
            if (!$this->isCsrfTokenValid('page_form', $token)) {
                return new Response('', 403);
            }
            $render = $data['render'] ?? null;
            if (!\is_string($render)) {
                return new Response('', 400);
            }
            $page->setRender($render === '' ? null : $render);
            $this->em->flush();
            return new Response('', 204);
        } catch (\Throwable $e) {
            return new Response($e->getMessage(), 500, ['Content-Type' => 'text/plain']);
        }
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Page $page): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete' . $page->getId(), $token)) {
            $this->em->remove($page);
            $this->em->flush();
            $this->addFlash('success', sprintf('Page « %s » a été supprimée.', $page->getTitle()));
        }

        return $this->redirectToRoute('app_page_index');
    }
}
