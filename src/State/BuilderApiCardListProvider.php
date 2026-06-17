<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\BuilderApiCard;
use App\PageBuilder\Api\ApiCardEndpointProvider;
use App\PageBuilder\Api\BuilderApiResourceFactory;

/**
 * @implements ProviderInterface<BuilderApiCard>
 */
final class BuilderApiCardListProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiCardEndpointProvider $apiCardEndpointProvider,
        private readonly BuilderApiResourceFactory $resourceFactory,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $cards = [];

        foreach ($this->apiCardEndpointProvider->listCards() as $cardData) {
            $cards[] = $this->resourceFactory->createCard($cardData);
        }

        return $cards;
    }
}
