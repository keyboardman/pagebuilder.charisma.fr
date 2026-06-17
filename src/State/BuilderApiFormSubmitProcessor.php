<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\BuilderApiFormSubmitResponse;
use App\BuilderForm\BuilderFormSubmissionHandler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProcessorInterface<null, BuilderApiFormSubmitResponse>
 */
final class BuilderApiFormSubmitProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly BuilderFormSubmissionHandler $submissionHandler,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): BuilderApiFormSubmitResponse
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \RuntimeException('Request missing from API Platform context.');
        }

        $slug = (string) ($uriVariables['slug'] ?? '');
        $result = $this->submissionHandler->handle($slug, $request);

        if ($result['status'] === 404) {
            throw new NotFoundHttpException($result['message']);
        }

        $response = new BuilderApiFormSubmitResponse();
        $response->success = $result['success'];
        $response->message = $result['message'];

        return $response;
    }
}
