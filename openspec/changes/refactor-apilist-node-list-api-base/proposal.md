## Why

Le builder mélangeait deux usages très différents sous le même modèle `ApiCard` :

- **ApiCard** : sources pour **sélectionner un item** dans le backend (article, image, vidéo…) via la modale avec pagination/recherche (`/page-builder/cards/{id}/items?page&limit&search`).
- **ApiList** : **collections fixes** consommées telles quelles par les nœuds `NodeListApi` / `NodeNavApi`, sans ouvrir la modale backend (`/page-builder/lists/{id}/items` → uniquement `items`).

Les implémentations « home list » (témoignages, articles Flashnews, En Action, etc.) appartenaient au second cas et ne devaient pas dépendre de `AbstractApiCardList` ni des interfaces `ApiCard*`.

## What Changes

- Introduire un sous-système dédié `App\PageBuilder\ApiList` :
  - base `ApiList` avec `getId()`, `getLabel()`, `fetchItems()` et mapping privé item-par-item ;
  - registre `ApiListRegistry` tagué `app.builder_api_list` ;
  - endpoints API Platform séparés :
    - `GET /api/page-builder/lists` (catalogue)
    - `GET /api/page-builder/lists/{apiId}/items` (collection fixe, sans `total`, sans `page`/`limit`).
- Déplacer les implémentations home list dans `src/PageBuilder/ApiList/` (hors `ApiCard`).
- Adapter `NodeListApi` et `NodeNavApi` pour consommer `/page-builder/lists` directement, sans passer par `backendApiAdapter` ni la modale cards.

## Capabilities

### New Capabilities

- `node-list-api-apilist-base` : gestion séparée des collections fixes pour `NodeListApi` / `NodeNavApi`.

### Modified Capabilities

- Aucune modification du contrat `ApiCard` (article/image/vidéo/list navigable via modale).

## Impact

- Backend : `src/PageBuilder/ApiList/`, `ApiListRegistry`, providers `/page-builder/lists`.
- Frontend : `NodeListApi` et `NodeNavApi` consomment `/page-builder/lists`.
- `backendApiAdapter` et `/page-builder/cards` restent inchangés pour la sélection item-par-item.
