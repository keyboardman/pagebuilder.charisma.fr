## ADDED Requirements

### Requirement: Nœud collection unifié (NodeCollection)

Le builder SHALL fournir un type de nœud **NodeCollection** (identifiant `node-collection`) permettant d'afficher une collection d'items configurée par quatre paramètres principaux : **`collectionType`** (`image` | `video` | `article`), **`mode`** (`fixed` | `dynamic`), **`display`** (`list` | `grid` | `slideshow`) et **`view`** (`card` | `default`). Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants : les items proviennent uniquement de la source configurée (endpoint ou sélection éditoriale).

#### Scenario: Ajout d'un NodeCollection depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc NodeCollection depuis le panneau des composants
- **THEN** un nœud `node-collection` est inséré avec les valeurs par défaut (`collectionType=article`, `mode=fixed`, `display=list`, `view=default`) ; un panneau de réglages est disponible

#### Scenario: Persistance de la configuration

- **WHEN** l'utilisateur configure type, mode, display, view et sauvegarde la page
- **THEN** tous les paramètres et références (`apiId`, `dynamicItems`, styles, options grid/slideshow) sont sérialisés dans le contenu du nœud et rechargés à l'édition

### Requirement: Mode fixe avec endpoint paginé

Lorsque `mode=fixed`, le NodeCollection SHALL exposer **`apiId`**, **`page`** (entier ≥ 1, défaut 1) et **`itemsPerPage`** (entier ≥ 1, défaut 10). Le nœud SHALL charger les items via l'endpoint adapté au `collectionType` :

- `image` → `GET /api/page-builder/lists-image/{apiId}/items` avec paramètres `page` et `limit` (ou `itemsPerPage`) ;
- `article` → `GET /api/page-builder/lists/{apiId}/items` avec paramètres `page` et `limit` (ou `itemsPerPage`) ;
- `video` → `fetchCollection` sur l'ApiCard video sélectionnée avec pagination supportée par l'adapter.

Le sélecteur d'API dans les réglages SHALL filtrer les sources éligibles selon le `collectionType` courant.

#### Scenario: Chargement fixe article paginé

- **WHEN** l'utilisateur configure `collectionType=article`, `mode=fixed`, `apiId` valide, `page=2`, `itemsPerPage=10`
- **THEN** le nœud appelle l'endpoint lists avec les paramètres de pagination et affiche les items de la page 2

#### Scenario: Sélecteur API filtré par type

- **WHEN** l'utilisateur change `collectionType` de `article` à `image` dans les réglages
- **THEN** le sélecteur d'API ne propose que les sources `ApiListImage` ; un `apiId` article précédemment sélectionné est réinitialisé

### Requirement: Mode dynamique avec sélection éditoriale

Lorsque `mode=dynamic`, le NodeCollection SHALL persister un tableau **`dynamicItems`** et SHALL résoudre les items à l'affichage selon le `collectionType` :

- `image` → sélection via file manager (médias) ; chaque entrée contient au minimum `id`, `src`, et optionnellement `alt`, `link` ;
- `article` → sélection via ApiManager (modale) ; chaque entrée contient `id` et `type` ; résolution via le mécanisme `ApiListArticleDynamique` ;
- `video` → sélection via ApiManager ; chaque entrée contient `apiId` et `itemId` ; résolution via l'adapter ApiCard video.

En mode dynamique, `page` et `itemsPerPage` SHALL s'appliquer localement sur la liste résolue (découpage par slice).

#### Scenario: Sélection dynamique d'images via file manager

- **WHEN** l'utilisateur configure `collectionType=image`, `mode=dynamic` et ajoute des images via le file manager
- **THEN** les entrées média sont persistées dans `dynamicItems` et affichées sans appel endpoint de collection fixe

#### Scenario: Sélection dynamique d'articles via ApiManager

- **WHEN** l'utilisateur configure `collectionType=article`, `mode=dynamic` et sélectionne plusieurs articles via ApiManager
- **THEN** les références `{ id, type }` sont persistées et résolues à l'affichage avec leurs champs mappés (titre, description, image, lien, compteurs)

#### Scenario: Pagination locale en mode dynamique

- **WHEN** l'utilisateur configure `mode=dynamic` avec 25 items sélectionnés, `page=2`, `itemsPerPage=10`
- **THEN** le nœud affiche les items 11 à 20 de la liste résolue

