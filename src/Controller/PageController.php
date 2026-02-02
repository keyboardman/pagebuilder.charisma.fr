<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Page;
use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
    public function builder(Page $page): Response
    {
        return $this->render('page/builder.html.twig', ['page' => $page]);
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
            $page->setContent($contentRaw);
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
