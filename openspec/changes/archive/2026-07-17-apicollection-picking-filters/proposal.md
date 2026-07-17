## Why

Lors de la migration ApiList/ApiCard → ApiCollection, le runtime configurable et le picker NodeCollection n’ont repris que la pagination : la recherche distante et le filtre par catégorie (disponibles dans `ApiManagerModal` / ApiCard) sont absents ou inopérants. Les éditeurs ne peuvent plus affiner le picking dynamique comme avant, et les définitions seedées qui mappaient `search` → `titre` / `category` → `themes` ne transmettent plus ces params.

## What Changes

- Étendre le contrat ApiCollection pour accepter et transmettre les filtres de picking : `search` et `category` (noms de query distants configurables)
- Faire appliquer ces filtres par `ConfigurableApiCollection` (définitions admin/seed) et par les adapters PHP restants (`ApiCardCollectionAdapter`, etc.)
- Exposer un endpoint catégories ApiCollection (parité avec `/cards/{apiId}/categories`) et déclarer les capacités de filtre dans le catalogue / la définition
- Restaurer dans `CollectionItemPickerModal` le filtre catégorie + une recherche réellement effective côté backend
- Mettre à jour le seed / l’admin des définitions pour renseigner `searchQueryParam`, `categoryQueryParam` et l’URL (ou le mapping) des catégories lorsque pertinent

## Capabilities

### New Capabilities

<!-- aucune — extension des capacités existantes -->

### Modified Capabilities

- `api-collection`: le contrat items / catalogue / runtime SHALL supporter les filtres de picking (`search`, `category`) et l’exposition des catégories lorsque la source le permet
- `node-collection`: le picking dynamique (article/vidéo) SHALL offrir recherche et filtre catégorie au même niveau que l’ancien ApiManagerModal, en consommant les endpoints ApiCollection

## Impact

- Backend : `ConfigurableApiCollection`, `ApiCollectionDefinition` (+ form admin), `ApiRequestParamHelper`, providers items/catalogue, adapters (`ApiCardCollectionAdapter`, list dynamique), éventuel endpoint `/collections/{apiId}/categories`
- Frontend : `CollectionItemPickerModal`, `collectionApiUtils` (query `search`/`category`, fetch catégories)
- Seed : définitions article/vidéo qui supportaient déjà search/catégorie en PHP (Flashnews, Charisma articles, vidéos si adapter)
- Specs : deltas `openspec/specs/api-collection` et `openspec/specs/node-collection`
