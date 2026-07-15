<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\BuilderApiListArticleDynamicResolveResponse;
use App\PageBuilder\Api\BuilderApiResourceFactory;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueEntry;
use App\PageBuilder\ApiListArticleDynamique\ApiListArticleDynamiqueResolver;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * @implements ProcessorInterface<null, BuilderApiListArticleDynamicResolveResponse>
 */
final class BuilderApiListArticleDynamicResolveProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ApiListArticleDynamiqueResolver $resolver,
        private readonly BuilderApiResourceFactory $resourceFactory,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): BuilderApiListArticleDynamicResolveResponse
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \RuntimeException('Request missing from API Platform context.');
        }

        $payload = json_decode($request->getContent(), true);
        if (!\is_array($payload)) {
            throw new BadRequestHttpException('Invalid JSON body.');
        }

        $rawEntries = $payload['entries'] ?? null;
        if (!\is_array($rawEntries)) {
            throw new BadRequestHttpException('Missing or invalid "entries" array.');
        }

        $entries = [];
        foreach ($rawEntries as $rawEntry) {
            if (!\is_array($rawEntry)) {
                continue;
            }

            $entry = ApiListArticleDynamiqueEntry::fromArray($rawEntry);
            if ($entry !== null) {
                $entries[] = $entry;
            }
        }

        $response = new BuilderApiListArticleDynamicResolveResponse();
        foreach ($this->resolver->resolve($entries) as $itemData) {
            $response->items[] = $this->resourceFactory->createItemData($itemData);
        }

        return $response;
    }
}
