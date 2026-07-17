# NodeCollection

Nœud builder unifié (`node-collection`) pour afficher une collection d’items **image**, **video** ou **article**.

## Paramètres principaux

| Champ | Valeurs | Rôle |
|-------|---------|------|
| `collectionType` | `image` \| `video` \| `article` | Nature des items |
| `mode` | `fixed` \| `dynamic` | Source des données |
| `display` | `list` \| `grid` \| `slideshow` | Disposition |
| `view` | selon le type (voir registre) | Variante de rendu / thème |

Le nœud n’accepte **pas** d’enfants : les items viennent uniquement de la source configurée.

## Structure des fichiers

```
NodeCollection/
├── index.ts                 # Types, defaults, enregistrement nœud
├── collectionUtils.ts       # Normalisation + fetch/resolve items
├── collectionApiUtils.ts    # Appels API catalog / items / resolve
├── useCollectionData.ts     # Hook chargement (loading / error / empty)
├── View/
│   ├── index.tsx            # Conteneur racine `.ce-collection`
│   ├── collectionViews.ts   # Registre des vues par type
│   ├── CollectionItemRenderer.tsx
│   ├── CollectionDisplay.tsx / CollectionDisplaySlideshow.tsx
│   └── items/{image,video,article}/
└── Settings/
    ├── index.tsx            # Onglets Source / Affichage / Style
    ├── SourceTab.tsx
    ├── StyleTab.tsx         # Style générique (image)
    ├── display/             # Options list / grid / slideshow
    ├── card/                # Style article + view=default (NodeCard)
    ├── listApi/             # Style article + view=article (liste riche)
    └── video/               # Style video (NodeVideoApi)
```

## Modes de source

### Fixed

- Champs : `apiId`, `page`, `itemsPerPage`
- Chargement via `GET …/api/page-builder/collections/{apiId}/items`
- Le sélecteur d’API est filtré par `collectionType`

### Dynamic

| Type | Stockage | UI |
|------|----------|-----|
| `image` | `dynamicImageItems` | File manager (`CollectionImageDynamicItemsSettings`) |
| `article` | `dynamicArticleItems` | Picker collection (`CollectionArticle*`) |
| `video` | `dynamicVideoItems` | ApiManager (`apiId` + `itemId`) |

Changer de `collectionType` réinitialise `apiId` et les listes dynamiques.

## Dispositions (`display`)

- **list** — `content.list.gap` (échelle Tailwind, défaut `3`)
- **grid** — `content.grid.columns` (desktop/tablet/mobile) + `gap`
- **slideshow** — Swiper (`content.slideshow.*`) ; `aspectRatio` / `imageBorderRadius` réservés au type `image`

Hooks CSS : `.ce-collection`, `.ce-collection-list`, `.ce-collection-grid`, `.ce-collection-slideshow`.

## Vues (`view`)

Registre : `View/collectionViews.ts` (`COLLECTION_VIEW_REGISTRY`).

| Type | Vue | Composant | Hook thème |
|------|-----|-----------|------------|
| image | `default` | `items/image/DefaultItem` | `.ce-image` |
| video | `default` | `items/video/DefaultItem` | `.ce-card` + `.ce-video` / `.ce-youtube` |
| article | `default` | `items/article/DefaultItem` | `.ce-card` |
| article | `article` | `items/article/ArticleItem` | `.ce-list-api` |

Migration : ancienne valeur `card` → `default`.

### Ajouter une vue

1. Déclarer l’option dans `COLLECTION_VIEW_REGISTRY`
2. Créer `View/items/<type>/MaVueItem.tsx`
3. Brancher dans `CollectionItemRenderer`
4. Adapter le panneau Style si besoin
5. Ajouter un test dans `View.test.tsx`

## Panneau Style

Routé dans `Settings/index.tsx` selon type × vue :

| Condition | Panneau |
|-----------|---------|
| article + `default` | `Settings/card/` (Card / Container / Image / Title / Text / Labels) |
| article + `article` | `Settings/listApi/` (toggles + parties Liste API) |
| video | `Settings/video/` (Card / Titre / Image) |
| sinon (ex. image) | `StyleTab` générique sur `show.*` |

**Mapping card** : le toggle UI « Text » écrit `show.description` (pas `show.text`). Counter / like sont masqués en vue card ; disponibles en vue `article`.

## Données runtime

`useCollectionData` → `fetchCollectionItems` (`collectionUtils`) :

1. Normalise type / mode / pagination
2. Fixed → page API ; dynamic → resolve entrées
3. Mappe vers `CollectionItem` (union image | article | video)

## Tests

```bash
npx vitest run assets/editeur/ManagerNode/NodeCollection
```

- `collectionUtils.test.ts` — normalisation, pagination, mapping image dynamique
- `collectionApiUtils.test.ts` — helpers API
- `View.test.tsx` — rendu list + vues article/video

## Spec produit

Voir `openspec/specs/node-collection/spec.md`.
