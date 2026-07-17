## Context

Le builder expose aujourd'hui des nœuds spécialisés par cas d'usage :

| Nœud existant | Rôle | Mode fixe | Mode dynamique | Disposition |
|---|---|---|---|---|
| **NodeListApi** | articles | `ApiListArticle` + pagination locale | `ApiListArticleDynamique` via ApiManager | liste |
| **NodeListImage** | images | `ApiListImage` + pagination | file manager multi-sélection | liste |
| **NodeSlideshow** | images | `ApiListImage` (api-endpoint) | slides manuelles (file manager) | carrousel |
| **NodeCardApi** | item unique | — | ApiManager item | card |

Chaque nœud duplique la logique de chargement, d'états (loading/error/empty), de pagination et de style. **NodeCollection** unifie ces comportements derrière quatre axes de configuration : `type`, `mode`, `display`, `view`.

Les sous-systèmes backend (`ApiListImage`, `ApiListArticle`, `ApiListArticleDynamique`, `ApiCard` video) et les utilitaires frontend (`listApiUtils`, `listImageApiUtils`, `NodeSlideshow/View`, `shared/card/`) restent la source de vérité pour le chargement et le rendu unitaire.

## Goals / Non-Goals

**Goals:**

- Introduire **NodeCollection** (`node-collection`) comme nœud unique configurable.
- Supporter `type` : `image` | `video` | `article`.
- Supporter `mode` :
  - `fixed` — endpoint paginé (`page`, `itemsPerPage` / `limit`) ;
  - `dynamic` — sélection éditoriale : file manager (`image`), ApiManager (`video`, `article`).
- Supporter `display` : `list` | `grid` | `slideshow`.
- Supporter `view` : `card` (rendu NodeCardApi) | `default` (rendu liste simple type NodeListApi / NodeListImage).
- Réutiliser au maximum les modules existants ; factoriser la logique commune dans `collectionUtils.ts`.
- Exposer hooks CSS `ce-collection`, `ce-collection-item`, `ce-collection-grid`, `ce-collection-slideshow`, etc.

**Non-Goals:**

