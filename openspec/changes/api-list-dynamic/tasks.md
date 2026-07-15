## 1. Backend ApiListArticleDynamique

- [x] 1.1 Créer `ApiListArticleDynamiqueEntry` et `ApiListArticleDynamiqueResolver` dans `src/PageBuilder/ApiListArticleDynamique/`
- [x] 1.2 Ajouter endpoint `POST /api/page-builder/lists/dynamic/resolve` (resource, processor, normalizer)
- [x] 1.3 Tests unitaires du resolver

## 2. Frontend types et utils

- [x] 2.1 Étendre `NodeListApiType` avec `listMode`, `dynamicItems`
- [x] 2.2 Ajouter `fetchDynamicListItemsCached` et helpers dans `listApiUtils.ts`

## 3. UI réglages NodeListApi

- [x] 3.1 Bascule mode fixe/dynamique (pattern NodeSlideshow)
- [x] 3.2 Sélection d'items via ApiManagerModal + liste triable drag-and-drop
- [x] 3.3 Pagination d'affichage compatible mode dynamique

## 4. Rendu View

- [x] 4.1 Adapter `View.tsx` pour charger selon `listMode`
- [x] 4.2 Tests `listApiUtils` mode dynamique
