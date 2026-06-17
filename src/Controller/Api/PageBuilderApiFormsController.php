<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\BuilderForm\BuilderFormCatalogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/page-builder/api', name: 'app_page_builder_api_')]
final class PageBuilderApiFormsController extends AbstractController
{
    public function __construct(
        private readonly BuilderFormCatalogService $builderFormCatalog,
    ) {
    }

    #[Route('/forms/catalog', name: 'forms_catalog', methods: ['GET'])]
    public function formsCatalog(): JsonResponse
    {
        return new JsonResponse(['items' => $this->builderFormCatalog->listItems()]);
    }
}
