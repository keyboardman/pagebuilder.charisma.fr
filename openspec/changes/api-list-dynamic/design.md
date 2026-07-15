## Context

`NodeListApi` charge une collection via `GET /api/page-builder/lists/{apiId}/items`. `NodeSlideshow` propose déjà un basculement `manual` / `api-endpoint` avec tri manuel. On réplique ce pattern pour les listes riches.

## Goals / Non-Goals

**Goals:**

- Mode `fixed` : comportement actuel (une `ApiListArticle`, pagination d'affichage)
- Mode `dynamic` : liste éditoriale `dynamicItems: { id, type }[]`, triable, multi-sources
- Résolution backend centralisée dans `ApiListArticleDynamique`
- Rétrocompatibilité : nœuds sans `listMode` = mode `fixed`

**Non-Goals:**

- Mode dynamique pour `NodeNavApi` (hors scope)
- Pagination interactive côté visiteur
- Synchronisation automatique si un item distant est supprimé

## Decisions

### 1. Modèle de contenu

```ts
listMode?: "fixed" | "dynamic";  // défaut "fixed"
apiId?: string;                   // mode fixed
dynamicItems?: Array<{ id: string; type: string }>;  // mode dynamic
```

`type` = `apiId` de la source (`ApiCard` ou `ApiListArticle`).

### 2. Backend `ApiListArticleDynamique`

- `ApiListArticleDynamiqueEntry` : value object `{ id, type }`
- `ApiListArticleDynamiqueResolver` : recherche chaque entrée via `ApiListArticle::findItemById()` dans `ApiListArticleRegistry`
- Endpoint `POST /api/page-builder/lists/dynamic/resolve` avec body `{ entries: [{id, type}, ...] }`

### 3. Frontend

- Settings : select mode, section dynamique avec `ListApiItemPickerModal` (catalogue `/page-builder/lists`) + thumbs drag-sort
- View : si `dynamic`, POST resolve puis `paginateItems()` comme en mode fixe
- Cache in-memory clé = hash ordonné des entrées

### 4. Sélection d'items

`ListApiItemPickerModal` sur les sources `/page-builder/lists`. Chaque ajout pousse `{ id: itemId, type: listApiId }` dans `dynamicItems`.

## Risks / Trade-offs

- **Résolution ApiListArticle** : recherche linéaire dans la collection — acceptable pour collections home
- **Items supprimés** : silencieusement omis à l'affichage
- **Perf** : N requêtes distantes pour N items ApiCard — mitigé par cache session

## Migration Plan

1. Déployer backend + frontend
2. Nœuds existants : aucun changement (`listMode` absent)
3. Rollback : retirer le mode dynamique côté UI
