<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Page;
use App\Service\PageFontResolverService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route(name: 'app_page_')]
final class PageRenderController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly PageFontResolverService $pageFontResolverService,
    ) {
    }

    /**
     * GET contenu render par id ou slug : /page/render/1 ou /page/render/mon-slug
     */
    #[Route('/page/render/{idOrSlug}', name: 'render', methods: ['GET'])]
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
    #[Route('/page/{id}/render', name: 'render_by_id', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function renderPageById(Request $request, Page $page): Response
    {
        return $this->renderPageContent($page, $request);
    }

    private function renderPageContent(?Page $page, Request $request): Response
    {
        if ($page === null) {
            throw new NotFoundHttpException('Page not found.');
        }

        $html = $this->renderView('page/render_view.html.twig', [
            'page' => $page,
            'page_fonts' => $this->pageFontResolverService->resolveFromContent($page->getContent(), $page->getTheme()),
        ]);
        $baseUrl = rtrim($request->getSchemeAndHttpHost() . $request->getBasePath(), '/');
        $html = preg_replace('#(href|src)="/(?!\/)#', '$1="' . $baseUrl . '/', $html) ?? $html;
        $html = preg_replace('#(data-[a-z0-9-]+)="/(?!\/)#i', '$1="' . $baseUrl . '/', $html) ?? $html;

        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }
}
