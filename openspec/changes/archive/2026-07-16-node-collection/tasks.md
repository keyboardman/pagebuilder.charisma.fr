## 1. Structure et types

- [x] 1.1 Créer `assets/editeur/ManagerNode/NodeCollection/index.ts` avec `NODE_COLLECTION_TYPE`, interfaces TypeScript (`collectionType`, `mode`, `display`, `view`, `dynamicItems`, `grid`, `slideshow`, styles) et configuration par défaut
- [x] 1.2 Enregistrer NodeCollection dans `NodeRegistry.ts` (import, entrée registre, export type)
- [x] 1.3 Créer `collectionUtils.ts` : normalisation des paramètres, résolution des données par type×mode, pagination locale, cache fetch (factoriser depuis `listApiUtils` et `listImageApiUtils`)

## 2. Chargement des données

- [x] 2.1 Implémenter `useCollectionData` hook : branchement mode `fixed` image → `lists-image`, article → `lists`, video → `fetchCollection` ApiCard
- [x] 2.2 Implémenter branchement mode `dynamic` : image (file manager entries), article (`ApiListArticleDynamique`), video (résolution `apiId`+`itemId`)
- [x] 2.3 Gérer états loading / error / empty avec placeholders discrets (aligné NodeListApi)

## 3. Composants de rendu (View)

- [x] 3.1 Créer `CollectionItemDefault.tsx` : rendu item simple par type (image, article, video) avec toggles `show`
- [x] 3.2 Créer `CollectionItemCard.tsx` : rendu card (réutiliser `shared/card/` et patterns NodeCardApi)
- [x] 3.3 Créer `CollectionDisplayList.tsx` : disposition verticale avec hooks `ce-collection` / `ce-collection-item`
- [x] 3.4 Créer `CollectionDisplayGrid.tsx` : grille responsive (`grid.columns` par breakpoint, `gap`)
- [x] 3.5 Créer `CollectionDisplaySlideshow.tsx` : carrousel Swiper (reprise paramètres NodeSlideshow) pour `collectionType=image`
- [x] 3.6 Assembler `View.tsx` : sélection display + view, délégation aux sous-composants

## 4. Panneau de réglages (Settings)

- [x] 4.1 Créer onglet Source : selects `collectionType`, `mode`, `display`, `view` avec champs conditionnels
- [x] 4.2 Mode fixe : sélecteur API filtré par type + `ListApiDisplayPaginationSettings` (page, itemsPerPage)
- [x] 4.3 Mode dynamique image : réutiliser/adapter `ListImageDynamicItemsSettings` (file manager)
- [x] 4.4 Mode dynamique article/video : réutiliser/adapter `ListApiDynamicItemsSettings` (ApiManager)
- [x] 4.5 Onglet Affichage : réglages `grid` (colonnes breakpoint, gap) et `slideshow` (navigation, autoplay, slidesPerView, aspect-ratio, effet) — slideshow visible uniquement si `collectionType=image`
- [x] 4.6 Onglet Style : toggles `show.*` et réglages par sous-partie (collection, item, image, title, description, counter, like, labels) avec sélecteurs thème
- [x] 4.7 Réinitialiser `apiId` et `dynamicItems` lors du changement de `collectionType` (avec garde si données présentes)

## 5. CSS et thème

- [x] 5.1 Créer `assets/editeur/assets/themes/base/css/node-collection.css` avec hooks de base (`ce-collection`, `ce-collection-item`, `ce-collection-grid`, `ce-collection-slideshow`)
- [x] 5.2 Intégrer le CSS dans le pipeline thème (import bundle thème de base)
- [x] 5.3 Ajouter les sélecteurs NodeCollection dans `ThemeFormComponent/utils.ts` si requis par le pattern existant

## 6. Tests et validation

- [x] 6.1 Tests unitaires `collectionUtils` : normalisation, pagination locale, mapping dynamicItems par type
- [x] 6.2 Test composant View : rendu list/grid avec view default et card (mock données)
- [x] 6.3 Vérification manuelle : matrice type (image/article/video) × mode (fixed/dynamic) × display (list/grid) en édition et preview
- [x] 6.4 Vérification manuelle : slideshow image avec paramètres Swiper
