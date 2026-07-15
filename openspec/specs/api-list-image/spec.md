# api-list-image Specification

## Purpose

Fournir un sous-système backend **ApiListImage** pour les collections fixes d'images consommées par les nœuds orientés visuel (ex. `NodeSlideshow`), avec mapping image-only et endpoints dédiés sous `/api/page-builder/lists-image/*`.

## Requirements

### Requirement: Base partagée ApiListImage

Le système SHALL fournir `App\PageBuilder\ApiListImage\ApiListImage` avec :
- `getId(): string` et `getLabel(): string`
- `getCollectionMode(): string`
- `fetchItems(array $params): ApiListImagePageResult` appelant `ENDPOINT_URL` et retournant une page d'items déjà mappés
- `findItemById(string $id): ?array` parcourant la collection paginée
- un mapping privé item-par-item délégué à `mapRemoteItemToNodeList()`

Les implémentations `ApiListImage` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface`, `ApiListArticle` ni leurs interfaces associées.

#### Scenario: Appel nominal

- **WHEN** le builder demande les items d'une ApiListImage
- **THEN** le backend interroge l'endpoint distant configuré et renvoie `items`, `totalItems`, `totalPages`, `page`, `itemsPerPage`

#### Scenario: Dégradation en cas d'erreur HTTP

- **WHEN** l'appel HTTP échoue
- **THEN** `fetchItems()` retourne une page vide sans propager d'exception

### Requirement: Catalogue ApiListImage

Le système SHALL exposer `GET /api/page-builder/lists-image` listant les sources disponibles (`id`, `label`, `collectionMode`).

#### Scenario: Choix source dans un nœud image

- **WHEN** l'utilisateur configure un nœud consommant des collections image (ex. `NodeSlideshow` en mode `api-endpoint`)
- **THEN** le sélecteur est alimenté par `/api/page-builder/lists-image` et non par `/api/page-builder/cards`

### Requirement: Collection paginée ApiListImage

Le système SHALL exposer `GET /api/page-builder/lists-image/{apiId}/items` acceptant `page` et `itemsPerPage` et retournant une page d'items mappés.

#### Scenario: Pagination API Platform

- **WHEN** le frontend appelle `/api/page-builder/lists-image/{apiId}/items?page=2&itemsPerPage=20`
- **THEN** la réponse contient les items de la page 2 avec métadonnées de pagination

### Requirement: Contrat mapping image-only

Chaque item ApiListImage SHALL mapper au minimum `id` (string) et `image` (string, URL de l'image). Les champs optionnels SHALL être `link` (string) et `alt` (string). Les champs `title`, `description`, `counter`, `like` et `labels` SHALL NOT être exposés par le mapping ApiListImage.

#### Scenario: Item image complet

- **WHEN** l'API distante fournit un identifiant, une URL d'image, un lien et un texte alternatif
- **THEN** le mapping expose `id`, `image`, `link` et `alt`

#### Scenario: Item image minimal

- **WHEN** l'API distante ne fournit qu'un identifiant et une URL d'image
- **THEN** le mapping expose uniquement `id` et `image` ; `link` et `alt` sont absents ou null

#### Scenario: Absence de champs riches

- **WHEN** l'API distante fournit un titre ou une description
- **THEN** ces champs ne figurent pas dans l'item mappé ApiListImage

### Requirement: Registre ApiListImage

Le système SHALL fournir `ApiListImageRegistry` enregistrant les implémentations taguées `app.builder_api_list_image` et les exposant via le catalogue et le provider d'items.

#### Scenario: Enregistrement d'une implémentation

- **WHEN** un service PHP implémente `ApiListImage` et est tagué `app.builder_api_list_image`
- **THEN** il apparaît dans `GET /api/page-builder/lists-image` et est résolvable par `GET /api/page-builder/lists-image/{apiId}/items`

### Requirement: Résolution dynamique ApiListImage

Le système SHALL fournir `ApiListImageDynamiqueResolver` et `POST /api/page-builder/lists-image/dynamic/resolve` acceptant `{ entries: [{ id, type }, ...] }` et retournant les items image mappés dans le même ordre (items introuvables omis).

#### Scenario: Résolution multi-sources

- **WHEN** les entrées référencent des sources `type` différentes du registre ApiListImageDynamique
- **THEN** chaque item SHALL être résolu via `fetchItem()` de la source correspondante
- **AND** la réponse SHALL contenir uniquement les champs image-only (`id`, `image`, `link?`, `alt?`)
