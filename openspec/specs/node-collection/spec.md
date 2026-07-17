# node-collection Specification

## Purpose

Nœud builder unifié **NodeCollection** (`node-collection`) pour afficher des collections d’items (image, video, article) avec modes fixed/dynamic, dispositions list/grid/slideshow et vues default/card/article.

## Requirements

### Requirement: Nœud collection unifié (NodeCollection)

Le builder SHALL fournir un type de nœud **NodeCollection** (identifiant `node-collection`) permettant d'afficher une collection d'items configurée par quatre paramètres principaux : **`collectionType`** (`image` | `video` | `article`), **`mode`** (`fixed` | `dynamic`), **`display`** (`list` | `grid` | `slideshow`) et **`view`** (`card` | `default` | `article` selon le type). Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants : les items proviennent uniquement de la source configurée (endpoint ou sélection éditoriale).

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

Lorsque `display=list`, le NodeCollection SHALL afficher les items dans une disposition verticale empilée (liste). Le conteneur SHALL utiliser le hook CSS `ce-collection` et chaque item `ce-collection-item`. Le nœud SHALL exposer un paramètre **`content.list.gap`** (entier ≥ 0, défaut `3`, même échelle Tailwind que `grid.gap`) pour contrôler l’espacement vertical entre items. Ce gap SHALL s’appliquer au conteneur liste (y compris le markup `ce-list-api-items` lorsque la vue article list-api est active). Les réglages Affichage SHALL proposer un contrôle Gap lorsque `display=list`.

#### Scenario: Affichage en liste

- **WHEN** l'utilisateur configure `display=list` avec des items chargés
- **THEN** les items sont rendus les uns sous les autres dans un conteneur `ce-collection`

#### Scenario: Gap liste configurable

- **WHEN** l'utilisateur configure `display=list` avec `list.gap=6`
- **THEN** le conteneur liste applique un espacement équivalent à la classe Tailwind `gap-6` entre les items

#### Scenario: Défaut gap liste sans valeur persistée

- **WHEN** un nœud existant a `display=list` sans `list.gap` défini
- **THEN** le rendu utilise le défaut `3` (équivalent à l’espacement historique ~0.75rem)

#### Scenario: Contrôle Gap visible en mode liste

- **WHEN** l'utilisateur ouvre l’onglet Affichage avec `display=list`
- **THEN** un contrôle Gap est disponible et met à jour `content.list.gap`

### Requirement: Disposition grid

Lorsque `display=grid`, le NodeCollection SHALL afficher les items dans une grille CSS configurable via `content.grid` : nombre de colonnes par breakpoint (`desktop`, `tablet`, `mobile`) et `gap`. Le conteneur SHALL utiliser le hook CSS `ce-collection-grid`.

#### Scenario: Affichage en grille responsive

- **WHEN** l'utilisateur configure `display=grid` avec `grid.columns.desktop=3`, `grid.columns.mobile=1`
- **THEN** la grille affiche 3 colonnes sur desktop et 1 colonne sur mobile

### Requirement: Disposition slideshow

Lorsque `display=slideshow`, le NodeCollection SHALL afficher les items dans un carrousel Swiper pour tous les `collectionType` (`image`, `video`, `article`). Le nœud SHALL exposer les paramètres slideshow (`navigationEnabled`, `paginationEnabled`, `speedMs`, `autoplayEnabled`, `autoplayDelayMs`, `slidesPerViewByBreakpoint`, `effect`, `gap`) alignés sur **NodeSlideshow**. Pour `collectionType=image`, le nœud SHALL aussi exposer `aspectRatio` et `imageBorderRadius`. Le conteneur SHALL utiliser le hook CSS `ce-collection-slideshow`.

#### Scenario: Slideshow d'images

- **WHEN** l'utilisateur configure `collectionType=image`, `display=slideshow` avec navigation et autoplay activés
- **THEN** un carrousel Swiper affiche les images avec les contrôles configurés

#### Scenario: Slideshow d'articles

- **WHEN** l'utilisateur configure `collectionType=article`, `display=slideshow`
- **THEN** un carrousel Swiper affiche les articles via le renderer de vue sélectionné (`default` / `article`)

#### Scenario: Slideshow de vidéos

- **WHEN** l'utilisateur configure `collectionType=video`, `display=slideshow`
- **THEN** un carrousel Swiper affiche les posters/vidéos via le renderer de vue sélectionné

### Requirement: Rendu view default

Lorsque `view=default`, chaque item SHALL être rendu selon le layout thème du type correspondant :

