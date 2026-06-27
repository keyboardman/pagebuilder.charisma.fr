<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Page;
use App\Entity\Theme;
use App\Form\AdminPageFormType;
use App\Service\PageFontResolverService;
use App\Service\ThemeFontBuilderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/admin/page', name: 'app_page_')]
class PageController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly SluggerInterface $slugger,
        private readonly PageFontResolverService $pageFontResolverService,
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
        $form = $this->createForm(AdminPageFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $page = $form->getData();
            $description = $page->getDescription() ?? null;
            $content = ['cylsqgudkwtz' => ['id' => 'cylsqgudkwtz', 'type' => 'node-root', 'parent' => null, 'content' => ['title' => '']]];
            $page->setDescription($description);
            $page->setContent($content);
            $this->em->persist($page);
            $this->em->flush();
            return $this->redirectToRoute('app_page_index');
        }

        return $this->render('page/new.html.twig', [
            'page' => null,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/edit/{id}', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Page $page): Response
    {
        $form = $this->createForm(AdminPageFormType::class, $page);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $page = $form->getData();

            $description = $page->getDescription() ?? null;
            $page->setDescription($description);
            $this->em->persist($page);
            $this->em->flush();
            $this->addFlash('success', sprintf('Page « %s » mise à jour.', $page->getTitle()));
            return $this->redirectToRoute('app_page_edit', ['id' => $page->getId()]);
        }

        return $this->render('page/edit.html.twig', [
            'page' => $page,
            'form' => $form->createView(),
        ]);
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

    #[Route('/duplicate/{id}', name: 'duplicate', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function duplicate(Request $request, Page $page): Response
    {
        $token = $request->request->getString('_token');
        if (!$this->isCsrfTokenValid('duplicate' . $page->getId(), $token)) {
            $this->addFlash('error', 'Le jeton de securite est invalide.');
            return $this->redirectToRoute('app_page_index');
        }

        $copy = new Page();
        $copy->setTitle($page->getTitle() . ' (copie)');
        $copy->setSlug($this->generateUniqueCopySlug($page));
        $copy->setTheme($page->getTheme());
        $copy->setDescription($page->getDescription());
        $copy->setContent($page->getContent());
        $copy->setRender($page->getRender());

        $this->em->persist($copy);
        $this->em->flush();

        $this->addFlash('success', sprintf('Page « %s » dupliquee.', $copy->getTitle()));

        return $this->redirectToRoute('app_page_edit', ['id' => $copy->getId()]);
    }

    private function generateUniqueCopySlug(Page $sourcePage): string
    {
        $baseSlug = $this->slugger->slug($sourcePage->getSlug() . '-copie')->lower()->toString();
        $slug = $baseSlug;
        $suffix = 2;

        while ($this->em->getRepository(Page::class)->findOneBy(['slug' => $slug]) !== null) {
            $slug = sprintf('%s-%d', $baseSlug, $suffix);
            ++$suffix;
        }

        return $slug;
    }

    
    #[Route('/{id}/builder', name: 'builder', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function builder(Page $page, ThemeFontBuilderService $themeFontBuilderService): Response
    {
        $themeFonts = $themeFontBuilderService->build($page->getTheme());
        $themeConfig = $page->getTheme()->getConfig() ?? [];
        $themeNodeOverrides = $themeConfig['node_overrides'] ?? [];
        $themeVars = $themeConfig['vars'] ?? [];
        $rawIcons = $themeConfig['icons'] ?? [];
        $themeIcons = [];
        if (\is_array($rawIcons)) {
            foreach ($rawIcons as $icon) {
                if (!\is_array($icon)) {
                    continue;
                }
                $themeIcons[] = [
                    'id' => (string) ($icon['id'] ?? ''),
                    'name' => (string) ($icon['name'] ?? ''),
                    'className' => (string) ($icon['className'] ?? ''),
                    'url' => (string) ($icon['url'] ?? ''),
                ];
            }
        }

        return $this->render('page/builder.html.twig', [
            'page' => $page,
            'theme_fonts' => $themeFonts,
            'theme_font_ids' => $themeFontBuilderService->getThemeFontIds($page->getTheme()),
            'theme_icons' => $themeIcons,
            'theme_node_overrides' => $themeNodeOverrides,
            'theme_vars' => $themeVars,
        ]);
    }

    #[Route('/preview/{id}', name: 'preview', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function preview(Page $page): Response
    {
        return $this->render('page/preview.html.twig', [
            'page' => $page,
            'page_fonts' => $this->pageFontResolverService->resolveFromContent($page->getContent(), $page->getTheme()),
        ]);
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

    
}
