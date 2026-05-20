<?php

declare(strict_types=1);

namespace App\Controller;

use App\BuilderForm\BuilderFormSubmissionHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class BuilderFormSubmitController extends AbstractController
{
    public function __construct(
        private readonly BuilderFormSubmissionHandler $submissionHandler,
    ) {
    }

    #[Route('/submit/form/{slug}', name: 'app_builder_form_submit', methods: ['POST'], requirements: ['slug' => '[a-z0-9][a-z0-9_-]*'])]
    public function submit(string $slug, Request $request): JsonResponse
    {
        $result = $this->submissionHandler->handle($slug, $request);

        return new JsonResponse(
            [
                'success' => $result['success'],
                'message' => $result['message'],
            ],
            $result['status'] === 404 ? Response::HTTP_NOT_FOUND : Response::HTTP_OK
        );
    }
}