- `image` → image (et lien optionnel), aligné sur NodeImage (`.ce-image`) ;
- `article` → card alignée sur **NodeCardApi** (structure container/image/titre/texte/labels, hooks `.ce-card*`), pilotée par `content.show`, `content.container` et les styles des sous-parties card ;
- `video` → poster et titre, aligné sur NodeVideoApi.

Les toggles `content.show.*` SHALL contrôler la visibilité des sous-parties lorsque le type et le mapping le permettent. Pour article default, le texte de la card est piloté par `content.show.description` (équivalent fonctionnel de `show.text` côté NodeCardApi).

#### Scenario: Vue default article avec toggles show

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default`, `show.description=false`
- **THEN** les items affichent image et titre (si activés) mais pas le texte de description

#### Scenario: Vue default article utilise ce-card

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default` avec des items chargés
- **THEN** chaque item est rendu dans un élément portant la classe `ce-card`

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

### Requirement: Options card NodeCardApi pour la vue article default

Lorsque `collectionType=article` et `view=default`, le panneau de réglages NodeCollection SHALL exposer les mêmes options de configuration card que **NodeCardApi** :

- toggles de visibilité : image, titre, texte (persisté via `content.show.description`), labels ;
- layout du container : `position` (`left` | `right` | `top` | `overlay`), `align`, `ratio`, gap contenu ;
- styles par sous-partie : `card`, `container`, `image`, `title`, `text`, `labels` (className et/ou background, border, spacing, object-fit selon le pattern Card API).

Ces contrôles SHALL écrire dans `content.card`, `content.container`, `content.image`, `content.title`, `content.text`, `content.labels` et `content.show`. Ils SHALL **ne pas** apparaître lorsque `view=article` (liste API) ni pour les types `image` / `video`.

