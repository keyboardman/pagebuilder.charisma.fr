## Why

Le builder dispose aujourd'hui de plusieurs nœuds spécialisés pour afficher des collections — **NodeListApi** (articles), **NodeListImage** (images), **NodeSlideshow** (carrousel), **NodeCardApi** (item unique) — chacun avec ses propres réglages, modes de source et rendus. Ce morcellement complique le choix éditorial, duplique la logique de chargement (mode fixe vs dynamique, pagination, sélection API/file manager) et rend difficile le passage d'une présentation à une autre (liste → grille → slideshow) sans recréer le nœud. Un nœud unifié **NodeCollection** permettra de couvrir ces cas via une configuration déclarative.

## What Changes

- Ajout du nœud **`NodeCollection`** (identifiant `node-collection`) : agrégat configurable remplaçant la combinaison ad hoc de NodeList*, NodeCard* et NodeSlideshow pour les cas de collection.
- Paramètres de contenu :
  - **`type`** : `image` | `video` | `article` — détermine la source de données et le contrat de mapping attendu.
  - **`mode`** :
    - `fixed` — chargement via endpoint paginé (`page`, `limit` / `itemsPerPage`) ;
    - `dynamic` — sélection manuelle : file manager pour `image`, ApiManager (modale) pour `video` et `article`.
  - **`display`** : `list` | `grid` | `slideshow` — disposition des items.
  - **`view`** : `card` | `default` — rendu unitaire de chaque item (style NodeCardApi vs style liste simple).
- Réutilisation des sous-systèmes existants : `ApiListImage` / `ApiListArticle`, file manager, ApiManager, composants partagés (`shared/card/`), Swiper pour le mode slideshow.
- Réglages de style par sous-partie (conteneur, item, image, titre, description, compteur/like selon le type) et hooks CSS dédiés (`ce-collection`, `ce-collection-item`, etc.).
- Paramètres slideshow hérités de **NodeSlideshow** lorsque `display = slideshow` (navigation, pagination, autoplay, slidesPerView, aspect-ratio, effet).

## Capabilities

### New Capabilities

- `node-collection` : comportement du nœud unifié (paramètres type/mode/display/view, chargement des données, rendu multi-disposition, états dégradés, persistance).

### Modified Capabilities

- `page-builder` : enregistrement du nœud NodeCollection dans le registre builder, bouton palette, intégration thème CSS.

## Impact

- Affected specs: **node-collection** (nouveau), **page-builder** (delta)
- Affected code:
  - `assets/editeur/ManagerNode/NodeCollection/` (nouveau : `index.ts`, `View.tsx`, `Settings.tsx`, sous-composants display/view, utils)
  - `assets/editeur/ManagerNode/components/NodeRegistry.ts`
  - Réutilisation : `NodeListApi/`, `NodeListImage/`, `NodeSlideshow/`, `NodeCardApi/`, `ManagerApi/ApiManagerModal.tsx`, file manager
  - Thème de base : `assets/editeur/assets/themes/base/css/node-collection.css`
  - `assets/components/ThemeFormComponent/utils.ts` (sélecteur thème si applicable)
- **Non-Goals immédiats** : dépréciation ou suppression des nœuds existants (NodeListApi, NodeListImage, NodeSlideshow restent disponibles).
