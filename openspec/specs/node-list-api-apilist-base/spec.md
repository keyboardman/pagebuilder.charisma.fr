# node-list-api-apilist-base Specification

## Purpose

Séparer les sources backend **ApiCard** (sélection modale paginée) et **ApiList** (collections fixes pour `NodeListApi` / `NodeNavApi`), avec une base partagée `ApiList` et un contrat de mapping unifié.

## Requirements

### Requirement: Séparation ApiCard vs ApiList

Le système SHALL distinguer deux sous-systèmes backend :

- **ApiCard** (`/api/page-builder/cards/*`) : sources pour la **sélection d'un item** dans la modale backend (articles, images, vidéos, etc.) avec pagination, recherche et `total`.
- **ApiList** (`/api/page-builder/lists/*`) : **collections fixes** consommées telles quelles par `NodeListApi` et `NodeNavApi`, sans ouvrir la modale backend.

Les implémentations `ApiList` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface` ni `ApiCardBehaviorInterface`.

#### Scenario: Sélection article via modale cards
- **WHEN** l'éditeur ouvre la modale de sélection pour un nœud card (article, image, vidéo)
- **THEN** le frontend appelle `/api/page-builder/cards/{apiId}/items` avec `page`, `limit` et éventuellement `search`

#### Scenario: Liste fixe via ApiList
- **WHEN** un nœud `NodeListApi` ou `NodeNavApi` charge sa source
- **THEN** le frontend appelle `/api/page-builder/lists/{apiId}/items` sans paramètres de pagination

### Requirement: Base partagée ApiList

Le système SHALL fournir `App\PageBuilder\ApiList\ApiList` avec :
- `getId(): string` et `getLabel(): string`
- `fetchItems(): array` appelant `ENDPOINT_URL` et retournant une liste d'items déjà mappés
- un mapping privé item-par-item délégué à `mapRemoteItemToNodeList()`

#### Scenario: Appel nominal
- **WHEN** le builder demande les items d'une ApiList
- **THEN** le backend interroge l'endpoint distant configuré et renvoie uniquement `items` (tableau JSON)

#### Scenario: Dégradation en cas d'erreur HTTP
- **WHEN** l'appel HTTP échoue
- **THEN** `fetchItems()` retourne `[]` sans propager d'exception

### Requirement: Catalogue ApiList

Le système SHALL exposer `GET /api/page-builder/lists` listant les sources disponibles (`id`, `label`, `collectionMode`).

#### Scenario: Choix source dans NodeListApi
- **WHEN** l'utilisateur ouvre les réglages d'un `NodeListApi`
- **THEN** le sélecteur est alimenté par `/api/page-builder/lists` et non par `/api/page-builder/cards`

### Requirement: Contrat mapping pour NodeListApi / NodeNavApi

Chaque item ApiList SHALL mapper au minimum `id`, `title` et `link` (pour NavApi), plus optionnellement `description`, `image`, `labels`, `counter`, `like`.

#### Scenario: Counter/like disponibles
- **WHEN** l'API distante fournit des champs de vues/likes
- **THEN** le mapping expose `counter` et `like` pour `NodeListApi`
