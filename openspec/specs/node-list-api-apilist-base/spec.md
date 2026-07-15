# node-list-api-apilist-base Specification

## Purpose

Séparer les sources backend **ApiCard** (sélection modale paginée), **ApiListArticle** (collections fixes pour `NodeListApi` / `NodeNavApi`) et **ApiListImage** (collections fixes d'images pour les nœuds orientés visuel), avec des bases partagées et des contrats de mapping dédiés.

## Requirements

### Requirement: Séparation ApiCard vs ApiListArticle

Le système SHALL distinguer trois sous-systèmes backend :

- **ApiCard** (`/api/page-builder/cards/*`) : sources pour la **sélection d'un item** dans la modale backend (articles, images, vidéos, etc.) avec pagination, recherche et `total`.
- **ApiListArticle** (`/api/page-builder/lists/*`) : **collections fixes** consommées telles quelles par `NodeListApi` et `NodeNavApi`, sans ouvrir la modale backend.
- **ApiListImage** (`/api/page-builder/lists-image/*`) : **collections fixes d'images** consommées par les nœuds orientés visuel (ex. `NodeSlideshow`), sans ouvrir la modale backend et sans champs riches (`title`, `description`, etc.).

Les implémentations `ApiListArticle` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface` ni `ApiCardBehaviorInterface`.
Les implémentations `ApiListImage` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface`, `ApiListArticle` ni leurs interfaces associées.

#### Scenario: Sélection article via modale cards
- **WHEN** l'éditeur ouvre la modale de sélection pour un nœud card (article, image, vidéo)
- **THEN** le frontend appelle `/api/page-builder/cards/{apiId}/items` avec `page`, `limit` et éventuellement `search`

#### Scenario: Liste fixe via ApiListArticle
- **WHEN** un nœud `NodeListApi` ou `NodeNavApi` charge sa source
- **THEN** le frontend appelle `/api/page-builder/lists/{apiId}/items` avec `page` et `itemsPerPage`

#### Scenario: Collection image via ApiListImage
- **WHEN** un nœud image (ex. `NodeSlideshow` en mode `api-endpoint`) charge sa source
- **THEN** le frontend appelle `/api/page-builder/lists-image/{apiId}/items` avec `page` et `itemsPerPage`
- **AND** les items retournés ne contiennent que les champs image-only (`id`, `image`, `link?`, `alt?`)

### Requirement: Base partagée ApiListArticle

Le système SHALL fournir `App\PageBuilder\ApiListArticle\ApiListArticle` avec :
- `getId(): string` et `getLabel(): string`
- `fetchItems(): array` appelant `ENDPOINT_URL` et retournant une liste d'items déjà mappés
- un mapping privé item-par-item délégué à `mapRemoteItemToNodeList()`

#### Scenario: Appel nominal
- **WHEN** le builder demande les items d'une ApiListArticle
- **THEN** le backend interroge l'endpoint distant configuré et renvoie uniquement `items` (tableau JSON)

#### Scenario: Dégradation en cas d'erreur HTTP
- **WHEN** l'appel HTTP échoue
- **THEN** `fetchItems()` retourne `[]` sans propager d'exception

### Requirement: Catalogue ApiListArticle

Le système SHALL exposer `GET /api/page-builder/lists` listant les sources disponibles (`id`, `label`, `collectionMode`).

#### Scenario: Choix source dans NodeListApi
- **WHEN** l'utilisateur ouvre les réglages d'un `NodeListApi`
- **THEN** le sélecteur est alimenté par `/api/page-builder/lists` et non par `/api/page-builder/cards`

### Requirement: Contrat mapping pour NodeListApi / NodeNavApi

Chaque item ApiListArticle SHALL mapper au minimum `id`, `title` et `link` (pour NavApi), plus optionnellement `description`, `image`, `labels`, `counter`, `like`.

#### Scenario: Counter/like disponibles
- **WHEN** l'API distante fournit des champs de vues/likes
- **THEN** le mapping expose `counter` et `like` pour `NodeListApi`