- Déprécier ou supprimer NodeListApi, NodeListImage, NodeSlideshow, NodeCardApi dans cette itération.
- Créer un nouveau sous-système backend `ApiListVideo` (le type `video` en mode fixe s'appuie sur les ApiCard video existantes via `fetchCollection`).
- Pagination serveur interactive avancée (recherche, filtres) au-delà de `page` + `limit`.
- Réordonnancement drag-and-drop des items en mode dynamique (ordre = ordre de sélection persisté).

## Decisions

### 1. Schéma de contenu unifié

```typescript
content: {
  collectionType: "image" | "video" | "article";
  mode: "fixed" | "dynamic";
  display: "list" | "grid" | "slideshow";
  view: "card" | "default";

  // Mode fixe
  apiId?: string;
  page?: number;           // défaut 1
  itemsPerPage?: number;   // défaut 10

  // Mode dynamique
  dynamicItems?: CollectionDynamicEntry[];  // structure selon type

  // Visibilité (article/video en view default ou card)
  show?: { image?, title?, description?, counter?, like?, labels? };

  // Styles par sous-partie (aligné NodeListApi / NodeCardApi)
  collection, item, image, title, description, counter, like, labels

  // Display grid
  grid?: { columns?: { desktop, tablet, mobile }, gap?: number };

  // Display slideshow (reprise NodeSlideshow)
  slideshow?: {
    navigationEnabled, paginationEnabled, speedMs,
    autoplayEnabled, autoplayDelayMs,
    slidesPerViewByBreakpoint, aspectRatio, effect,
    imageBorderRadius, gap
  };
}
```

**Alternative rejetée** : sous-nœuds enfants droppables — rejeté car les items proviennent toujours d'une source externe (API ou sélection), comme NodeListApi.

### 2. Résolution des données par type × mode

| type | mode fixed | mode dynamic |
|---|---|---|
| `image` | `GET /api/page-builder/lists-image/{apiId}/items?page=&limit=` | `dynamicItems[]` avec entrées file manager (`src`, `alt`, `link`) |
| `article` | `GET /api/page-builder/lists/{apiId}/items?page=&limit=` | `dynamicItems[]` avec `{ id, type }` résolus via `ApiListArticleDynamique` |
| `video` | `fetchCollection` sur ApiCard `type=video` sélectionnée (`apiId`) avec `page`/`limit` | `dynamicItems[]` avec `{ apiId, itemId }` résolus via ApiManager |

En mode **fixed**, la pagination est transmise à l'endpoint lorsque celui-ci la supporte (`ApiListImage`, `ApiListArticle`) ; sinon découpage local (fallback ApiCard video).

En mode **dynamic**, `page`/`itemsPerPage` s'appliquent localement sur la liste persistée (même stratégie que NodeListApi/NodeListImage).

### 3. Sélecteurs de source dans les Settings

- **type** : select principal ; changer le type réinitialise `apiId` et `dynamicItems` (avec confirmation si données présentes).
- **mode** :
  - `fixed` → sélecteur d'API filtré par type (`lists-image` pour image, `lists` pour article, cards video pour video).
  - `dynamic` :
    - `image` → composant file manager multi-pick (réutiliser `ListImageDynamicItemsSettings`).
    - `video` / `article` → composant ApiManager multi-pick (réutiliser `ListApiDynamicItemsSettings`).
- **display** / **view** : selects indépendants ; `slideshow` n'est proposé que pour `type=image` (v1) ; `grid` disponible pour tous les types.

### 4. Architecture de rendu (View)

```
NodeCollectionView
├── useCollectionData(type, mode, apiId, dynamicItems, page, itemsPerPage)
├── CollectionDisplayList    (display=list)
├── CollectionDisplayGrid    (display=grid, CSS grid / classes Tailwind)
└── CollectionDisplaySlideshow (display=slideshow, Swiper, reprise NodeSlideshow)
    └── CollectionItemRenderer (view=card | default)
        ├── CollectionItemCard      → shared/card + NodeCardApi patterns
        └── CollectionItemDefault   → NodeListApi / NodeListImage item layout
```

La **View** ne duplique pas le markup des nœuds existants : elle importe ou extrait des sous-composants partagés.

### 5. Mapping view × display

| display | view=default | view=card |
|---|---|---|
| `list` | `<ul>` items empilés (NodeListApi style) | cards empilées |
| `grid` | grille d'items simples | grille de cards |
| `slideshow` | slides image simples | slides card (image + titre overlay) |

Pour `type=image` en `view=default`, le rendu est aligné sur NodeListImage. Pour `type=article`, sur NodeListApi. Pour `type=video`, poster + titre (comme NodeVideoApi) dans les deux vues.

### 6. Enregistrement et palette

- Type : `node-collection`
- Catégorie palette : `api`
- Label : « Collection »
- Ordre : après NodeListApi (ex. order 6)
- Non droppable, pas d'enfants

### 7. CSS et thème

- Fichier `node-collection.css` avec hooks de base.
- Sélecteurs thème dans `ThemeFormComponent` si le pattern des autres nœuds liste l'exige.

## Risks / Trade-offs

- **[Complexité Settings]** → Un seul panneau avec onglets (Source / Affichage / Style / Slideshow) et champs conditionnels selon type/mode/display. Mitigation : sous-composants Settings réutilisés depuis NodeListApi, NodeListImage, NodeSlideshow.
- **[Video sans ApiListVideo]** → Le mode fixe video dépend des ApiCard video et de `fetchCollection`, moins homogène que image/article. Mitigation : documenter la limitation ; prévoir migration future vers `ApiListVideo` si besoin.
- **[Slideshow limité aux images en v1]** → Un slideshow d'articles/vidéos n'est pas supporté initialement. Mitigation : masquer `display=slideshow` quand `type≠image`.
- **[Surface de test combinatoire]** → 3 types × 2 modes × 3 displays × 2 views = 36 combinaisons théoriques. Mitigation : tests ciblés sur les chemins principaux + matrice réduite en tests unitaires des utils.
- **[Duplication partielle avec nœuds existants]** → Accepté en v1 ; factorisation progressive via `ManagerNode/shared/collection/`.

## Migration Plan

- Nouveau nœud uniquement ; aucune migration de contenu existant.
- Les pages utilisant NodeListApi / NodeListImage / NodeSlideshow restent inchangées.
- Déploiement : merge frontend + CSS thème ; pas de changement backend obligatoire (réutilisation endpoints existants).

## Open Questions

- Faut-il supporter `display=slideshow` pour `type=video` ou `article` dans une version ultérieure ?
- Le type `video` en mode fixe doit-il migrer vers un futur `ApiListVideo` — à évaluer selon retours éditoriaux.
- En `view=card` + `type=image`, reproduire-t-on toutes les options de position container de NodeCardApi (overlay, ratio…) ou un sous-ensemble simplifié ?
