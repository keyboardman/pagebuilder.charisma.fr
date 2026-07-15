## Context

Le builder distingue déjà :
- **ApiCard** (`/api/page-builder/cards/*`) : sélection modale item-par-item (article, image, vidéo)
- **ApiListArticle** (`/api/page-builder/lists/*`) : collections fixes riches pour `NodeListApi` / `NodeNavApi`

Les nœuds orientés images (`NodeSlideshow` en mode `api-endpoint`) consomment aujourd'hui `ApiCard` via `apiRegistry` et `fetchCollection`, ce qui impose un mapping avec `title` utilisé comme `alt` de repli. `ApiListImage` formalise un troisième sous-système, calqué sur `ApiListArticle`, dédié aux collections d'images.

## Goals / Non-Goals

**Goals:**

- Module `ApiListImage` miroir de `ApiListArticle` (base, registre, pagination, `findItemById`)
- Endpoints dédiés `/api/page-builder/lists-image/*`
- Contrat image-only : `id`, `image`, `link?`, `alt?`
- `ApiListImageDynamique` pour résolution de listes ordonnées (même pattern que `ApiListArticleDynamique`)
- `NodeSlideshow` basculé vers le catalogue `lists-image`
- Première implémentation : `CharismaEvenementHomeApiListImage` (port de la collection événements home)

**Non-Goals:**

- Suppression des `ApiCard` image existants (rétrocompatibilité modale cards)
- Mode dynamique pour `NodeSlideshow` (hors scope initial)
- Nouveau nœud galerie dédié (le slideshow suffit comme premier consommateur)
- Champs riches (`title`, `description`, `counter`, `like`)

## Decisions

### 1. Namespace et structure PHP

```
src/PageBuilder/ApiListImage/
  ApiListImage.php                    # base abstraite (copie adaptée de ApiListArticle)
  ApiListImageBehaviorInterface.php
  ApiListImagePageResult.php
  ApiListImageRegistry.php
  CharismaEvenementHomeApiListImage.php  # première implémentation

src/PageBuilder/ApiListImageDynamique/
  ApiListImageDynamique.php
  ApiListImageDynamiqueEntry.php
  ApiListImageDynamiqueResolver.php
  ApiListImageDynamiqueRegistry.php
```

Tag DI : `app.builder_api_list_image` (et `app.builder_api_list_image_dynamique` si besoin).

**Alternative rejetée** : étendre `ApiListArticle` avec un `getContentType()` — mélange les contrats de mapping et complique le frontend.

### 2. Endpoints API Platform

| Endpoint | Rôle |
|---|---|
| `GET /api/page-builder/lists-image` | Catalogue (`id`, `label`, `collectionMode`) |
| `GET /api/page-builder/lists-image/{apiId}/items` | Collection paginée (`page`, `itemsPerPage`) |
| `GET /api/page-builder/lists-image/dynamic` | Catalogue sources dynamiques |
| `GET /api/page-builder/lists-image/dynamic/{apiId}/items` | Parcours collection pour picker |
| `POST /api/page-builder/lists-image/dynamic/resolve` | Résolution `{ entries: [{id, type}] }` |

Ressources : `BuilderApiListImageCatalogResponse`, `BuilderApiListImageItemsPage`, etc. — miroir des classes `BuilderApiListArticle*`.

### 3. Contrat de mapping image-only

```php
// mapRemoteItemToNodeList() retourne :
[
    'id' => string,      // obligatoire
    'image' => string,   // obligatoire (URL absolue ou relative résolue)
    'link' => ?string,   // optionnel
    'alt' => ?string,    // optionnel (texte alternatif)
]
```

Pas de `title`, `description`, `counter`, `like`, `labels`. Le DTO `BuilderApiListImageItemData` (ou réutilisation partielle) SHALL ne sérialiser que ces champs.

### 4. Frontend

- Nouveau module `listImageApiUtils.ts` (ou extension de `slideshowApi.ts`) :
  - `fetchListImageItems(apiId, params)` → `GET /api/page-builder/lists-image/{apiId}/items`
  - `mapListImageItemsToSlides(items)` → `NodeSlideshowSlide[]` (`src` ← `image`, `alt` ← `alt`)
- `NodeSlideshow/Settings.tsx` : sélecteur alimenté par `/api/page-builder/lists-image` (plus `ApiManagerModal` cards image)
- `NodeSlideshow/View.tsx` et `slideshowApi.ts` : fetch via lists-image

**Alternative rejetée** : garder `ApiManagerModal` avec filtre image — mélange cards et lists, ne reflète pas la séparation architecturale.

### 5. Première implémentation

`CharismaEvenementHomeApiListImage` :
- `getId()` : `charisma_evenement_home` (même id que l'ApiCard existante pour continuité éditoriale)
- `ENDPOINT_URL` : `https://api.charisma.fr/api/charisma/banniere/evenements/home`
- Mapping : `id`, `image` ← `source`, `link` ← `link`, pas de `alt`

L'ApiCard `CharismaEvenementHomeApiCard` reste en place pour la modale cards.

## Risks / Trade-offs

- **Duplication de code** avec `ApiListArticle` → acceptable : les contrats divergent (mapping), une abstraction commune serait prématurée
- **Id partagé** entre ApiCard et ApiListImage (`charisma_evenement_home`) → documenter ; le slideshow migrera vers lists-image, la modale cards conserve l'ApiCard
- **Nœuds existants** avec `apiId` ApiCard → migration transparente si même id ; sinon placeholder dégradé
- **ApiListImageDynamique** → implémenté en parallèle mais sans consommateur frontend immédiat (préparation NodeListApi image futur)

## Migration Plan

1. Déployer backend `ApiListImage` + endpoints
2. Déployer frontend slideshow basculé sur `lists-image`
3. Nœuds slideshow existants : `apiId` inchangé si id identique
4. Rollback : restaurer fetch via `apiRegistry` dans `slideshowApi.ts`

## Open Questions

- Faut-il un nœud `NodeListImage` dédié (grille d'images) en plus du slideshow ? → hors scope, à proposer séparément
- Migrer `CharismaEvenementRetrospectiveApiCard` vers `ApiListImage` ? → oui si collection fixe, en tâche optionnelle
