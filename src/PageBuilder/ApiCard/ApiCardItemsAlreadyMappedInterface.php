<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

/**
 * Marqueur : si une ApiCard implémente cette interface, alors les objets
 * retournés par `fetchCollection()` / `fetchItem()` sont supposés déjà être
 * dans le format standard du builder (id, title, description, image, labels,
 * link, counter, like, raw...).
 *
 * Dans ce cas, `ApiCardEndpointProvider` n'appellera pas `mapItem()` et
 * normalisera directement l'objet (cast vers tableau) pour exposer l'API
 * `/page-builder/cards/{apiId}/items`.
 */
interface ApiCardItemsAlreadyMappedInterface
{
}

