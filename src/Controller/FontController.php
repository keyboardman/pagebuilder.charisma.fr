<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\FontVariant;
use App\Form\FontType;
use App\Service\FontStorage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/font', name: 'app_font_')]
class FontController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly FontStorage $fontStorage,
    ) {
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $all = $this->em->getRepository(Font::class)->findAll();
        $native = $google = $custom = [];
        foreach ($all as $f) {
            match ($f->getType()) {
                FontTypeEnum::Native => $native[] = $f,
                FontTypeEnum::Google => $google[] = $f,
                FontTypeEnum::Custom => $custom[] = $f,
            };
        }
        $sortByFallbackThenName = fn (Font $a, Font $b): int => $this->getFallbackFamilyOrder($a->getFallback()) <=> $this->getFallbackFamilyOrder($b->getFallback())
            ?: strcasecmp($a->getName(), $b->getName());
        usort($native, $sortByFallbackThenName);
        usort($google, $sortByFallbackThenName);
        usort($custom, $sortByFallbackThenName);

        $googleFontUrls = $this->collectGoogleFontUrls($google);

        return $this->render('font/index.html.twig', [
            'fonts_native' => $native,
            'fonts_google' => $google,
            'fonts_custom' => $custom,
            'google_font_urls' => $googleFontUrls,
        ]);
    }

    /**
     * Ordre de tri pour la famille de fallback : 1 monospace, 2 serif, 3 sans-serif, 4 autre (cursive, etc.).
     * On détecte « sans-serif » avant « serif » pour ne pas classer « sans-serif » en serif.
     */
    private function getFallbackFamilyOrder(string $fallback): int
    {
        $f = strtolower($fallback);
        if (str_contains($f, 'monospace')) return 1;
        if (str_contains($f, 'sans-serif')) return 3;
        if (str_contains($f, 'serif')) return 2;

        return 4;
    }

    /** @param list<Font> $fonts */
    private function collectGoogleFontUrls(array $fonts): array
    {
        $urls = [];
        foreach ($fonts as $f) {
            if ($f->getGoogleFontUrl() !== null && $f->getGoogleFontUrl() !== '') {
                $urls[$f->getGoogleFontUrl()] = true;
            }
        }

        return array_keys($urls);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $font = new Font();
        $font->addVariant(new FontVariant());
        $form = $this->createForm(FontType::class, $font);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->normalizeFont($font);
            $this->processVariantFiles($form, $font);
            $this->em->persist($font);
            $this->em->flush();
            return $this->redirectToRoute('app_font_index');
        }

        return $this->render('font/form.html.twig', ['font' => $font, 'form' => $form]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Font $font): Response
    {
        $form = $this->createForm(FontType::class, $font);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->normalizeFont($font);
            $this->processVariantFiles($form, $font);
            $this->em->flush();
            return $this->redirectToRoute('app_font_index');
        }

        return $this->render('font/form.html.twig', ['font' => $font, 'form' => $form]);
    }

    #[Route('/{id}', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Font $font): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete' . $font->getId(), $token)) {
            $this->em->remove($font);
            $this->em->flush();
        }
        return $this->redirectToRoute('app_font_index');
    }

    private function normalizeFont(Font $font): void
    {
        if ($font->getType() !== FontTypeEnum::Google) {
            $font->setGoogleFontUrl(null);
        }
        if ($font->getType() !== FontTypeEnum::Custom) {
            foreach ($font->getVariants()->toArray() as $v) {
                $font->removeVariant($v);
            }
        }
    }

    private function processVariantFiles(\Symfony\Component\Form\FormInterface $form, Font $font): void
    {
        if ($font->getType() !== FontTypeEnum::Custom) {
            return;
        }
        $variantsForm = $form->get('variants');
        foreach ($variantsForm as $child) {
            $file = $child->get('file')->getData();
            if (!$file instanceof UploadedFile) {
                continue;
            }
            $variant = $child->getData();
            $path = $variant->getPath();
            if ($path === '') {
                $ext = $file->getClientOriginalExtension() ?: 'woff2';
                $base = $variant->getWeight() . '-' . $variant->getStyle() . '-' . $variant->getWidth();
                $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $base) . '.' . $ext;
                $path = $font->getSlug() . '/' . $filename;
                $variant->setPath($path);
            }
            $this->fontStorage->write($path, $file->getContent());
        }
    }
}