#### Scenario: Affichage des options card en vue default

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default` et ouvre l'onglet Style
- **THEN** les contrôles position / align / ratio / gap et les styles card/container/image/titre/texte/labels sont disponibles

#### Scenario: Options card masquées en vue liste API

- **WHEN** l'utilisateur configure `collectionType=article`, `view=article`
- **THEN** les options layout/styles spécifiques Card API ne sont pas proposées ; les toggles show adaptés à la liste API (titre, description, counter, like) restent disponibles

#### Scenario: Position image appliquée à tous les items

- **WHEN** l'utilisateur choisit `container.position=left` (ou `right` / `overlay`) en vue article default
- **THEN** chaque item de la collection rend une card avec la classe `ce-card-position-<position>` correspondante

#### Scenario: Toggle texte masque la description

- **WHEN** l'utilisateur désactive le toggle Texte / description en vue article default
- **THEN** `content.show.description` vaut `false` et aucun texte de description n'est affiché dans les cards

### Requirement: Parité de rendu article default avec NodeCardApi

Lorsque `collectionType=article` et `view=default`, chaque item SHALL être rendu avec la structure et les hooks CSS de **NodeCardApi** : `ce-card`, `ce-card-position-*`, `ce-card-align-*`, `ce-card-image`, `ce-card-image-ratio-*`, `ce-card-container-content`, `ce-card-title`, `ce-card-text`, `ce-card-label`, en respectant `content.show`, `content.container` et les styles des sous-parties.

#### Scenario: Card collection identique au thème Card API

- **WHEN** un NodeCollection article en `view=default` affiche un item avec image, titre, texte et label visibles
- **THEN** le markup de l'item utilise les classes `.ce-card*` du thème Card API (pas `.ce-list-api`)

#### Scenario: Ratio image appliqué

- **WHEN** l'utilisateur configure `container.ratio=1_3` en vue article default
- **THEN** l'image de chaque item porte la classe `ce-card-image-ratio-1_3`

### Requirement: Layout des toggles show carte article en settings

Lorsque `collectionType=article` et `view=default`, les settings de layout carte (`CardLayoutSettings`) SHALL afficher les quatre switchs de visibilité (Image, Title, Text, Label) sur **deux lignes** de deux contrôles, afin qu’ils tiennent correctement dans le panneau latéral sans débordement horizontal. Le comportement de persistance (`content.show.image`, `content.show.title`, `content.show.description`, `content.show.labels`) SHALL rester inchangé.

#### Scenario: Toggles show sur deux lignes

- **WHEN** l'utilisateur ouvre les settings de layout carte d'une collection article (vue default)
- **THEN** les switchs Image et Title apparaissent sur la première ligne, et Text et Label sur la seconde

#### Scenario: Binding show inchangé

- **WHEN** l'utilisateur bascule le switch Text
- **THEN** `content.show.description` est mis à jour comme auparavant

### Requirement: Source fixed via ApiCollection

Lorsque `mode=fixed`, NodeCollection SHALL charger les items via **`GET /api/page-builder/collections/{apiId}/items`** avec les paramètres **`page`** et **`itemsPerPage`**, quel que soit `collectionType` (`image`, `video`, `article`). Le sélecteur d’API en settings SHALL être alimenté par **`GET /api/page-builder/collections?type={collectionType}&mode=fixed`**.

#### Scenario: Article fixed unifié

- **WHEN** l’utilisateur configure `collectionType=article`, `mode=fixed`, un `apiId` valide, `page=1`, `itemsPerPage=10`
- **THEN** le nœud appelle `/page-builder/collections/{apiId}/items` et affiche les items mappés

#### Scenario: Video fixed unifié

- **WHEN** l’utilisateur configure `collectionType=video`, `mode=fixed` et sélectionne une API du catalogue
- **THEN** le sélecteur ne propose que les APIs `type=video` supportant `fixed`, et le chargement passe par le même endpoint collections

#### Scenario: Image fixed unifié

- **WHEN** l’utilisateur configure `collectionType=image`, `mode=fixed`
- **THEN** le nœud utilise le catalogue et l’endpoint ApiCollection (plus `lists-image` dédié pour ce nœud)

### Requirement: Source dynamic via ApiCollection (article et video)

Lorsque `mode=dynamic` et `collectionType` vaut `article` ou `video`, NodeCollection SHALL :

- proposer le picking depuis les APIs du catalogue filtrées `mode=dynamic` et `type` correspondant ;
- permettre d’affiner le browse du picker via **recherche** et, si disponibles, **catégories**, en consommant les endpoints ApiCollection (`items` avec `search`/`category`, `categories`) ;
- persister des références `{ apiId, itemId }` (ou équivalent) dans `dynamicItems` ;
- résoudre les items via **`POST /api/page-builder/collections/resolve`**.

Le mode dynamic **`image`** MAY conserver le picking file manager (hors ApiCollection) comme comportement éditorial.

#### Scenario: Resolve article dynamic

- **WHEN** l’utilisateur a sélectionné deux articles en mode dynamic
- **THEN** le nœud appelle resolve avec les deux références et affiche les items mappés dans l’ordre persisté

#### Scenario: Catalogue dynamic filtré

- **WHEN** l’utilisateur ouvre le picker en `collectionType=video`, `mode=dynamic`
- **THEN** seules les APIs `type=video` supportant `dynamic` sont proposées

#### Scenario: Picking avec filtres

- **WHEN** l’utilisateur ouvre le picker dynamic article/video sur une source supportant search/catégorie
- **THEN** il peut filtrer la liste affichée avant de sélectionner un item, sans quitter la modale

### Requirement: Filtres de picking dynamique (search et catégorie)

Lorsque l’utilisateur ouvre le picker d’items en mode **dynamic** (`collectionType` `article` ou `video`), NodeCollection SHALL :

1. proposer un champ de **recherche** qui appelle `GET /api/page-builder/collections/{apiId}/items` avec le paramètre `search` (debounce) ;
2. charger `GET /api/page-builder/collections/{apiId}/categories` pour la source sélectionnée ;
3. lorsque la liste de catégories est non vide, afficher un **sélecteur de catégorie** et transmettre la valeur choisie via le paramètre `category` sur l’endpoint items ;
4. réinitialiser la pagination à la page 1 lors d’un changement de recherche ou de catégorie.

#### Scenario: Recherche dans le picker article

- **WHEN** l’utilisateur sélectionne une source article dynamic et saisit un terme dans le champ rechercher
- **THEN** le picker recharge les items via `/collections/{apiId}/items` avec `search` égal au terme saisi

#### Scenario: Filtre catégorie affiché

- **WHEN** `/collections/{apiId}/categories` retourne au moins une catégorie
- **THEN** le picker affiche un sélecteur de catégorie et, après sélection, recharge les items avec `category` correspondant

#### Scenario: Pas de catégories

- **WHEN** `/collections/{apiId}/categories` retourne une liste vide
- **THEN** le picker n’affiche pas de sélecteur de catégorie et continue de lister les items (avec recherche éventuelle)

#### Scenario: Changement de filtre reset page

- **WHEN** l’utilisateur est en page 2 et modifie le terme de recherche ou la catégorie
- **THEN** le picker repasse à la page 1 avant de recharger

### Requirement: Édition du lien des images dynamiques

Lorsque `collectionType=image` et `mode=dynamic`, le panneau Source du NodeCollection SHALL permettre de saisir et modifier un champ **lien (URL) optionnel** pour chaque entrée de `dynamicItems`. La valeur SHALL être persistée dans `dynamicItems[].link`. Une chaîne vide ou absente SHALL être traitée comme « pas de lien ».

#### Scenario: Saisie d’un lien sur une image dynamique

- **WHEN** l’utilisateur a ajouté une image via la médiathèque en mode dynamique image et saisit une URL dans le champ Lien de cette entrée
- **THEN** `dynamicItems` pour cette entrée contient `link` égal à l’URL saisie (après trim si applicable) et la valeur est conservée à la sauvegarde de la page

#### Scenario: Lien vide reste non cliquable

- **WHEN** l’utilisateur laisse le champ Lien vide (ou le vide après l’avoir renseigné)
- **THEN** l’entrée n’a pas de lien effectif et l’image n’est pas enveloppée dans une ancre cliquable

#### Scenario: Nœuds existants sans champ link

- **WHEN** un NodeCollection image dynamique existant n’a pas de propriété `link` sur ses entrées `dynamicItems`
- **THEN** le panneau affiche le champ Lien vide et le rendu reste non cliquable, sans erreur

### Requirement: Rendu cliquable des images dynamiques liées

Lorsque `collectionType=image`, `mode=dynamic` et qu’une entrée résolue a un `link` non vide, le NodeCollection SHALL rendre l’image cliquable (ancre vers ce lien) pour les dispositions `list`, `grid` et `slideshow`, en vue `default`, de façon alignée sur le comportement NodeImage (hooks `.ce-image` / `.ce-image-link` selon le renderer).

#### Scenario: Image dynamique cliquable en liste

- **WHEN** l’utilisateur configure `collectionType=image`, `mode=dynamic`, `display=list` avec au moins une image dont `link` est renseigné
- **THEN** cette image est rendue à l’intérieur d’un lien pointant vers l’URL configurée

#### Scenario: Image dynamique cliquable en grille et slideshow

- **WHEN** la même entrée liée est affichée avec `display=grid` ou `display=slideshow`
- **THEN** l’image reste cliquable vers le même `link`

### Requirement: Consommation du mapping standard

NodeCollection SHALL consommer les champs du mapping ApiCollection (`image`, `title`, `description`, `label`/`labels`, `counter`, `like`, `link`) selon `collectionType`, `view` et les toggles `content.show.*`, sans dépendre d’un mapping spécifique à un registre legacy.

#### Scenario: Affichage counter et like

- **WHEN** un item article mappé contient `counter` et `like` et que les toggles show correspondants sont actifs
- **THEN** le rendu affiche ces valeurs

#### Scenario: Champ image optionnel

- **WHEN** un item n’a pas de champ `image` et que le toggle image est actif
- **THEN** le rendu omet ou placeholdère l’image sans planter

### Requirement: Indépendance de NodeCollection vis-à-vis des nœuds list legacy

Le module `NodeCollection` SHALL ne pas importer de types, utilitaires ni composants depuis `NodeListApi` ou `NodeListImage`. Les types d’entrées dynamiques (article / image), les helpers de visibilité (`show`), le mapping média et les réglages de source (pagination, picker image) SHALL être définis dans le périmètre NodeCollection (ou un module partagé hors des packages dépréciés).

#### Scenario: Aucun import NodeList* dans NodeCollection

- **WHEN** un audit statique des imports de `assets/editeur/ManagerNode/NodeCollection/**` est effectué
- **THEN** aucun chemin d’import ne référence `NodeListApi` ni `NodeListImage`

#### Scenario: Types locaux pour les items dynamiques

- **WHEN** un NodeCollection article ou image est configuré en mode `dynamic`
- **THEN** les entrées sont typées et persistées via des types propres à NodeCollection (`dynamicArticleItems` / `dynamicImageItems`), sans dépendance aux interfaces exportées par les nœuds list legacy

### Requirement: Contenu cible compatible avec la migration list → collection

Un nœud `node-collection` issu de la migration depuis `node-list-api` ou `node-list-image` SHALL être éditable et rendable avec le même `apiId`, mode, pagination et items dynamiques que le nœud d’origine, en `display=list`.

#### Scenario: Édition post-migration article

- **WHEN** l’éditeur ouvre une page dont un ancien `node-list-api` a été migré
- **THEN** le panneau Source affiche `collectionType=article`, le mode et l’`apiId` d’origine, et le chargement des items fonctionne

#### Scenario: Édition post-migration image

- **WHEN** l’éditeur ouvre une page dont un ancien `node-list-image` a été migré
- **THEN** le panneau Source affiche `collectionType=image`, le mode et les `dynamicImageItems` ou `apiId` d’origine, et le rendu liste fonctionne
