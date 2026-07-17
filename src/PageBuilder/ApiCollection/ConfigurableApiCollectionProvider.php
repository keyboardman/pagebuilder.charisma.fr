<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\Repository\ApiCollectionDefinitionRepository;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Fournit les ApiCollection issues des définitions admin enabled.
 *
 * @implements \IteratorAggregate<int, ApiCollectionInterface>
 */
final class ConfigurableApiCollectionProvider implements \IteratorAggregate
{
    public function __construct(
        private readonly ApiCollectionDefinitionRepository $repository,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    /**
     * @return \Traversable<int, ApiCollectionInterface>
     */
    public function getIterator(): \Traversable
    {
        try {
            $definitions = $this->repository->findAllEnabled();
        } catch (\Throwable) {
            return;
        }

        foreach ($definitions as $definition) {
            yield new ConfigurableApiCollection($definition, $this->httpClient);
        }
    }
}