### Requirement: Disposition list

Lorsque `display=list`, le NodeCollection SHALL afficher les items dans une disposition verticale empilée (liste). Le conteneur SHALL utiliser le hook CSS `ce-collection` et chaque item `ce-collection-item`.

#### Scenario: Affichage en liste

- **WHEN** l'utilisateur configure `display=list` avec des items chargés
- **THEN** les items sont rendus les uns sous les autres dans un conteneur `ce-collection`

### Requirement: Disposition grid

Lorsque `display=grid`, le NodeCollection SHALL afficher les items dans une grille CSS configurable via `content.grid` : nombre de colonnes par breakpoint (`desktop`, `tablet`, `mobile`) et `gap`. Le conteneur SHALL utiliser le hook CSS `ce-collection-grid`.

#### Scenario: Affichage en grille responsive

- **WHEN** l'utilisateur configure `display=grid` avec `grid.columns.desktop=3`, `grid.columns.mobile=1`
- **THEN** la grille affiche 3 colonnes sur desktop et 1 colonne sur mobile

### Requirement: Disposition slideshow

Lorsque `display=slideshow` et `collectionType=image`, le NodeCollection SHALL afficher les items dans un carrousel Swiper. Le nœud SHALL exposer les paramètres slideshow (`navigationEnabled`, `paginationEnabled`, `speedMs`, `autoplayEnabled`, `autoplayDelayMs`, `slidesPerViewByBreakpoint`, `aspectRatio`, `effect`, `imageBorderRadius`, `gap`) alignés sur **NodeSlideshow**. Le conteneur SHALL utiliser le hook CSS `ce-collection-slideshow`.

Lorsque `collectionType` est `video` ou `article`, l'option `display=slideshow` SHALL être indisponible ou ignorée (fallback vers `list`).

#### Scenario: Slideshow d'images

- **WHEN** l'utilisateur configure `collectionType=image`, `display=slideshow` avec navigation et autoplay activés
- **THEN** un carrousel Swiper affiche les images avec les contrôles configurés

#### Scenario: Slideshow indisponible pour les articles

- **WHEN** l'utilisateur configure `collectionType=article`
- **THEN** l'option `display=slideshow` n'est pas proposée dans les réglages

### Requirement: Rendu view default

Lorsque `view=default`, chaque item SHALL être rendu selon le layout simple du type correspondant :

- `image` → image (et lien optionnel), aligné sur NodeListImage ;
- `article` → image, titre, description, compteur/like selon `content.show`, aligné sur NodeListApi ;
- `video` → poster et titre, aligné sur NodeVideoApi.

Les toggles `content.show.*` SHALL contrôler la visibilité des sous-parties lorsque le type et le mapping le permettent.

#### Scenario: Vue default article avec toggles show

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default`, `show.description=false`
- **THEN** les items affichent image et titre mais pas la description

### Requirement: Rendu view card

Lorsque `view=card`, chaque item SHALL être rendu comme une card (structure container/image/titre/texte/labels) alignée sur **NodeCardApi**, avec les mêmes toggles `content.show` et styles par sous-partie (`card`, `container`, `image`, `title`, `text`, `labels`).

#### Scenario: Vue card en grille

- **WHEN** l'utilisateur configure `display=grid`, `view=card`, `collectionType=article`
- **THEN** chaque item est rendu comme une card dans la grille

### Requirement: États dégradés et hooks CSS

Le NodeCollection SHALL afficher un état dégradé (placeholder ou message discret) lorsque la source est vide, en erreur ou en cours de chargement, sans empêcher la sauvegarde de la page. Le nœud SHALL exposer des hooks CSS pour le ciblage thème : `ce-collection`, `ce-collection-item`, `ce-collection-grid`, `ce-collection-slideshow`, et classes dérivées par sous-partie (image, titre, description, etc.).

#### Scenario: État vide en mode fixe sans apiId

- **WHEN** le NodeCollection est en `mode=fixed` sans `apiId` sélectionné
- **THEN** un placeholder discret s'affiche et la page reste sauvegardable

#### Scenario: Erreur de chargement API

- **WHEN** l'endpoint de collection retourne une erreur
- **THEN** le nœud affiche un état d'erreur discret sans bloquer l'éditeur
