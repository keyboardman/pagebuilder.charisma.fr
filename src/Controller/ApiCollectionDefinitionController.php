<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\ApiCollectionDefinition;
use App\Form\ApiCollectionDefinitionType;
use App\PageBuilder\ApiCollection\ConfigurableApiCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/admin/api-collection', name: 'app_api_collection_')]
final class ApiCollectionDefinitionController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $items = $this->em->getRepository(ApiCollectionDefinition::class)->findBy([], ['label' => 'ASC']);

        return $this->render('api_collection/index.html.twig', [
            'definitions' => $items,
        ]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $entity = new ApiCollectionDefinition();
        $entity->setEnabled(true);
        $entity->setSupportedModes(['fixed']);
        $entity->setFieldMapping([
            'id' => 'id',
            'title' => 'title',
            'image' => 'image',
            'description' => 'description',
        ]);

        $form = $this->createForm(ApiCollectionDefinitionType::class, $entity);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($entity);
            $this->em->flush();
            $this->addFlash('success', sprintf('API « %s » créée.', $entity->getLabel()));

            return $this->redirectToRoute('app_api_collection_edit', ['id' => $entity->getId()]);
        }

        return $this->render('api_collection/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, ApiCollectionDefinition $definition): Response
    {
        $form = $this->createForm(ApiCollectionDefinitionType::class, $definition);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', sprintf('API « %s » mise à jour.', $definition->getLabel()));

            return $this->redirectToRoute('app_api_collection_edit', ['id' => $definition->getId()]);
        }

        return $this->render('api_collection/edit.html.twig', [
            'definition' => $definition,
            'form' => $form->createView(),
            'testResult' => null,
            'testError' => null,
        ]);
    }

    #[Route('/{id}/test', name: 'test', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function test(Request $request, ApiCollectionDefinition $definition): Response
    {
        $token = $request->request->getString('_token');
        if (!$this->isCsrfTokenValid('test_api_collection' . $definition->getId(), $token)) {
            $this->addFlash('error', 'Jeton CSRF invalide.');

            return $this->redirectToRoute('app_api_collection_edit', ['id' => $definition->getId()]);
        }

        $form = $this->createForm(ApiCollectionDefinitionType::class, $definition);
        $testResult = null;
        $testError = null;

        try {
            $runtime = new ConfigurableApiCollection($definition, $this->httpClient);
            $page = $runtime->fetchItems(['page' => 1, 'itemsPerPage' => 3]);
            $testResult = $page->items;
            if ($testResult === []) {
                $testError = 'Aucun item retourné (vérifiez l’URL, le memberPath et le mapping).';
            }
        } catch (\Throwable $e) {
            $testError = $e->getMessage();
        }

        return $this->render('api_collection/edit.html.twig', [
            'definition' => $definition,
            'form' => $form->createView(),
            'testResult' => $testResult,
            'testError' => $testError,
        ]);
    }

    #[Route('/{id}/delete', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, ApiCollectionDefinition $definition): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete_api_collection' . $definition->getId(), $token)) {
            $label = $definition->getLabel();
            $this->em->remove($definition);
            $this->em->flush();
            $this->addFlash('success', sprintf('API « %s » supprimée.', $label));
        }

        return $this->redirectToRoute('app_api_collection_index');
    }
}
