# page-builder Specification

## Purpose
TBD - created by archiving change add-page-builder. Update Purpose after archive.
## Requirements
### Requirement: Composant builder de page intégré (sans iframe)

Le système SHALL fournir un composant builder de page, porté ou adapté depuis le dépôt `editeur2.charisma.fr`, qui s'intègre nativement dans le formulaire d'édition de page. Le builder SHALL fonctionner comme composant React embarqué dans le DOM de la page, sans utilisation d'iframe.

#### Scenario: Affichage du builder à la place du textarea content

- **WHEN** l'utilisateur ouvre la création ou l'édition d'une page
- **THEN** le champ « Contenu » affiche le composant builder (drag-and-drop, blocs, éditeur riche) au lieu du textarea brut

#### Scenario: Édition sans iframe

- **WHEN** l'utilisateur interagit avec le builder (ajout de blocs, modification de texte, insertion d'images)
- **THEN** toutes les interactions ont lieu dans le même document ; aucun iframe n'est utilisé pour l'édition du contenu

### Requirement: Format de contenu et persistance

Le builder SHALL produire un contenu compatible avec le stockage dans `Page.content` et le rendu actuel en preview (`page.content|raw`). Le format SHALL être du HTML valide ou un format structuré (ex. JSON de blocs) converti en HTML avant stockage ou à l'affichage.

#### Scenario: Sauvegarde du contenu édité

- **WHEN** l'utilisateur soumet le formulaire page avec du contenu édité dans le builder
- **THEN** le contenu est sérialisé (HTML ou JSON selon l'architecture) et envoyé au serveur ; il est stocké dans `Page.content` et reste compatible avec la prévisualisation

#### Scenario: Chargement du contenu existant

- **WHEN** l'utilisateur ouvre l'édition d'une page ayant déjà du contenu
- **THEN** le builder charge et affiche ce contenu de manière éditable ; les pages avec contenu HTML brut existant sont gérées (affichage ou message si format non reconnu)

### Requirement: Intégration avec la médiathèque

Le builder SHALL permettre l'insertion d'images et de médias provenant de la médiathèque fournie par keyboardman/filemanager-bundle. Pour ce faire, le builder SHALL ouvrir le file manager dans une **iframe** dont l’URL est une **URL absolue** fournie par le backend (ex. `app.request.schemeAndHttpHost` + route du file manager). La communication entre la page parente (builder) et l’iframe SHALL s’effectuer via **postMessage** (événement `keyboardman.filemanager.picked` avec channel, path, filesystem). Après réception de la sélection, le builder SHALL obtenir l’**URL absolue** du fichier (via la route de résolution du bundle, ex. `/filemanager/resolve-url`) et insérer cette URL absolue dans le contenu (image ou média).

#### Scenario: Insertion d'une image depuis la médiathèque

- **WHEN** l'utilisateur insère une image dans le builder (ex. bouton « Insérer image »)
- **THEN** une modale s’ouvre contenant une iframe chargée avec l’URL absolue du file manager ; l’utilisateur parcourt la médiathèque, sélectionne une image ; le builder reçoit la sélection par postMessage, résout l’URL absolue et insère cette URL dans le contenu

#### Scenario: URL absolue insérée

- **WHEN** l'utilisateur choisit un fichier dans le file manager (iframe) et valide
- **THEN** l’URL insérée dans le contenu du builder est une URL absolue (ex. `https://.../serve/default/...` ou équivalent), de sorte que l’image ou le média s’affiche correctement en prévisualisation et en rendu sans ambiguïté de base

#### Scenario: Upload depuis le file manager en iframe

- **WHEN** l’utilisateur ouvre le file manager en iframe et uploade un nouveau fichier depuis l’interface du bundle
- **THEN** le fichier est envoyé via l’API du bundle (filesystem) ; l’utilisateur peut ensuite sélectionner ce fichier ; le builder reçoit la sélection et insère l’URL absolue résolue dans le contenu

### Requirement: Chargement du CSS du thème dans le contexte d'édition

Lors de l'édition d'une page, le builder SHALL bénéficier du CSS du thème associé à la page (chargé via `app_theme_css`), afin que le rendu dans l'éditeur reflète les styles du thème choisi.

Le CSS chargé SHALL correspondre au CSS final généré par le pipeline de thème (socle CSS de base + overrides ThemeBuilder), et ce CSS SHALL couvrir tous les nodes enregistrés afin de garantir la cohérence visuelle de l'éditeur.

#### Scenario: Édition avec styles du thème
- **WHEN** l'utilisateur édite une page avec un thème ayant un fichier CSS généré
- **THEN** la feuille de style du thème est chargée dans la page d'édition et le contenu affiché dans le builder utilise ces styles

#### Scenario: Couverture des styles pour tous les nodes en édition
- **WHEN** la page contient plusieurs types de nodes pris en charge par le registre du builder
- **THEN** l'éditeur applique les styles du CSS de thème généré à chacun de ces nodes (base et overrides éventuels) avec un rendu cohérent avec la preview et le rendu final

### Requirement: APIs card fournies par Symfony et disponibles dans le builder

Le builder SHALL consommer les APIs « card » exposées par Symfony (voir capacité `builder-api-registry`) plutôt que de dépendre uniquement d’un enregistrement côté JavaScript. Au chargement du builder (page standalone ou formulaire d’édition), la liste des APIs disponibles SHALL être obtenue depuis le backend (injection dans les données de la page ou appel à l’endpoint de liste). Le builder SHALL utiliser les endpoints backend pour récupérer les collections et les items (fetchCollection, fetchItem) lorsqu’un utilisateur choisit une API et sélectionne un contenu pour un bloc card API.

#### Scenario: Affichage des APIs enregistrées en PHP dans le sélecteur du builder

- **WHEN** l’utilisateur ouvre le sélecteur d’API (ex. modale pour choisir une card API) dans le builder
- **THEN** les APIs listées sont celles exposées par le registre Symfony (liste fournie par le backend) ; l’utilisateur peut en choisir une sans avoir appelé `CharismaPageBuilder.registerApi()` en JS

#### Scenario: Sélection d’un item depuis une API backend

- **WHEN** l’utilisateur sélectionne une API puis recherche ou parcourt les items (collection) et choisit un item
- **THEN** les appels de liste (collection) et de détail (item) sont effectués vers les endpoints Symfony ; le résultat mappé est utilisé pour remplir la card dans le builder

### Requirement: Conteneur Flex (NodeFlex)

Le builder SHALL fournir un type de nœud conteneur **NodeFlex** (identifiant `node-flex`) dans lequel les composants enfants sont alignés à l'aide des propriétés CSS Flexbox. Le nœud SHALL être droppable (une zone unique, par ex. `main`) et SHALL exposer des options configurables pour la disposition flex : direction (row, column, row-reverse, column-reverse), justify-content, align-items, gap et flex-wrap.

En mode **édition** et direction **horizontale** (`row`, `row-reverse`) avec **justify-content** à `flex-start`, le conteneur flex `.ce-flex-inner` SHALL occuper toute la largeur disponible. La zone de dépôt du conteneur `main` — qu'elle soit **seule** (flex vide) ou **finale** (après les enfants) — SHALL occuper l'espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente aux dropzones vides (`min-height: 2.5rem`), afin que l'utilisateur puisse identifier et cibler facilement l'emplacement de dépôt sans chercher visuellement. Les dropzones intermédiaires (entre enfants) conservent leur taille compacte actuelle pour le réordonnancement précis. Lorsque **justify-content** est `center`, `flex-end` ou une valeur `space-*`, la dropzone finale reste **compacte** en mode édition afin de ne pas perturber l'alignement des enfants ni bloquer leur sélection.

L'option **wrap** (`flex-wrap`) SHALL être appliquée de manière identique en modes **édition**, **prévisualisation** et **view**, conformément au canevas WYSIWYG.

#### Scenario: Ajout d'un conteneur Flex depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l'utilisateur peut y déposer d'autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l'utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l'éditeur selon ces propriétés, y compris `flex-wrap: nowrap` si configuré
- **AND** le rendu en prévisualisation et à l'export reflète le même alignement

#### Scenario: Dropzone visible en horizontal sans enfant

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) ne contient aucun enfant et que le builder est en mode édition
- **THEN** le conteneur `.ce-flex-inner` occupe toute la largeur disponible
- **AND** la zone de dépôt unique s'étend sur cet espace horizontal disponible
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)

#### Scenario: Dropzone finale visible en horizontal avec enfants existants

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) avec **justify-content** `flex-start` contient au moins un enfant et que le builder est en mode édition
- **THEN** la dernière zone de dépôt du conteneur `main` s'étend pour occuper l'espace horizontal restant après les enfants
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)
- **AND** les dropzones entre les enfants restent compactes pour permettre un réordonnancement précis

#### Scenario: Dropzone compacte si justify autre que flex-start

- **WHEN** un NodeFlex en direction horizontale utilise **justify-content** `center`, `flex-end` ou une valeur `space-*` et que le builder est en mode édition
- **THEN** la dropzone finale du conteneur `main` reste compacte (sans `flex: 1`)
- **AND** les enfants conservent l'alignement configuré et restent sélectionnables

#### Scenario: No wrap appliqué en édition

- **WHEN** l'utilisateur configure l'option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **édition**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: nowrap` comme en prévisualisation
- **AND** les dropzones restent utilisables pour le glisser-déposer

#### Scenario: Persistance du conteneur Flex

- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l'affichage, y compris l'option `wrap` telle que configurée

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText). Le libellé (`content.label`) SHALL être éditable dans le panneau **NodeSettings** et SHALL supporter le **gras partiel** conformément à l'exigence **Gras partiel du libellé NodeButton**.

#### Scenario: Ajout d'un NodeButton depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l'utilisateur peut modifier le type (button / submit / link), le libellé (y compris gras partiel) et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l'utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Persistance du NodeButton

- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé (texte brut ou HTML inline de gras autorisé), href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l'affichage

### Requirement: Conteneur image (NodeContainerImage)

Le builder SHALL fournir un type de nœud conteneur **NodeContainerImage** (identifiant `node-container-image`) dont la taille est définie par une image affichée en arrière-plan sur tout le conteneur. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le nœud SHALL exposer les propriétés configurables suivantes : **source de l’image** (src), **ratio** (aspect-ratio, ex. 16/9, 4/3, 1), **alignement horizontal** (start, center, end), **alignement vertical** (top, middle, bottom). Le conteneur SHALL avoir une largeur 100 % et une hauteur déterminée par le ratio (aspect-ratio). L’image SHALL couvrir l’ensemble du conteneur en arrière-plan (cover). La zone de dépôt à l’intérieur du conteneur SHALL prendre en compte les propriétés d’alignement horizontal et vertical pour positionner le contenu déposé.

#### Scenario: Ajout d’un conteneur image depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur image (NodeContainerImage)
- **THEN** un nœud NodeContainerImage est inséré dans la page ; l’utilisateur peut définir la source de l’image, le ratio et les alignements, et déposer d’autres blocs dans la zone dont la position respecte ces alignements

#### Scenario: Dimensions et image de fond

- **WHEN** l’utilisateur configure une source d’image et un ratio (ex. 16/9) sur un NodeContainerImage
- **THEN** le conteneur affiche une largeur 100 % et une hauteur calculée via aspect-ratio ; l’image couvre tout le conteneur en arrière-plan (background-size cover)

#### Scenario: Alignement de la dropzone

- **WHEN** l’utilisateur modifie l’alignement horizontal (start, center, end) ou vertical (top, middle, bottom) dans les paramètres du NodeContainerImage
- **THEN** la zone de dépôt à l’intérieur du conteneur positionne son contenu (enfants déposés) selon ces alignements ; le rendu en prévisualisation et à l’export reflète le même positionnement

#### Scenario: Persistance du conteneur image

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeContainerImage avec source, ratio et alignements définis
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure, la source d’image, le ratio et les attributs/styles nécessaires pour reproduire l’affichage (image de fond, dimensions, alignement du contenu)

### Requirement: Nœud HTML (NodeHtml)

Le builder SHALL fournir un type de nœud **NodeHtml** (identifiant `node-html`) permettant d’insérer un fragment de **code HTML brut** dans une page. Le nœud SHALL exposer un champ de contenu HTML éditable (zone de texte multi‑ligne ou éditeur de code) dans le panneau de propriétés, et SHALL rendre ce contenu tel quel (sous forme de HTML) dans la prévisualisation et dans le rendu final de la page.

#### Scenario: Ajout d’un NodeHtml depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud HTML (NodeHtml)
- **THEN** un nœud NodeHtml est inséré dans la page avec un contenu HTML vide ou d’exemple ; l’utilisateur voit un champ de contenu HTML dans les paramètres du nœud

#### Scenario: Édition du code HTML

- **WHEN** l’utilisateur modifie le champ de contenu HTML du NodeHtml dans le panneau de propriétés
- **THEN** l’aperçu dans l’éditeur est mis à jour pour refléter le HTML saisi (balises, structure, texte) et la prévisualisation utilise le même HTML

#### Scenario: Persistance du NodeHtml

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeHtml avec du contenu HTML saisi
- **THEN** le contenu sérialisé conserve le fragment HTML pour chaque NodeHtml de sorte que la prévisualisation et le rendu final restituent le même HTML

### Requirement: Conteneur de navigation (NodeNav)

Le builder SHALL fournir un type de nœud conteneur **NodeNav** (identifiant `node-nav`) qui n’accepte comme enfants que des nœuds de type **NodeNavItem**. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeNav SHALL exposer les options configurables suivantes : **direction** (horizontal, vertical) pour l’alignement des items, **icône burger** (booléen) pour recenser tous les NodeNavItem dans un menu repliable (ex. menu burger sur mobile), et **variante** (`navbar`, `liste`) afin de permettre le ciblage CSS via des hooks DOM (attribut `data-ce-variant` et classe CSS `ce-menu--{variant}` sur le conteneur `<nav>`).

En mode **édition** et direction **horizontale**, le conteneur flex `.ce-menu-content` SHALL occuper toute la largeur du `<nav>`. La zone de dépôt du conteneur `main` — qu’elle soit **seule** (menu vide) ou **finale** (après les items) — SHALL occuper l’espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente aux dropzones vides (`min-height: 2.5rem`), afin que l’utilisateur puisse identifier et cibler facilement l’emplacement de dépôt sans chercher visuellement. Les dropzones intermédiaires (entre items) conservent leur taille compacte actuelle pour le réordonnancement précis.

#### Scenario: Ajout d’un NodeNav depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le menu de navigation (NodeNav)
- **THEN** un nœud NodeNav est inséré dans la page ; l’utilisateur peut y déposer uniquement des NodeNavItem ; les autres types de blocs ne sont pas acceptés dans ce conteneur

#### Scenario: Direction horizontal ou vertical

- **WHEN** l’utilisateur modifie l’option direction du NodeNav (horizontal ou vertical) dans les paramètres du nœud
- **THEN** les NodeNavItem enfants sont alignés selon cette direction dans l’éditeur, la prévisualisation et le rendu final

#### Scenario: Dropzone visible en horizontal sans item

- **WHEN** un NodeNav en direction horizontale ne contient aucun NodeNavItem et que le builder est en mode édition
- **THEN** le conteneur `.ce-menu-content` occupe toute la largeur du `<nav>`
- **AND** la zone de dépôt unique s’étend sur cet espace horizontal disponible
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)

#### Scenario: Dropzone finale visible en horizontal avec items existants

- **WHEN** un NodeNav en direction horizontale contient au moins un NodeNavItem et que le builder est en mode édition
- **THEN** la dernière zone de dépôt du conteneur `main` s’étend pour occuper l’espace horizontal restant après les items
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)
- **AND** les dropzones entre les items restent compactes pour permettre un réordonnancement précis

#### Scenario: Icône burger pour recenser les items

- **WHEN** l’utilisateur active l’option « icône burger » sur un NodeNav
- **THEN** une icône burger est affichée et permet de recenser ou d’afficher tous les NodeNavItem (ex. liste déroulante ou overlay) ; le comportement est visible en prévisualisation et à l’export

#### Scenario: Variante navbar ou liste pour le styling CSS

- **WHEN** l’utilisateur modifie l’option « variante » du NodeNav sur `navbar` ou `liste` dans les paramètres du nœud
- **THEN** le conteneur `<nav>` du NodeNav est rendu avec `data-ce-variant="{variant}"` et la classe CSS `ce-menu--{variant}` ; l’éditeur, la prévisualisation et le rendu final exposent ces hooks pour le styling

#### Scenario: Persistance du NodeNav

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeNav avec direction, icône burger et variante définies
- **THEN** le contenu sérialisé conserve la structure, la direction, l’état de l’option burger, la variante, et les références aux NodeNavItem enfants

### Requirement: Item de menu (NodeNavItem)

Le builder SHALL fournir un type de nœud **NodeNavItem** (identifiant `node-nav-item`) représentant un item de menu. Le NodeNavItem SHALL supporter trois types : **lien** (link), **image**, **bouton** (button). Pour le type **lien**, le nœud SHALL exposer les champs **href** et **target**. Pour le type **image**, le nœud SHALL exposer les champs **src**, **alt** et optionnellement **href** (lien autour de l’image). Pour le type **bouton**, le nœud SHALL exposer le **label** et le type de bouton (button ou submit). Un NodeNavItem SHALL être déposé uniquement à l’intérieur d’un NodeNav.

#### Scenario: Ajout d’un NodeNavItem dans un NodeNav

- **WHEN** l’utilisateur ajoute un item de menu (NodeNavItem) et le dépose dans un NodeNav
- **THEN** le NodeNavItem est inséré comme enfant du NodeNav ; l’utilisateur peut choisir le type (lien, image, bouton) et renseigner les champs associés

#### Scenario: NodeNavItem type lien

- **WHEN** l’utilisateur définit le type du NodeNavItem sur « lien »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: NodeNavItem type image

- **WHEN** l’utilisateur définit le type du NodeNavItem sur « image »
- **THEN** les champs src, alt et optionnellement href sont affichés ; le rendu produit une image (et un lien englobant si href est renseigné)

#### Scenario: NodeNavItem type bouton

- **WHEN** l’utilisateur définit le type du NodeNavItem sur « bouton »
- **THEN** les champs label et type (button/submit) sont affichés ; le rendu produit un élément `<button>` avec le libellé et le type appropriés

#### Scenario: Persistance du NodeNavItem

- **WHEN** l’utilisateur sauvegarde une page contenant des NodeNavItem (lien, image ou bouton) dans un NodeNav
- **THEN** le contenu sérialisé conserve le type de chaque NodeNavItem et les champs associés (href, target, src, alt, label, etc.) pour reproduire le rendu à l’affichage

### Requirement: Nœud diaporama Swiper (NodeSlideshow)
Le builder SHALL fournir un type de nœud **NodeSlideshow** (identifiant `node-slideshow`) permettant de créer un diaporama/carrousel basé sur une liste ordonnée d’images.

Le nœud SHALL être éditable dans le panneau de propriétés du builder et SHALL produire un rendu en preview et dans le rendu final en s’appuyant sur la librairie **Swiper**.

#### Scenario: Ajout d’un NodeSlideshow depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc NodeSlideshow dans la page
- **THEN** un node `node-slideshow` apparaît dans l’éditeur et un panneau de réglages est disponible

#### Scenario: Rendu Swiper depuis la liste d’images
- **WHEN** l’utilisateur configure une liste de slides avec des images
- **THEN** la preview affiche un carrousel Swiper avec une slide par image

#### Scenario: Persistance de la configuration du node en mode manuel
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow en mode `manual`
- **THEN** les images (dans leur ordre), leurs métadonnées de slide (dont `alt`, source d'image et lien éventuel), ainsi que les options d’affichage Swiper définies, sont sérialisées et restituées lors d’un rechargement

#### Scenario: Persistance de la configuration du node en mode API
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow en mode `api-endpoint`
- **THEN** le contenu sérialisé conserve `slidesMode`, `apiId` et les options d’affichage Swiper
- **AND** le contenu sérialisé ne conserve pas le tableau `slides` issu de l’API (snapshot)
- **AND** les slides sont rechargées depuis l’API à l’affichage ultérieur

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)

Le nœud NodeSlideshow SHALL permettre à l'utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d'une **ApiListImage** (collection fixe) dans le panneau ; le système charge la collection à l'affichage via `GET /api/page-builder/lists-image/{apiId}/items` et la mappe en slides, sans persister les données de la collection dans le contenu du nœud.

En mode `manual`, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final. En mode `api-endpoint`, les liens SHALL provenir du champ `link` du mapping ApiListImage de chaque item ; le texte alternatif SHALL provenir du champ `alt` (ou être vide si absent).

Après chaque action en mode `manual`, l'ordre et le contenu SHALL être immédiatement reflétés dans la preview. En mode `api-endpoint`, la preview SHALL refléter la collection API courante (rechargée à l'affichage ou via le bouton « Recharger » du panneau).

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la source des slides affichées (liste manuelle vide ou placeholder en mode API) et SHALL purger toute donnée de slide persistée lorsque le mode API est actif.

En mode `api-endpoint`, la sélection de l'API SHALL utiliser le catalogue `GET /api/page-builder/lists-image` (et non `ApiManagerModal` / `/api/page-builder/cards`).

#### Scenario: Tri par drag-and-drop en mode manuel

- **WHEN** l'utilisateur réordonne les slides en mode `manual` par glisser-déposer
- **THEN** l'ordre des slides dans le contenu persisté et la preview SHALL être mis à jour immédiatement

#### Scenario: Ajout d'une slide en mode manuel

- **WHEN** l'utilisateur ajoute une slide en mode `manual` (via médiathèque ou URL)
- **THEN** la slide apparaît dans la liste et la preview

#### Scenario: Suppression d'une slide en mode manuel

- **WHEN** l'utilisateur supprime une slide en mode `manual`
- **THEN** la slide disparaît de la liste et de la preview

#### Scenario: Sélection d'un endpoint API pour afficher les slides

- **WHEN** l'utilisateur passe en mode `api-endpoint`
- **AND** l'utilisateur sélectionne une ApiListImage via le catalogue `/api/page-builder/lists-image`
- **THEN** les slides sont chargées depuis la collection de l'API sélectionnée pour la preview
- **AND** seuls `slidesMode` et `apiId` sont persistés dans le contenu du nœud

#### Scenario: Données API fraîches à l'affichage

- **WHEN** un NodeSlideshow en mode `api-endpoint` avec un `apiId` valide est affiché (éditeur, preview ou rendu final)
- **THEN** le système appelle `GET /api/page-builder/lists-image/{apiId}/items` et mappe les items en slides (`src` ← `image`, `alt` ← `alt`, `link` ← `link`)
- **AND** le rendu reflète la collection courante de l'API, indépendamment d'un éventuel snapshot `slides` présent dans d'anciennes sauvegardes

#### Scenario: Rechargement manuel dans le panneau

- **WHEN** l'utilisateur clique sur "Recharger" en mode `api-endpoint`
- **THEN** la preview des vignettes est rafraîchie depuis l'API sans écrire les slides dans le contenu persisté du nœud

#### Scenario: Lien optionnel par slide en mode manuel

- **WHEN** l'utilisateur renseigne un champ `link` sur une slide en mode `manual`
- **THEN** la slide est cliquable dans la preview et le rendu final avec l'URL configurée

#### Scenario: API indisponible ou collection vide en mode API

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide en mode `api-endpoint`
- **THEN** le NodeSlideshow affiche un état dégradé (placeholder ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Sélection d'API sans mélange avec le catalogue Font

- **WHEN** l'utilisateur configure la source API d'un NodeSlideshow
- **THEN** le sélecteur n'affiche que les sources `ApiListImage` du catalogue `/api/page-builder/lists-image` ; les endpoints du catalogue `Font` (`/api/builder/fonts`) et les `ApiCard` (`/api/page-builder/cards`) ne figurent pas dans cette liste

### Requirement: Réglages d’affichage Swiper (navigation, pagination, vitesse)
Le nœud NodeSlideshow SHALL exposer des paramètres permettant de configurer :
- l’affichage de la navigation prev/next
- l’affichage de la pagination
- la vitesse de transition (en millisecondes)

Ces paramètres SHALL être appliqués au carrousel Swiper utilisé par le nœud et SHALL être visibles en preview.

#### Scenario: Activation/désactivation de la navigation
- **WHEN** l’utilisateur désactive la navigation dans le panneau du NodeSlideshow
- **THEN** les boutons prev/next ne sont plus affichés dans la preview
- **WHEN** l’utilisateur réactive la navigation
- **THEN** les boutons prev/next réapparaissent

#### Scenario: Activation/désactivation de la pagination
- **WHEN** l’utilisateur désactive la pagination dans le panneau du NodeSlideshow
- **THEN** les indicateurs de pagination ne sont plus affichés dans la preview
- **WHEN** l’utilisateur réactive la pagination
- **THEN** les indicateurs de pagination réapparaissent

#### Scenario: Modification de la vitesse de transition
- **WHEN** l’utilisateur définit la vitesse de transition à une valeur en millisecondes (ex. 300)
- **THEN** Swiper utilise cette vitesse pour les transitions entre slides dans la preview

### Requirement: Autoplay Swiper
Le nœud NodeSlideshow SHALL exposer des paramètres permettant de configurer l’autoplay Swiper :
- l’activation/désactivation de l’autoplay
- le délai d’autoplay en millisecondes

Ces paramètres SHALL contrôler le défilement automatique des slides dans la preview lorsque l’autoplay est activé.

#### Scenario: Activation de l’autoplay
- **WHEN** l’utilisateur active l’option Autoplay sur le NodeSlideshow
- **THEN** les slides défilent automatiquement après le délai configuré

#### Scenario: Désactivation de l’autoplay
- **WHEN** l’utilisateur désactive l’option Autoplay sur le NodeSlideshow
- **THEN** les slides ne défilent plus automatiquement

### Requirement: Slides visibles par breakpoint
Le nœud NodeSlideshow SHALL exposer une configuration du nombre de slides visibles selon le breakpoint courant :
- `desktop` (nombre entier >= 1)
- `tablet` (nombre entier >= 1)
- `mobile` (nombre entier >= 1)

Le nœud SHALL appliquer la valeur correspondant au breakpoint courant pour déterminer `slidesPerView` Swiper.

#### Scenario: Changement de breakpoint
- **WHEN** l’utilisateur sélectionne le breakpoint `mobile` dans l’interface du builder
- **THEN** Swiper affiche le nombre de slides configuré pour `mobile`

#### Scenario: Valeurs configurées persistantes
- **WHEN** l’utilisateur configure un nombre de slides visibles par breakpoint puis sauvegarde la page
- **THEN** les valeurs configurées sont restituées après rechargement et le rendu affiche le bon `slidesPerView` pour chaque breakpoint

### Requirement: Aspect ratio des images du diaporama
Le nœud NodeSlideshow SHALL exposer un champ `aspect-ratio` permettant d’influencer le ratio d’affichage des images.

Le nœud SHALL appliquer cet aspect ratio au conteneur de l’image afin que la hauteur du visuel suive le ratio choisi (sauf en mode `auto`).

#### Scenario: Aspect ratio preset
- **WHEN** l’utilisateur sélectionne un aspect ratio comme `16/9` ou `4/3`
- **THEN** la hauteur des slides s’ajuste pour respecter le ratio choisi et l’image remplit le conteneur via `object-fit: cover`

#### Scenario: Mode auto
- **WHEN** l’utilisateur sélectionne l’option `auto` pour `aspect-ratio`
- **THEN** le conteneur ne force pas un ratio fixe et le rendu suit la hauteur native (comportement par défaut)

### Requirement: Nœud texte riche (NodeRichText)

Le builder SHALL fournir un type de nœud **NodeRichText** (identifiant `node-rich-text`) permettant l’édition de texte riche sans saisie de HTML brut. Lorsque l’utilisateur **sélectionne** un `NodeRichText` dans le builder, le système SHALL ouvrir une **fenêtre modale** contenant l’éditeur visuel (WYSIWYG) complet. Dans le canevas, le nœud SHALL afficher un **aperçu** du contenu (sans éditeur inline contraint par la largeur du bloc). La modale SHALL offrir une largeur d’édition suffisante pour travailler confortablement (ex. largeur maximale adaptée à l’écran, zone de saisie scrollable si le contenu est long). La fermeture de la modale SHALL conserver le contenu déjà appliqué au nœud.

#### Scenario: Ajout d’un NodeRichText depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud texte riche (NodeRichText)
- **THEN** un nœud NodeRichText est inséré dans la page avec un contenu texte initial éditable

#### Scenario: Ouverture de la modale à la sélection
- **WHEN** l’utilisateur sélectionne un `NodeRichText` déjà présent dans le canevas
- **THEN** une modale s’ouvre avec l’éditeur WYSIWYG (barre d’outils et zone de saisie) ; le canevas affiche l’aperçu du contenu sans éditeur inline

#### Scenario: Fermeture de la modale
- **WHEN** l’utilisateur ferme la modale (bouton de fermeture, clic sur l’overlay ou touche Échap) après avoir modifié le texte
- **THEN** la modale se ferme, le contenu riche reste enregistré sur le nœud et l’aperçu dans le canevas reflète les modifications

### Requirement: Mise en forme riche de base

Le nœud NodeRichText SHALL exposer au minimum les actions de mise en forme suivantes dans l’éditeur de la modale : **gras**, **italique**, **souligné**, **barré**, **liste à puces**, **liste numérotée** et **lien**. Les actions SHALL s’appliquer à la sélection courante dans l’éditeur.

#### Scenario: Application d’un style inline
- **WHEN** l’utilisateur sélectionne un texte dans l’éditeur de la modale `NodeRichText` puis active une action inline (ex. gras ou italique)
- **THEN** la mise en forme est appliquée immédiatement au texte sélectionné dans l’éditeur et visible dans l’aperçu du canevas après fermeture ou mise à jour du nœud

#### Scenario: Création d’une liste
- **WHEN** l’utilisateur sélectionne un ou plusieurs paragraphes dans la modale et active une liste à puces ou numérotée
- **THEN** le contenu est transformé en liste correspondante dans le rendu du NodeRichText

#### Scenario: Insertion d’un lien
- **WHEN** l’utilisateur sélectionne du texte dans la modale puis renseigne une URL via l’action lien
- **THEN** le texte est rendu comme lien cliquable avec l’URL configurée

### Requirement: Persistance du contenu riche

Le builder SHALL sérialiser le contenu de NodeRichText dans le format de persistance existant de page et SHALL le restaurer de manière éditable lors du rechargement.

#### Scenario: Sauvegarde et rechargement du NodeRichText
- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeRichText
- **THEN** le contenu riche (structure et formats) est conservé et restitué à l’identique lors de la réouverture de la page

### Requirement: Conteneur formulaire (NodeForm)

Le builder SHALL fournir un type de nœud conteneur **NodeForm** (identifiant `node-form`) représentant un élément HTML `<form>`. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeForm SHALL exposer au minimum les propriétés configurables **method** (méthode HTTP, ex. `GET` ou `POST`) et **action** (URL absolue ou relative de soumission). Le NodeForm SHALL permettre de sélectionner une **configuration de formulaire** issue du **catalogue backend** de la capacité **builder-form-submission** (**formConfigId** ou équivalent) ; lorsque ce champ est renseigné, l’**action** SHALL être dérivée de l’**URL de soumission** fournie par ce catalogue et SHALL être **enregistrée** dans le contenu du nœud avec cette valeur résolue, afin que l’affichage public et l’export HTML ne dépendent pas d’un nouvel appel au catalogue au chargement de la page. Lorsqu’un **formConfigId** est défini, le rendu du `<form>` (preview, page publique, export) SHALL inclure les **champs et jetons** requis par la politique **antispam** du backend (au minimum un **honeypot** convenu avec le serveur, et tout jeton supplémentaire si activé), de sorte que la soumission **AJAX** existante via `FormData` satisfasse les contrôles décrits dans **builder-form-submission**. Lorsque aucune configuration n’est choisie, l’utilisateur SHALL pouvoir définir **action** manuellement et aucune exigence antispam backend ne s’applique via ce mécanisme. Le chargement du catalogue dans l’éditeur SHALL utiliser la **fonctionnalité backend dédiée** (pas le registre ApiCard). Le NodeForm SHALL soumettre le formulaire en **AJAX** via `fetch` lors du `submit` (interception de l’événement), et afficher un message d’alerte de retour (succès en fond vert, erreur en fond rouge) dans l’interface de l’éditeur. Le NodeForm SHALL autoriser comme descendants directs ou indirects : les nœuds **NodeFormInput**, **NodeFormSelect**, **NodeFormRadio**, les nœuds **NodeButton** (pour des actions comme "submit"), et les nœuds du builder dont la catégorie d’enregistrement est **container** (ex. NodeFlex, NodeGrid, NodeContainer), afin de permettre la mise en page à l’intérieur du formulaire. Le NodeForm SHALL refuser l’imbrication d’un second NodeForm en tant qu’enfant (formulaires non imbriqués).

#### Scenario: Ajout d’un NodeForm depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur formulaire (NodeForm)
- **THEN** un nœud NodeForm est inséré dans la page ; l’utilisateur peut définir method et action (manuelle ou via catalogue backend), et déposer des champs formulaire et des conteneurs de mise en page dans la zone du formulaire

#### Scenario: Composition avec conteneur interne

- **WHEN** l’utilisateur place un conteneur (ex. NodeFlex) à l’intérieur d’un NodeForm puis y dépose des NodeFormInput
- **THEN** la structure est acceptée par le builder et le rendu preview affiche le formulaire avec les champs à l’intérieur du conteneur

#### Scenario: Ajout d’un NodeButton dans un NodeForm

- **WHEN** l’utilisateur ajoute un bloc NodeButton à l’intérieur d’un NodeForm (directement ou via un conteneur interne)
- **THEN** le builder autorise l’insertion et la preview restitue le bouton dans le rendu HTML du formulaire ; si le NodeButton est configuré en mode `submit`, il est rendu comme un bouton `<button type="submit">`

#### Scenario: Champ formulaire refusé hors NodeForm

- **WHEN** l’utilisateur tente d’ajouter ou de déplacer un NodeFormInput, NodeFormSelect ou NodeFormRadio sous un parent qui n’est pas dans le sous-arbre d’un NodeForm
- **THEN** l’opération est refusée et le nœud ne peut pas y rester

#### Scenario: Persistance du NodeForm

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeForm avec method, action et enfants
- **THEN** le contenu sérialisé conserve ces propriétés et la hiérarchie afin de reproduire le même formulaire à l’affichage et à la réouverture de l’éditeur

#### Scenario: Soumission AJAX avec succès

- **WHEN** l’utilisateur soumet un NodeForm (via un bouton `submit`) et que la réponse HTTP est réussie (2xx) ou qu’un JSON retourne `{ success: true, message: "..." }`
- **THEN** un bandeau d’alerte est affiché avec un style de succès (fond vert) et le message de retour

#### Scenario: Soumission AJAX avec erreur

- **WHEN** l’utilisateur soumet un NodeForm (via un bouton `submit`) et que la réponse HTTP échoue (non-2xx) ou qu’un JSON retourne `{ success: false, message: "..." }`
- **THEN** un bandeau d’alerte est affiché avec un style d’erreur (fond rouge) et le message de retour

#### Scenario: Sélection d’une configuration via le catalogue backend

- **WHEN** l’utilisateur choisit une entrée du catalogue des formulaires configurés (appel backend dédié, hors ApiCard)
- **THEN** le NodeForm enregistre `formConfigId` et une propriété **action** égale à l’URL de soumission fournie pour cette configuration ; la soumission utilise cette URL sans rappel au catalogue côté affichage public

#### Scenario: Rendu des garde-fous antispam pour formulaire backend

- **WHEN** un NodeForm est associé à une configuration backend et affiché hors mode édition structuré uniquement (ex. prévisualisation ou page publique)
- **THEN** le DOM du formulaire inclut les éléments nécessaires au passage des contrôles antispam (honeypot et dépendances), sans casser l’accessibilité ni le flux `FormData` actuel

### Requirement: Champ saisie (NodeFormInput)

Le builder SHALL fournir un type de nœud **NodeFormInput** (identifiant `node-form-input`) rendu comme un champ de saisie unique avec libellé associé (ex. `<label>` lié au contrôle). Le nœud SHALL exposer au minimum : **name**, **label**, **type** de saisie parmi les types HTML usuels pour `<input>` (à minima `text`, `email`, `number`, `tel`, `password`, `hidden`), **placeholder** optionnel, **required** (booléen), **value** par défaut optionnel. Un NodeFormInput SHALL être placé uniquement dans le sous-arbre d’un NodeForm (éventuellement à travers un conteneur enfant).

#### Scenario: Configuration et rendu d’un champ texte

- **WHEN** l’utilisateur configure un NodeFormInput avec label, name et type `text`
- **THEN** le rendu preview affiche un libellé et un champ texte avec les attributs `name` et, si renseignés, `placeholder`, `required` et `value` par défaut

#### Scenario: Persistance du NodeFormInput

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFormInput
- **THEN** les propriétés du champ sont conservées et restituées à l’identique lors du rechargement

### Requirement: Liste déroulante (NodeFormSelect)

Le builder SHALL fournir un type de nœud **NodeFormSelect** (identifiant `node-form-select`) rendu comme un élément `<select>` avec options. Le nœud SHALL exposer au minimum : **name**, **label**, **options** (liste ordonnée de paires valeur / libellé affiché), **required** (booléen), et optionnellement une **valeur** ou option vide initiale (placeholder). Un NodeFormSelect SHALL être placé uniquement dans le sous-arbre d’un NodeForm.

#### Scenario: Configuration et rendu d’un select

- **WHEN** l’utilisateur configure un NodeFormSelect avec plusieurs options
- **THEN** le rendu preview affiche un libellé et une liste déroulante contenant une entrée par option avec les `value` attendues

#### Scenario: Persistance du NodeFormSelect

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeFormSelect
- **THEN** la liste d’options et les autres propriétés sont conservées et restituées à la réouverture

### Requirement: Groupe boutons radio (NodeFormRadio)

Le builder SHALL fournir un type de nœud **NodeFormRadio** (identifiant `node-form-radio`) représentant un groupe d’options exclusives : plusieurs entrées **value** / **label** partageant le même attribut **name**. Le nœud SHALL exposer au minimum : **name**, **label** du groupe, liste d’**options** (valeur et libellé par option), **required** (booléen) si au moins une option doit être choisie. Le rendu SHALL produire un ensemble de `<input type="radio">` avec le même `name` et des libellés associés. Un NodeFormRadio SHALL être placé uniquement dans le sous-arbre d’un NodeForm.

#### Scenario: Configuration et rendu d’un groupe radio

- **WHEN** l’utilisateur configure un NodeFormRadio avec name et au moins deux options
- **THEN** le rendu preview affiche le libellé du groupe et une option radio par entrée, toutes avec le même `name`

#### Scenario: Persistance du NodeFormRadio

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeFormRadio
- **THEN** les options et le name du groupe sont conservés et restitués à la réouverture

### Requirement: Nœud anniversaires (NodeAnniversaire) en catégorie custom
Le builder SHALL fournir un type de nœud **NodeAnniversaire** (identifiant `node-anniversaire`) visible dans le panneau de composants sous la catégorie **custom**. Le nœud SHALL être insérable comme un nœud de contenu standard, duplicable, supprimable et persistant dans le JSON du builder.

Le nœud SHALL exposer un panneau de configuration composé de quatre onglets:
- `general`
- `titre`
- `date`
- `anniversaires`

La structure persistée dans `node.content` SHALL suivre le contrat suivant:
- `node.content.container` (styles de la zone globale)
- `node.content.title` (texte et styles du titre)
- `node.content.day` (styles du bloc date)
- `node.content.anniversaires` (styles des lignes anniversaires)

L'onglet `general` SHALL permettre au minimum de styliser le `background`, la `margin` et le `padding` du conteneur global.

Les onglets `titre`, `date` et `anniversaires` SHALL permettre au minimum de styliser le `background`, la `margin`, le `padding` et les styles de texte de leur section respective.

Le titre SHALL être modifiable par l'utilisateur via l'onglet `titre` et sa valeur SHALL être persistée dans `node.content.title`.

#### Scenario: Ajout depuis la catégorie custom
- **WHEN** l'utilisateur ouvre le panneau des composants
- **THEN** une catégorie `custom` est affichée
- **AND** le bouton `NodeAnniversaire` est visible dans cette catégorie
- **AND** l'ajout crée un nœud `node-anniversaire` dans la page

#### Scenario: Affichage des onglets de settings
- **WHEN** l'utilisateur sélectionne un `node-anniversaire`
- **THEN** les onglets `general`, `titre`, `date`, `anniversaires` sont disponibles dans le panneau de settings
- **AND** chaque onglet expose les controles attendus pour sa section

#### Scenario: Persistance de la structure node.content
- **WHEN** l'utilisateur sauvegarde une page contenant un `node-anniversaire`
- **THEN** le JSON sauvegardé contient `node.content.container`, `node.content.title`, `node.content.day` et `node.content.anniversaires`
- **AND** ces donnees sont restaurees au rechargement de la page

### Requirement: Rendu de la liste anniversaires au format de référence
Le nœud **NodeAnniversaire** SHALL afficher une liste d'anniversaires de mariage au format éditorial de référence `https://api.charisma.fr/charisma/anniversaire/mariage` : sections par date (ex. `26/03`) et lignes de couples avec ancienneté (ex. `Michael et Rita BASS - 20 ans`).

Le rendu SHALL appliquer les styles configurés dans les onglets de settings:
- styles de `node.content.container` sur le conteneur global
- styles de `node.content.title` sur le bloc titre
- styles de `node.content.day` sur les libellés de date
- styles de `node.content.anniversaires` sur les lignes de personnes

Le rendu du titre SHALL utiliser la valeur éditée par l'utilisateur lorsqu'elle est renseignée.

#### Scenario: Données chargées avec succès
- **WHEN** le nœud charge les données de l'endpoint de référence
- **THEN** il affiche des groupes par date
- **AND** chaque groupe affiche les couples de la date avec le libellé d'ancienneté en années
- **AND** l'ordre des groupes et des lignes respecte l'ordre fourni par la source

#### Scenario: Application des styles configurés
- **WHEN** l'utilisateur modifie les styles dans un des onglets (`general`, `titre`, `date`, `anniversaires`)
- **THEN** la section correspondante est mise a jour dans le rendu du nœud
- **AND** la mise en forme est conservee en previsualisation et apres sauvegarde/rechargement

#### Scenario: Endpoint indisponible
- **WHEN** le chargement de la source échoue (timeout, erreur réseau, réponse invalide)
- **THEN** le nœud affiche un état de repli non bloquant
- **AND** l'éditeur reste fonctionnel sans erreur bloquante

### Requirement: Nœud vidéos home (NodeVideoHome) en catégorie custom
Le builder MUST proposer un nœud `NodeVideoHome` dans la catégorie custom pour afficher une sélection vidéo home.

#### Scenario: Ajout du nœud depuis le panneau
- **WHEN** l'utilisateur ouvre la catégorie custom du builder
- **THEN** le nœud `NodeVideoHome` est disponible
- **AND** l'insertion crée une structure de contenu compatible avec le rendu vidéo home

### Requirement: Source de données vidéos home distante
Le nœud `NodeVideoHome` MUST récupérer les vidéos depuis `https://api.charisma.fr/api/charisma/videos/homes` et utiliser exactement 7 vidéos pour le rendu de la section.

#### Scenario: Chargement de la liste vidéos home
- **WHEN** le nœud `NodeVideoHome` effectue le chargement des données
- **THEN** la source utilisée est `https://api.charisma.fr/api/charisma/videos/homes`
- **AND** 7 vidéos sont affichées dans la grille finale

### Requirement: Rendu des vidéos home en card vidéo type API
Le nœud `NodeVideoHome` MUST afficher chaque vidéo avec le même format de card vidéo que le rendu des vidéos API.

#### Scenario: Affichage homogène avec les cards vidéo API
- **WHEN** une vidéo home est rendue dans `NodeVideoHome`
- **THEN** son rendu visuel et sa structure de card correspondent au format `card video` déjà utilisé pour les vidéos API

### Requirement: Grille responsive imposée pour 7 vidéos home
Le nœud `NodeVideoHome` MUST appliquer la grille suivante:
- desktop: 3 colonnes sur 2 lignes, puis la 7e vidéo seule sur une 3e ligne occupant toute la largeur
- tablette: 2 colonnes sur 3 lignes, puis la 7e vidéo seule sur une 4e ligne occupant toute la largeur
- mobile: 1 colonne sur 7 lignes

#### Scenario: Rendu desktop
- **WHEN** la section est affichée en viewport desktop
- **THEN** les 6 premières vidéos occupent une grille `3x2`
- **AND** la 7e vidéo occupe la ligne suivante sur toute la largeur

#### Scenario: Rendu tablette
- **WHEN** la section est affichée en viewport tablette
- **THEN** les 6 premières vidéos occupent une grille `2x3`
- **AND** la 7e vidéo occupe la ligne suivante sur toute la largeur

#### Scenario: Rendu mobile
- **WHEN** la section est affichée en viewport mobile
- **THEN** les 7 vidéos sont affichées sur une seule colonne

### Requirement: Lecteur Video.js dans les modales vidéo Charisma

Les nœuds du builder qui ouvrent une modale de lecture pour une vidéo hébergée Charisma (`NodeVideoApi`, entrées `charisma` de `NodeVideoHome`, et `NodeVideo` lorsqu’une source est fournie) MUST utiliser **Video.js** comme lecteur dans la modale, à la place du lecteur HTML5 natif seul. Le lecteur SHALL conserver au minimum : lecture automatique à l’ouverture, contrôles utilisateur visibles, affichage du poster avant lecture, et fermeture de la modale sans fuite d’instance player (`dispose` à la fermeture).

#### Scenario: Ouverture modale NodeVideoApi en preview

- **WHEN** l’utilisateur consulte une page en mode preview ou rendu public contenant un `NodeVideoApi` avec `itemId` et `src` valides, et clique sur la card vidéo
- **THEN** une modale s’ouvre avec un lecteur Video.js initialisé sur la source vidéo et le poster configurés

#### Scenario: Fermeture modale sans fuite player

- **WHEN** l’utilisateur ferme la modale vidéo après lecture
- **THEN** l’instance Video.js est détruite (`dispose`) et une réouverture ultérieure recrée un lecteur fonctionnel

#### Scenario: NodeVideoHome YouTube inchangé

- **WHEN** l’utilisateur ouvre une vidéo home de type `youtube`
- **THEN** la modale affiche un lecteur embarqué (`iframe`) et SHALL NOT initialiser Video.js Charisma pour cette entrée

### Requirement: Bouton favori (cœur rouge) dans le player Video.js

Lorsqu’un identifiant média Charisma est disponible (`itemId` pour `NodeVideoApi`, `id` pour une entrée `charisma` de `NodeVideoHome`), le lecteur Video.js MUST afficher un bouton **favori** dans sa barre de contrôles, représenté par un **cœur rouge**. Au clic sur ce bouton, le système MUST envoyer une requête **`PUT`** vers `https://content.charisma.fr/api/media/{mediaId}/favori`, en substituant `{mediaId}` par l’identifiant média du contenu affiché. L’utilisateur MUST NOT pouvoir enregistrer plus d’**un favori par heure** pour un même média : après un like réussi ou un rejet API signalant la limite, le bouton SHALL rester désactivé jusqu’à expiration du délai d’une heure.

#### Scenario: Clic favori sur vidéo API

- **WHEN** un `NodeVideoApi` avec `itemId` « `abc123` » est lu en modale et l’utilisateur clique sur le bouton cœur rouge alors qu’aucun like n’a été enregistré pour ce média dans l’heure écoulée
- **THEN** le client envoie `PUT https://content.charisma.fr/api/media/abc123/favori` et désactive le bouton favori pour une heure

#### Scenario: Clic favori sur vidéo home Charisma

- **WHEN** une entrée `NodeVideoHome` de type `charisma` avec `id` « `xyz789` » est lue en modale et l’utilisateur clique sur le bouton cœur rouge alors qu’aucun like n’a été enregistré pour ce média dans l’heure écoulée
- **THEN** le client envoie `PUT https://content.charisma.fr/api/media/xyz789/favori` et désactive le bouton favori pour une heure

#### Scenario: Like déjà effectué dans l’heure

- **WHEN** l’utilisateur a déjà liké le média « `abc123` » il y a moins d’une heure (mémorisé côté client ou rejeté par l’API)
- **THEN** le bouton favori est désactivé et aucune nouvelle requête `PUT` n’est envoyée

#### Scenario: Absence d’identifiant média

- **WHEN** une modale vidéo est ouverte sans identifiant média Charisma (ex. `NodeVideo` avec fichier local uniquement)
- **THEN** le bouton favori n’est pas affiché dans la control bar Video.js

### Requirement: Compteur de lecture au play dans le player Video.js

Lorsqu’un identifiant média Charisma est disponible, le lecteur Video.js MUST envoyer une requête vers `https://content.charisma.fr/api/media/{mediaId}/compteur` au **premier démarrage effectif de la lecture** (événement `play`, y compris via autoplay à l’ouverture de la modale ou clic sur le bouton play). Cet appel SHALL être effectué **une seule fois par instance** de lecteur (ouverture de modale) : les reprises après pause ne MUST NOT déclencher de nouvel appel compteur.

#### Scenario: Lecture avec autoplay à l’ouverture modale

- **WHEN** un `NodeVideoApi` avec `itemId` « `abc123` » ouvre sa modale avec lecture automatique
- **THEN** le client envoie une requête vers `https://content.charisma.fr/api/media/abc123/compteur` une fois au démarrage de la lecture

#### Scenario: Lecture après clic play

- **WHEN** l’utilisateur ouvre une modale vidéo Charisma sans autoplay et clique sur le bouton play du lecteur Video.js
- **THEN** le client envoie une requête vers `https://content.charisma.fr/api/media/{mediaId}/compteur` une fois au premier `play`

#### Scenario: Reprise après pause

- **WHEN** l’utilisateur met la vidéo en pause puis relance la lecture dans la même modale
- **THEN** aucune nouvelle requête compteur n’est envoyée

#### Scenario: Absence d’identifiant média

- **WHEN** une modale vidéo est ouverte sans identifiant média Charisma
- **THEN** aucun appel compteur n’est effectué

### Requirement: Rendu statique — attributs et script modale vidéo

Le HTML statique généré pour les pages publiées contenant des cards vidéo Charisma identifiées MUST exposer, sur l’élément déclencheur de la modale, les attributs `data-video-src`, `data-video-poster` et, lorsque applicable, `data-media-id`. Le script de modale vidéo inclus dans le rendu public MUST initialiser Video.js (bouton favori et compteur play lorsque `data-media-id` est présent) au lieu d’un élément `<video>` natif seul.

#### Scenario: Page publiée avec NodeVideoApi

- **WHEN** une page est rendue en HTML statique avec un `NodeVideoApi` possédant `itemId` et une source vidéo
- **THEN** le déclencheur modale porte `data-media-id` égal à `itemId` et l’ouverture utilise Video.js avec le bouton favori et le compteur play

#### Scenario: Page publiée sans identifiant média

- **WHEN** une page est rendue avec une card vidéo sans `data-media-id`
- **THEN** l’ouverture modale utilise Video.js sans bouton favori

### Requirement: Nœud PureMusic Top Semaine (NodePureMusicTopSemaine) en catégorie custom
Le builder MUST proposer un nœud `NodePureMusicTopSemaine` dans la catégorie `custom` afin d'afficher le classement hebdomadaire PureMusic.

Le nœud MUST être insérable, duplicable, supprimable et persistant dans le JSON du builder.

#### Scenario: Ajout du nœud depuis le panneau
- **WHEN** l'utilisateur ouvre la catégorie `custom` du builder
- **THEN** le nœud `NodePureMusicTopSemaine` est disponible
- **AND** l'insertion crée une structure de contenu compatible avec le rendu "top semaine"

### Requirement: Source de données hebdomadaire PureMusic distante
Le nœud `NodePureMusicTopSemaine` MUST charger les données depuis l'endpoint `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`.

Le nœud MUST consommer la collection renvoyée dans `member` et utiliser les champs nécessaires au rendu (au minimum: `titre`, `album.name`, `album.artiste.nom`, `album.vignette`, `source`).

#### Scenario: Chargement de la liste hebdomadaire
- **WHEN** le nœud `NodePureMusicTopSemaine` effectue le chargement des données
- **THEN** la source utilisée est `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`
- **AND** les éléments de `member` sont mappés dans la liste rendue du nœud

### Requirement: Rendu conforme à la page de référence PureMusic Top Semaine
Le nœud `NodePureMusicTopSemaine` MUST reproduire la structure visuelle et éditoriale de référence de `https://api.charisma.fr/puremusic/tops/semaine` (section "top semaine"), en utilisant les données de l'endpoint API hebdomadaire.

Le rendu MUST conserver l'ordre de la collection retournée par l'API.

#### Scenario: Affichage de la liste au format de référence
- **WHEN** les données hebdomadaires sont chargées avec succès
- **THEN** chaque entrée est affichée avec le même format de card/liste que la page de référence "top semaine"
- **AND** l'ordre des entrées respecte l'ordre renvoyé par l'API

### Requirement: Résilience en cas d'indisponibilité de l'API PureMusic
Le nœud `NodePureMusicTopSemaine` MUST afficher un état de repli non bloquant en cas d'échec de chargement (erreur réseau, timeout, réponse invalide).

L'éditeur MUST rester utilisable sans erreur bloquante.

#### Scenario: Endpoint indisponible
- **WHEN** le chargement de `https://api.charisma.fr/api/puremusic/musiques/tops/semaine` échoue
- **THEN** le nœud affiche un état de repli
- **AND** le reste de l'éditeur continue de fonctionner normalement

### Requirement: Nœud bouton retour en haut (NodeTopButton)
Le builder SHALL fournir un type de nœud **NodeTopButton** (identifiant `node-top-button`) permettant de remonter la page en haut lors d'un clic utilisateur.

Le nœud SHALL afficher un bouton comportant une icône directionnelle (retour en haut) et SHALL exposer dans ses paramètres de style au minimum:
- la couleur de fond du bouton
- la couleur de l'icône
- la bordure (épaisseur/style/couleur)

Un `NodeTopButton` SHALL pouvoir être ajouté uniquement comme enfant direct de **NodeRoot** et SHALL être refusé sous tout autre parent.

Le comportement de retour en haut SHALL être disponible dans l'éditeur, la preview et le rendu final.

#### Scenario: Ajout du NodeTopButton depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeTopButton`
- **AND** la cible d'insertion est `NodeRoot`
- **THEN** un nœud `node-top-button` est inséré dans la page avec un style par défaut et une icône visible

#### Scenario: Refus d'ajout hors NodeRoot
- **WHEN** l'utilisateur tente d'ajouter ou de déplacer un `NodeTopButton` sous un parent différent de `NodeRoot`
- **THEN** l'opération est refusée et le nœud ne peut pas y rester

#### Scenario: Clic sur le bouton pour remonter la page
- **WHEN** l'utilisateur clique sur le NodeTopButton dans une page avec un scroll vertical
- **THEN** la vue remonte vers le haut de la page

#### Scenario: Stylisation du bouton
- **WHEN** l'utilisateur modifie la couleur de fond, la couleur de l'icône ou la bordure du NodeTopButton dans les settings
- **THEN** le rendu du bouton est mis à jour immédiatement avec ces styles dans l'éditeur et en preview
- **AND** le rendu final de la page applique les mêmes styles

#### Scenario: Persistance du NodeTopButton
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeTopButton stylisés
- **THEN** les propriétés de style et le comportement du nœud sont conservés et restitués au rechargement

### Requirement: Indicateur de lecture sur les blocs vidéo du builder

Les nœuds du builder qui affichent une vidéo derrière une image poster (notamment `NodeVideo`, `NodeVideoApi`, et les cards vidéo utilisées par `NodeVideoHome`) MUST superposer une pastille de lecture clairement reconnaissable, distincte du poster, pour signaler qu’une action utilisateur peut lancer la lecture. La pastille MUST s’appuyer sur l’asset statique `/assets/icons/play2.svg` (rendu via balise image ou équivalent produisant le même résultat visuel), de sorte que le disque de fond et le glyphe play proviennent du fichier SVG sans les aplatir en masque monochrome sur un seul `background-color`.

#### Scenario: Vidéo avec poster en mode affichage

- **WHEN** un bloc vidéo avec poster est rendu hors mode édition (ou équivalent « prévisualisation publique »)
- **THEN** une pastille centrée utilisant `play2.svg` est visible au-dessus du poster
- **AND** le marquage structurel (classes `ce-video-icon-player`, `ce-video-icon-player-inner`, `ce-video-icon-player-img` ou équivalent documenté) reste stable pour le thème et les overrides CSS

#### Scenario: Cohérence multi-nœuds

- **WHEN** plusieurs types de nœuds réutilisent la même pastille (ex. `NodeVideo`, `NodeVideoApi`, grilles `NodeVideoHome`)
- **THEN** ils partagent le même composant ou le même markup et la même feuille de style de base pour l’indicateur, afin d’éviter les divergences visuelles

### Requirement: Nœud texte avec icône (NodeTextIcon)
Le builder SHALL fournir un type de nœud **NodeTextIcon** (identifiant `node-text-icon`) fonctionnellement aligné avec **NodeText** pour l'édition du texte, et enrichi par une icône optionnelle associée au texte.

Le nœud SHALL permettre de configurer:
- la présence d'une icône optionnelle,
- la position de l'icône **avant** ou **après** le texte,
- un lien cliquable appliqué au texte,
- l'alignement horizontal et vertical du contenu du nœud,
- la taille de l'icône.

#### Scenario: Ajout d'un NodeTextIcon depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeTextIcon`
- **THEN** un nœud `node-text-icon` est inséré avec un texte éditable par défaut, similaire à `NodeText`
- **AND** l'icône est optionnelle et non bloquante si non configurée

#### Scenario: Positionnement de l'icône avant ou après le texte
- **WHEN** l'utilisateur configure la position de l'icône sur `before`
- **THEN** l'icône est rendue avant le texte
- **WHEN** l'utilisateur configure la position de l'icône sur `after`
- **THEN** l'icône est rendue après le texte

#### Scenario: Lien cliquable sur le texte
- **WHEN** l'utilisateur renseigne une URL de lien dans les paramètres du `NodeTextIcon`
- **THEN** le texte est rendu comme un élément cliquable pointant vers cette URL
- **AND** le comportement est visible en preview et dans le rendu final

#### Scenario: Alignements horizontal et vertical
- **WHEN** l'utilisateur modifie l'alignement horizontal et/ou vertical dans les paramètres du `NodeTextIcon`
- **THEN** le contenu texte+icône s'aligne selon les valeurs choisies dans l'éditeur, la preview et le rendu final

#### Scenario: Taille de l'icône
- **WHEN** l'utilisateur modifie la taille de l'icône dans les paramètres du `NodeTextIcon`
- **THEN** l'icône est rendue à la taille configurée, sans altérer l'éditabilité du texte

#### Scenario: Persistance du NodeTextIcon
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs `NodeTextIcon`
- **THEN** les propriétés du nœud (texte, icône, position avant/après, lien, alignements, taille d'icône) sont sérialisées et restaurées à l'identique lors du rechargement


### Requirement: Menu de navigation piloté par API (NodeNavApi)

Le builder SHALL fournir un type de nœud **NodeNavApi** (identifiant `node-nav-api`) qui affiche un menu de navigation alimenté par une **ApiListArticle** (voir capacité `node-list-api-apilist-base`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection complète via `GET /api/page-builder/lists/{apiId}/items` (sans paramètres de pagination) et SHALL rendre chaque item mappé comme un lien (`title` → libellé, `link` → `href`). Le nœud SHALL exposer une option **target** (`_self` ou `_blank`) appliquée à tous les liens du menu ; cette option SHALL être configurée côté **NodeNavApi** et ne SHALL pas dépendre du mapping ApiListArticle. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants **NodeNavItem** : les entrées proviennent uniquement de l'API.

Le NodeNavApi SHALL exposer dans ses réglages **page** (entier ≥ 1) et **itemsPerPage** (10, 20 ou 30) pour limiter le nombre de liens **affichés** à partir de la collection chargée. Lorsque `itemsPerPage` est absent, le nœud SHALL afficher tous les items de la collection (rétrocompatibilité). Le découpage SHALL s'appliquer localement : `items affichés = collection.slice((page - 1) * itemsPerPage, page * itemsPerPage)`.

Le NodeNavApi SHALL réutiliser les options de présentation du **NodeNav** : **direction** (horizontal, vertical), **variante** (`navbar`, `liste`) avec hooks DOM (`data-ce-variant`, classe `ce-menu--{variant}` sur le conteneur `<nav>`), **icône burger** (booléen) pour regrouper les liens sur petit viewport, ainsi que les réglages d'alignement et d'espacement équivalents (ex. `justify`, `gap`) lorsqu'ils sont supportés par **NodeNav**. Le NodeNavApi SHALL exposer une option **scrollWithoutScrollbar** (défilement sans barre visible) : lorsqu'elle est activée, les liens dépassant la largeur (ou la hauteur en mode vertical) SHALL être scrollables à la souris (molette, trackpad) et au tactile, sans afficher de barre de défilement.

#### Scenario: Ajout d'un NodeNavApi depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc menu API (NodeNavApi) depuis le panneau des composants
- **THEN** un nœud `node-nav-api` est inséré ; l'utilisateur peut choisir une ApiListArticle dans les réglages ; aucun enfant manuel n'est attendu

#### Scenario: Sélection d'une API list

- **WHEN** l'utilisateur ouvre les réglages du NodeNavApi et choisit une API
- **THEN** les sources exposées par `/api/page-builder/lists` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des liens depuis la collection

- **WHEN** le NodeNavApi a un `apiId` valide et que l'endpoint collection retourne des items mappés
- **THEN** le builder affiche un `<nav>` contenant un lien par item (`<a href="…">` avec le libellé `title`) dans l'éditeur, la prévisualisation et le rendu exporté

#### Scenario: Limitation d'affichage par page et itemsPerPage

- **WHEN** l'utilisateur configure `page = 2` et `itemsPerPage = 10` sur un NodeNavApi dont la collection contient 25 items
- **THEN** le nœud affiche uniquement les items 11 à 20, sans nouvel appel backend

#### Scenario: Rétrocompatibilité sans itemsPerPage

- **WHEN** un NodeNavApi existant n'a pas de `content.itemsPerPage` persisté
- **THEN** le nœud affiche tous les items de la collection, comme avant ce changement

#### Scenario: Option target appliquée à tous les liens

- **WHEN** l'utilisateur configure l'option **target** du NodeNavApi sur `_blank`
- **THEN** tous les liens rendus depuis la collection API utilisent `target="_blank"` (et `rel="noopener noreferrer"`) quel que soit le contenu mappé par l'ApiListArticle

#### Scenario: Options direction et variante

- **WHEN** l'utilisateur modifie la direction ou la variante (`navbar` / `liste`) du NodeNavApi
- **THEN** le rendu applique les mêmes conventions DOM que **NodeNav** (`data-ce-variant`, `ce-menu--{variant}`) pour permettre le styling CSS thème

#### Scenario: Défilement sans barre de scroll

- **WHEN** l'utilisateur active l'option de défilement sans barre sur un NodeNavApi horizontal contenant plus de liens que la largeur disponible
- **THEN** le menu permet de faire défiler les liens à la molette ou au glissement tactile sans afficher de scrollbar ; en mode vertical, le défilement suit l'axe vertical

#### Scenario: Menu burger sur petit viewport

- **WHEN** l'utilisateur active l'option burger sur un NodeNavApi
- **THEN** sur viewport tablette/mobile (selon les mêmes règles que **NodeNav**), une icône burger permet d'afficher ou masquer la liste des liens issus de l'API

#### Scenario: API indisponible ou vide

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeNavApi affiche un état dégradé (menu vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeNavApi

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeNavApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, `page`, `itemsPerPage`, les options de présentation (direction, variante, burger, etc.) et permet de recharger le menu à l'affichage

### Requirement: Liste d'items pilotée par API (NodeListApi)

Le builder SHALL fournir un type de nœud **NodeListApi** (identifiant `node-list-api`) qui affiche une liste d'items alimentée par une **ApiListArticle** (voir capacité `node-list-api-apilist-base`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection complète via `GET /api/page-builder/lists/{apiId}/items` (sans paramètres de pagination) et SHALL rendre chaque item mappé dans une structure de liste. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants : les entrées proviennent uniquement de l'API.

Le NodeListApi SHALL exposer dans ses réglages **page** (entier ≥ 1) et **itemsPerPage** (10, 20 ou 30) pour limiter le nombre d'éléments **affichés** à partir de la collection chargée. Lorsque `itemsPerPage` est absent, le nœud SHALL afficher tous les items de la collection (rétrocompatibilité). Le découpage SHALL s'appliquer localement : `items affichés = collection.slice((page - 1) * itemsPerPage, page * itemsPerPage)`.

Pour chaque item, le nœud SHALL pouvoir afficher optionnellement **titre**, **description**, **compteur** et **like**, contrôlés par `content.show.title`, `content.show.description`, `content.show.counter` et `content.show.like`. Le nœud SHALL **ne pas** afficher d'image, y compris via le champ `image` du mapping ApiListArticle ou des balises `<img>` dans le contenu HTML. Lorsqu'un toggle `show` est activé mais que le champ correspondant est absent dans l'item mappé, le nœud SHALL omettre cet élément sans réserver d'espace vide. Lorsqu'un toggle `show` est désactivé, le nœud SHALL ne pas rendre cet élément quel que soit le contenu mappé.

Le NodeListApi SHALL exposer des réglages de style par sous-partie (conteneur liste, item, titre, description, compteur, like) et SHALL utiliser des hooks DOM (`ce-list-api`, `ce-list-api-item`, et classes dérivées par sous-partie) pour le ciblage CSS thème. Si l'item mappé fournit un `link`, le nœud SHALL permettre une navigation vers cette URL (comportement aligné sur **NodeCardApi** pour les zones cliquables).

#### Scenario: Ajout d'un NodeListApi depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc liste API (NodeListApi) depuis le panneau des composants
- **THEN** un nœud `node-list-api` est inséré ; l'utilisateur peut choisir une ApiListArticle dans les réglages ; aucun enfant manuel n'est attendu

#### Scenario: Sélection d'une API éligible

- **WHEN** l'utilisateur ouvre les réglages du NodeListApi et choisit une API
- **THEN** les sources exposées par `/api/page-builder/lists` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des items depuis la collection

- **WHEN** le NodeListApi a un `apiId` valide et que l'endpoint collection retourne des items mappés
- **THEN** le builder affiche une liste contenant un item par entrée de la collection dans l'éditeur, la prévisualisation et le rendu exporté

#### Scenario: Limitation d'affichage par page et itemsPerPage

- **WHEN** l'utilisateur configure `page = 1` et `itemsPerPage = 20` sur un NodeListApi dont la collection contient 50 items
- **THEN** le nœud affiche uniquement les 20 premiers items, sans nouvel appel backend

#### Scenario: Rétrocompatibilité sans itemsPerPage

- **WHEN** un NodeListApi existant n'a pas de `content.itemsPerPage` persisté
- **THEN** le nœud affiche tous les items de la collection, comme avant ce changement

#### Scenario: Affichage conditionnel titre, description, compteur et like

- **WHEN** l'utilisateur active `show.title`, `show.description`, `show.counter` et `show.like` et que l'item mappé contient ces champs
- **THEN** chaque item de la liste affiche le titre, la description, le compteur et le like correspondants, sans image

#### Scenario: Champ absent dans l'item mappé

- **WHEN** `show.counter` est activé mais que l'item mappé ne fournit pas de `counter`
- **THEN** le compteur n'est pas rendu pour cet item et aucun placeholder vide n'est affiché

#### Scenario: Toggle show désactivé

- **WHEN** l'utilisateur désactive `show.description`
- **THEN** la description n'est pas rendue pour aucun item de la liste, même si présente dans le mapping ApiListArticle

#### Scenario: Lien sur item

- **WHEN** un item mappé fournit un `link` valide
- **THEN** le rendu expose une zone ou un wrapper cliquable menant vers cette URL (comportement cohérent avec les cards API existantes)

#### Scenario: API indisponible ou collection vide

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeListApi affiche un état dégradé (liste vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeListApi

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeListApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, `page`, `itemsPerPage`, les toggles `show` et les styles configurés, et permet de recharger la liste à l'affichage

### Requirement: NodeListApi mode fixe ou dynamique

Le nœud `NodeListApi` SHALL supporter deux modes de contenu : `fixed` (défaut) et `dynamic`.

#### Scenario: Nœud existant sans listMode

- **WHEN** un nœud `NodeListApi` n'a pas de champ `content.listMode`
- **THEN** il SHALL se comporter comme en mode `fixed` (sélection d'une `ApiListArticle` via `apiId`)

#### Scenario: Bascule vers mode dynamique

- **WHEN** l'éditeur sélectionne le mode `dynamic` dans les réglages
- **THEN** le sélecteur d'API fixe SHALL être remplacé par une interface de composition d'items individuels
- **AND** les items SHALL être stockés dans `content.dynamicItems` sous la forme `{ id, type }`

#### Scenario: Tri des items dynamiques

- **WHEN** l'éditeur réordonne les items en mode dynamique
- **THEN** l'ordre dans `content.dynamicItems` SHALL refléter l'ordre d'affichage

### Requirement: Résolution des items dynamiques

Le backend SHALL exposer `POST /api/page-builder/lists/dynamic/resolve` acceptant `{ entries: [{ id, type }, ...] }` et retournant les items mappés dans le même ordre (items introuvables omis).

#### Scenario: Items multi-sources

- **WHEN** les entrées référencent des sources `type` différentes
- **THEN** chaque item SHALL être résolu via la source correspondante
- **AND** la réponse SHALL contenir les champs attendus par NodeListApi (`id`, `title`, `description`, `counter`, `like`, `link`)

#### Scenario: Affichage paginé en mode dynamique

- **WHEN** le nœud est en mode `dynamic` avec `page` et `itemsPerPage` configurés
- **THEN** la pagination d'affichage SHALL s'appliquer sur la liste résolue côté frontend

### Requirement: Navigateur de composants en arbre

En mode édition, le builder SHALL exposer un **navigateur de composants** affichant la hiérarchie des nœuds de la page sous forme d’**arbre** (structure parent/enfant analogue à un arbre DOM). Le navigateur SHALL être accessible depuis la **sidebar gauche** (onglet ou section dédiée, distincte de la bibliothèque de blocs). Il SHALL partir du nœud racine de la page (`node-root`) et SHALL lister récursivement les descendants selon les relations `parent` des `NodesType`, y compris lorsque les enfants sont répartis dans **plusieurs zones** de dépôt d’un même conteneur (ex. cellules de grille).

Chaque entrée de l’arbre SHALL afficher un libellé lisible. Lorsqu’un **nom personnalisé** (`editorLabel`) est défini sur le nœud, il SHALL être affiché en priorité, avec le libellé de type (registre `NodeRegistry`) indiqué de façon secondaire (ex. entre parenthèses). À défaut de nom personnalisé, le libellé SHALL être dérivé du type de nœud (libellé du registre `NodeRegistry` lorsqu’il est défini) ou, le cas échéant, d’un libellé de contenu pertinent (ex. `NodeNavItem`). Les nœuds conteneurs SHALL pouvoir être **repliés ou dépliés** pour parcourir la structure.

Chaque entrée de l’arbre (sauf `node-root`) SHALL afficher une **icône œil** permettant de basculer la visibilité du nœud (`hidden`). L’icône SHALL refléter l’état de visibilité effective : œil ouvert si visible, œil barré si effectivement masqué. Un clic sur l’icône SHALL basculer `hidden` sur le nœud correspondant **sans** déclencher la sélection de ce nœud. Les entrées effectivement masquées SHALL être visuellement distinguées (ex. opacité réduite).

#### Scenario: Affichage de l’arbre en mode édition

- **WHEN** l’utilisateur ouvre le builder en mode édition et consulte le navigateur de composants
- **THEN** la hiérarchie des nœuds de la page courante est affichée en arbre à partir de `node-root`
- **AND** les nœuds imbriqués apparaissent comme enfants de leur conteneur parent

#### Scenario: Enfants dans plusieurs zones

- **WHEN** un conteneur possède des enfants dans plus d’une zone (ex. grille `NodeGrid` avec cellules `cell-*`)
- **THEN** l’arbre regroupe ou identifie ces enfants sous leur zone respective afin de refléter la structure réelle de la page

#### Scenario: Repli et dépli des conteneurs

- **WHEN** l’utilisateur replie un nœud conteneur dans le navigateur
- **THEN** les descendants de ce conteneur ne sont plus visibles jusqu’au dépli

#### Scenario: Nom personnalisé affiché dans l’arbre

- **WHEN** un nœud possède un `editorLabel` non vide
- **THEN** l’entrée correspondante dans le navigateur affiche ce nom en priorité
- **AND** le libellé de type du nœud reste identifiable (ex. entre parenthèses)

#### Scenario: Bascule de visibilité depuis l’icône œil

- **WHEN** l’utilisateur clique sur l’icône œil d’une entrée du navigateur (hors `node-root`)
- **THEN** la propriété `hidden` du nœud correspondant est inversée
- **AND** le nœud n’est pas sélectionné par ce clic
- **AND** l’icône et le style de la ligne reflètent immédiatement le nouvel état de visibilité

#### Scenario: Icône œil absente sur la racine

- **WHEN** l’utilisateur consulte l’entrée `node-root` dans le navigateur
- **THEN** aucune icône œil n’est affichée pour cette entrée

### Requirement: Visibilité des nœuds

Le builder SHALL permettre de **masquer** un nœud sans le supprimer, via une propriété optionnelle `hidden` (booléen) sur `NodeType`. Par défaut (`hidden` absent ou `false`), le nœud est visible.

Un nœud est **effectivement masqué** si `hidden === true` sur ce nœud ou sur **l’un de ses ancêtres**. Le masquage d’un conteneur SHALL masquer implicitement tout son sous-arbre à l’affichage, sans modifier le flag `hidden` des descendants en base.

Le nœud racine (`node-root`) SHALL **ne pas** pouvoir être masqué.

En modes **édition** (`edit`), **prévisualisation** (`preview`), **vue** (`view`) et **rendu public**, un nœud effectivement masqué SHALL **ne pas être rendu** sur le canevas (aucun HTML de ce nœud ni de ses descendants), afin que le mode édition reflète fidèlement la prévisualisation.

En mode **édition**, un nœud effectivement masqué SHALL rester présent dans le navigateur Structure (avec icône œil barré et style atténué) afin de permettre sa réactivation et l’accès à ses réglages via la sélection dans l’arbre.

La propriété `hidden` SHALL être **persistée** dans le JSON de la page à la sauvegarde et **restaurée** au rechargement.

#### Scenario: Masquage d’un nœud feuille

- **WHEN** l’utilisateur masque un nœud feuille (ex. `NodeText`) depuis le navigateur Structure
- **THEN** ce nœud possède `hidden: true` dans l’état du builder
- **AND** il n’apparaît plus sur le canevas en mode édition ni en prévisualisation ni en rendu public
- **AND** il reste visible dans le navigateur Structure

#### Scenario: Masquage d’un conteneur et de ses enfants

- **WHEN** l’utilisateur masque un conteneur (ex. `NodeFlex`, `NodeGrid`)
- **THEN** le conteneur et tous ses descendants sont effectivement masqués à l’affichage sur le canevas
- **AND** les enfants conservent leur propre valeur `hidden` en base (non modifiée)

#### Scenario: Réactivation d’un nœud masqué

- **WHEN** l’utilisateur réactive un nœud précédemment masqué (`hidden: false` ou propriété retirée)
- **THEN** le nœud redevient visible sur le canevas et en prévisualisation
- **AND** ses descendants masqués individuellement (`hidden: true`) restent masqués

#### Scenario: Enfant masqué individuellement sous parent visible

- **WHEN** un parent est visible et un enfant possède `hidden: true`
- **THEN** seul l’enfant (et ses descendants) est masqué à l’affichage

#### Scenario: Impossibilité de masquer la racine

- **WHEN** l’utilisateur consulte l’entrée `node-root` dans le navigateur Structure
- **THEN** aucun contrôle de masquage n’est proposé pour ce nœud

#### Scenario: Persistance du masquage

- **WHEN** l’utilisateur sauvegarde une page contenant des nœuds masqués puis la rouvre
- **THEN** les nœuds masqués conservent `hidden: true`
- **AND** leur visibilité effective est identique à avant sauvegarde

### Requirement: Sélection d’un nœud depuis le navigateur

Un clic sur une entrée du navigateur de composants SHALL **sélectionner** le nœud correspondant dans le builder (même mécanisme que la sélection sur le canevas : `setSelected`). Lorsqu’un nœud est sélectionné depuis le navigateur, le panneau de réglages (**NodeSettings**, sidebar droite) SHALL afficher les paramètres de ce nœud, comme pour une sélection directe sur le canevas.

#### Scenario: Clic sur un nœud dans l’arbre

- **WHEN** l’utilisateur clique sur une entrée du navigateur correspondant à un nœud éditable
- **THEN** ce nœud devient le nœud sélectionné du builder
- **AND** le panneau NodeSettings affiche les réglages de ce nœud

#### Scenario: Clic sur un conteneur parent

- **WHEN** l’utilisateur clique sur l’entrée d’un conteneur (ex. `NodeFlex`, `NodeGrid`)
- **THEN** le conteneur est sélectionné et ses réglages sont affichés dans NodeSettings

### Requirement: Synchronisation navigateur et canevas

La sélection effectuée **depuis le canevas** (clic sur un bloc dans la page) SHALL être **reflétée** dans le navigateur : l’entrée correspondante SHALL être visuellement distinguée (état actif / surbrillance). Le navigateur SHALL déplier automatiquement les ancêtres du nœud sélectionné afin que l’entrée active reste accessible sans navigation manuelle exhaustive.

#### Scenario: Sélection depuis le canevas

- **WHEN** l’utilisateur sélectionne un nœud en cliquant sur le canevas
- **THEN** l’entrée correspondante est mise en surbrillance dans le navigateur de composants
- **AND** les conteneurs parents sur le chemin vers ce nœud sont dépliés si nécessaire

### Requirement: Organisation du module ManagerExplorer

Le code source du **navigateur de composants** (Explorer) SHALL être regroupé sous `assets/editeur/ManagerExplorer/`, sur le modèle du module `ManagerNode`. Ce dossier SHALL contenir au minimum le composant principal `Explorer`, les composants UI spécifiques au navigateur (ex. zones de dépôt dans l’arbre) et les utilitaires dédiés à la construction de l’arbre et à la synchronisation avec le canevas (`explorerTree`, `scrollCanvasToNode`). Les utilitaires partagés avec d’autres domaines du builder (ex. libellés de nœuds via `nodeLabel`) MAY rester dans `assets/editeur/utils/`.

Le point d’entrée public du module SHALL être exposé via `ManagerExplorer/index.ts` pour les consommateurs (ex. `Builder.tsx`).

#### Scenario: Localisation du code Explorer

- **WHEN** un développeur cherche l’implémentation du navigateur de composants
- **THEN** les fichiers UI et utilitaires propres à l’Explorer se trouvent sous `assets/editeur/ManagerExplorer/` et non sous `app/layout/` ni dans `utils/` (hors dépendances partagées)

#### Scenario: Import depuis le builder

- **WHEN** le builder intègre le navigateur dans la sidebar gauche
- **THEN** il importe le composant `Explorer` depuis `ManagerExplorer` (point d’entrée public du module)

### Requirement: Mise en page preview sans chevauchement d’en-têtes (standalone)

Lorsque le builder est monté dans la page standalone (`pageBuilderStandalone.jsx`, route builder dédiée), le système SHALL afficher deux barres distinctes et non superposées : l’en-tête applicatif (navigation Retour, titre de page, action Enregistrer) et la barre d’outils du builder (`Layout.Header` : bascule Édition/Prévisualisation, plein écran, thème, undo/redo, breakpoints). En mode prévisualisation, le défilement du contenu de la page SHALL être confiné au canevas (`admin-layout__main`) ; la barre d’outils du builder SHALL rester visible et interactive pendant tout le défilement, y compris lorsque l’utilisateur atteint le bas d’une page longue.

#### Scenario: Défilement en bas de page en prévisualisation standalone

- **WHEN** l’utilisateur ouvre le builder standalone, bascule en mode prévisualisation et fait défiler une page longue jusqu’en bas
- **THEN** l’en-tête applicatif (Retour / Enregistrer) reste visible en haut de la fenêtre
- **AND** la barre d’outils du builder (`Layout.Header`) reste visible sous l’en-tête applicatif, sans être recouverte par celui-ci
- **AND** l’utilisateur peut cliquer sur le bouton de retour en mode édition sans recharger la page

#### Scenario: Une seule zone de défilement vertical en preview

- **WHEN** l’utilisateur est en mode prévisualisation sur la page standalone et fait défiler le contenu
- **THEN** seul le canevas de prévisualisation défile verticalement
- **AND** ni l’en-tête applicatif ni la barre d’outils du builder ne défilent hors de la zone visible à cause d’un conteneur parent scrollable

#### Scenario: Hauteur du builder adaptée au shell standalone

- **WHEN** le builder est monté dans le shell standalone sous l’en-tête applicatif
- **THEN** le layout builder occupe la hauteur disponible restante (sans imposer `100vh` au-delà de l’espace alloué)
- **AND** aucune barre de défilement superflue n’apparaît sur le conteneur englobant du builder en l’absence de contenu dépassant la hauteur utile

### Requirement: Nœud icône seule (NodeIcone)
Le builder SHALL fournir un type de nœud **NodeIcone** (identifiant `node-icone`) affichant une icône seule, sans bloc texte éditable. Le nœud SHALL réutiliser le même modèle de rendu d'icône que **NodeTextIcon** (balise `<i>` avec classes `ce-icon`, presets intégrés, icône du thème ou image).

Le nœud SHALL permettre de configurer:
- la source de l'icône (**preset**, **theme** ou **image**),
- la taille de l'icône (`default`, `small`, `large`),
- l'alignement horizontal et vertical de l'icône dans son conteneur,
- un lien cliquable optionnel appliqué à l'icône,
- les styles du conteneur et de l'élément icône (marge, padding, fond, bordure, couleur).

Le nœud SHALL **ne pas** exposer d'édition de texte HTML ni les options propres au couplage texte+icône (balise de texte, position avant/après le texte, styles texte).

#### Scenario: Ajout d'un NodeIcone depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeIcone`
- **THEN** un nœud `node-icone` est inséré avec une icône preset par défaut
- **AND** aucun champ texte éditable n'est affiché dans le canvas

#### Scenario: Source d'icône preset, thème ou image
- **WHEN** l'utilisateur configure la source sur `preset` et choisit une icône intégrée
- **THEN** l'icône preset est rendue via les classes `ce-icon` et `ce-icon-preset-*`
- **WHEN** l'utilisateur configure la source sur `theme` et sélectionne une icône du thème de la page
- **THEN** l'icône du thème est rendue via la classe CSS du thème ou l'URL associée
- **WHEN** l'utilisateur configure la source sur `image` et renseigne une URL (ou sélectionne via la médiathèque)
- **THEN** l'icône est rendue en `background-image` sur l'élément `<i>`

#### Scenario: Alignements horizontal et vertical
- **WHEN** l'utilisateur modifie l'alignement horizontal et/ou vertical dans les paramètres du `NodeIcone`
- **THEN** l'icône s'aligne selon les valeurs choisies dans l'éditeur, la preview et le rendu final

#### Scenario: Taille de l'icône
- **WHEN** l'utilisateur modifie la taille de l'icône dans les paramètres du `NodeIcone`
- **THEN** l'icône est rendue à la taille configurée (`ce-icon`, `ce-icon-small` ou `ce-icon-large`)

#### Scenario: Lien cliquable optionnel
- **WHEN** l'utilisateur renseigne une URL de lien dans les paramètres du `NodeIcone`
- **THEN** l'icône est rendue comme un élément cliquable pointant vers cette URL
- **AND** le comportement est visible en preview et dans le rendu final

#### Scenario: Persistance du NodeIcone
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs `NodeIcone`
- **THEN** les propriétés du nœud (source, icône, taille, lien, alignements, styles conteneur et icône) sont sérialisées et restaurées à l'identique lors du rechargement

### Requirement: Confirmation avant suppression d'un nœud

Lorsqu'un utilisateur déclenche la suppression manuelle d'un nœud éditable (ex. icône poubelle du menu de bloc), le builder SHALL afficher une **modale de confirmation** avant de modifier `NodesType`. La modale SHALL indiquer le libellé ou le type du nœud ciblé. Si le nœud possède un ou plusieurs **descendants**, la modale SHALL le signaler et SHALL préciser qu'ils seront supprimés avec lui. La suppression ne SHALL s'exécuter qu'après confirmation explicite ; l'annulation SHALL laisser `nodes` inchangé.

#### Scenario: Confirmation avec descendants

- **WHEN** l'utilisateur clique sur supprimer pour un conteneur ayant des nœuds enfants
- **THEN** une modale de confirmation s'affiche
- **AND** le message indique que les sous-blocs seront également supprimés
- **AND** la suppression n'est appliquée qu'après validation explicite

#### Scenario: Annulation de la suppression

- **WHEN** l'utilisateur ouvre la modale de confirmation puis annule
- **THEN** le nœud et ses descendants restent présents dans `nodes`
- **AND** la sélection et l'affichage du builder ne changent pas

#### Scenario: Suppression confirmée d'un nœud feuille

- **WHEN** l'utilisateur confirme la suppression d'un nœud sans enfant
- **THEN** le nœud est retiré de `NodesType`
- **AND** les ordres des frères restants dans la même zone parente sont réindexés

### Requirement: Suppression récursive des descendants

Lorsqu'un nœud est supprimé (manuellement après confirmation ou lors de l'épuration automatique), le builder SHALL retirer **récursivement** ce nœud et **tous ses descendants** de `NodesType`. Aucun nœud dont `parent.id` référençait le nœud supprimé (directement ou via une chaîne d'ancêtres supprimés) ne SHALL subsister dans le JSON.

#### Scenario: Suppression d'un conteneur parent

- **WHEN** l'utilisateur confirme la suppression d'un conteneur possédant des enfants imbriqués
- **THEN** le conteneur et l'ensemble de ses descendants sont retirés de `NodesType`
- **AND** aucun nœud orphelin ne reste référencé dans le JSON

#### Scenario: Réindexation après suppression

- **WHEN** un nœud est supprimé parmi plusieurs frères dans la même zone parente
- **THEN** les `parent.order` des frères restants sont réassignés de façon séquentielle sans trou

### Requirement: Nettoyage des nœuds invalides au chargement

Lors du chargement du contenu éditable (parse du JSON vers `NodesType`), le builder SHALL **épurer automatiquement** les entrées invalides avant d'afficher la page :

- les nœuds dont le `type` n'existe pas dans le registre courant `NodeRegistry`, **avec tous leurs descendants** ;
- les nœuds **orphelins** dont `parent.id` ne correspond à aucun nœud existant dans le dictionnaire (sauf le nœud racine `node-root`).

L'épuration SHALL appliquer la même suppression récursive et la même réindexation des ordres que la suppression manuelle. Le nœud racine `node-root` ne SHALL jamais être retiré par cette épuration.

#### Scenario: Type de nœud retiré du registre

- **WHEN** le JSON chargé contient un nœud de type absent de `NodeRegistry` (ex. ancien composant supprimé du code)
- **THEN** ce nœud et tous ses descendants sont retirés de `NodesType` au chargement
- **AND** le builder s'affiche sans erreur avec la structure restante valide

#### Scenario: Nœud orphelin sans parent existant

- **WHEN** le JSON chargé contient un nœud dont `parent.id` ne référence aucun nœud du dictionnaire
- **THEN** ce nœud et ses descendants sont retirés de `NodesType` au chargement

#### Scenario: Sauvegarde après épuration

- **WHEN** l'utilisateur enregistre la page après ouverture d'un contenu nettoyé automatiquement
- **THEN** le JSON persisté ne contient plus les nœuds invalides ni leurs descendants

### Requirement: Gras partiel du libellé NodeButton

Le nœud **NodeButton** SHALL permettre de mettre en **gras une partie seulement** de son libellé (`content.label`), sans appliquer le gras à l'intégralité du bouton via **Text2Settings**. L'édition du libellé et du gras partiel SHALL s'effectuer **sur le canevas lorsque le nœud est sélectionné** (édition inline) **ou** dans le panneau **NodeSettings** du nœud sélectionné. Le libellé SHALL être persisté avec des balises inline limitées (`<strong>` ou `<b>`) ; toute autre balise SHALL être supprimée à l'enregistrement. Le rendu en édition, en prévisualisation et à l'export SHALL afficher le gras partiel. Les libellés texte brut existants (sans balises HTML) SHALL rester valides et inchangés visuellement.

#### Scenario: Gras sur une portion du libellé

- **WHEN** l'utilisateur modifie le libellé d'un NodeButton sélectionné sur le canevas ou dans NodeSettings et y applique du gras sur une portion du texte
- **THEN** seule la portion concernée est rendue en gras dans le canevas ; le reste du libellé conserve son apparence normale

#### Scenario: Rendu preview et export

- **WHEN** un NodeButton possède un libellé avec une partie en gras
- **THEN** la prévisualisation et le rendu HTML final affichent le même gras partiel sur le bouton ou le lien

#### Scenario: Persistance du libellé formaté

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeButton dont le libellé comporte du gras partiel
- **THEN** le contenu sérialisé conserve les balises de gras autorisées ; à la réouverture de la page, le libellé et le formatage partiel sont restaurés à l'identique

#### Scenario: Rétrocompatibilité libellé texte brut

- **WHEN** une page contient un NodeButton avec un libellé texte brut sans balises HTML (contenu existant avant cette évolution)
- **THEN** le libellé s'affiche sans erreur ni altération du rendu

#### Scenario: Sanitisation des balises non autorisées

- **WHEN** le libellé d'un NodeButton contient ou reçoit du HTML avec des balises autres que `strong` ou `b` (ex. collage ou contenu malveillant)
- **THEN** seules les balises de gras autorisées sont conservées ; les autres balises sont supprimées tout en préservant le texte

### Requirement: ManagerFont — sélection de polices du catalogue à la demande

Le builder SHALL fournir un composant **ManagerFont** (modale de recherche et sélection) permettant à l’utilisateur de choisir une police parmi le catalogue `Font` (native, Google, custom) sans charger l’intégralité du catalogue au démarrage. La modale SHALL proposer une recherche textuelle et une pagination côté serveur. Lors de la sélection, le builder SHALL recevoir les métadonnées nécessaires au chargement (`id`, `name`, `fontFamily`, `href`) et les appliquer au champ `font-family` en cours d’édition.

#### Scenario: Ouverture de ManagerFont depuis un sélecteur font-family

- **WHEN** l’utilisateur clique sur l’action d’ajout de police dans un sélecteur `font-family` (ex. `FontFamilySelect` dans `Text2Settings`)
- **THEN** la modale ManagerFont s’ouvre ; seules les polices correspondant à la recherche et à la page courante de pagination sont chargées depuis le backend

#### Scenario: Sélection d’une police Google hors thème

- **WHEN** l’utilisateur recherche et sélectionne une police Google qui n’est pas dans les polices du thème
- **THEN** la modale se ferme ; la police est ajoutée aux polices de la page ; le champ `font-family` reçoit la valeur `fontFamily` correspondante ; la police est visible dans l’iframe d’édition

### Requirement: Registre d’usage des polices de page (FontUsageRegistry)

Le builder SHALL maintenir un registre des polices actives sur la page courante (`FontUsageRegistry`). Une police SHALL être considérée active lorsqu’au moins un node (ou une sous-partie de style d’un node) référence sa `fontFamily`, ou lorsqu’elle vient d’être sélectionnée via ManagerFont. Lorsque plus aucune référence n’existe pour une police de page, elle SHALL être retirée du registre et déchargée de la page d’édition (sans affecter les polices builtin ni les polices du thème).

#### Scenario: Ajout d’une police via ManagerFont

- **WHEN** l’utilisateur sélectionne une police via ManagerFont et l’applique à un node
- **THEN** le registre incrémente le compteur de cette police ; `registerFont` charge la feuille ou le `@font-face` dans l’iframe ; la police apparaît dans les options du sélecteur `font-family`

#### Scenario: Retrait automatique d’une police non utilisée

- **WHEN** l’utilisateur modifie ou supprime tous les nodes qui référençaient une police de page (hors thème et hors builtins)
- **THEN** le registre décrémente les compteurs ; lorsque le compteur atteint 0, la police est retirée des options et `unregisterFont` supprime son injection DOM dans l’iframe

#### Scenario: Resynchronisation au chargement d’une page existante

- **WHEN** le builder charge une page dont le JSON de nodes contient déjà des valeurs `fontFamily` correspondant à des polices du catalogue
- **THEN** un scanner parcourt les nodes, résout les polices via l’API backend et initialise le registre ; seules ces polices sont chargées en plus du thème et des builtins

### Requirement: Sélecteur font-family enrichi

Le composant `FontFamilySelect` SHALL proposer : (1) les polices navigateur intégrées (builtins) ; (2) les polices du thème (`themeFonts`) ; (3) les polices actives de la page (`FontUsageRegistry`). Il SHALL exposer une action pour ouvrir ManagerFont et ajouter une police du catalogue (Google ou custom via `GET /api/builder/fonts`). Il SHALL NOT charger ni lister l’intégralité du catalogue `Font` en base au démarrage. Les anciens chemins parallèles de sélection de polices (formulaire thème legacy, contrôleurs Stimulus autocomplete non branchés) SHALL NOT être requis pour accéder au catalogue une fois le nettoyage `assets/` effectué.

#### Scenario: Options limitées au boot

- **WHEN** le builder démarre sur une page sans police custom dans les nodes
- **THEN** le sélecteur `font-family` affiche uniquement les builtins et les polices du thème

#### Scenario: Options enrichies après usage

- **WHEN** une police hors thème est utilisée sur la page
- **THEN** elle apparaît dans le sélecteur en plus des builtins et des polices thème, sans que toutes les polices du catalogue aient été chargées

#### Scenario: Ajout via ManagerFont après nettoyage assets

- **WHEN** l’utilisateur ouvre « Ajouter une police… » dans un `FontFamilySelect` et que `pageBuilderApiBaseUrl` est configuré
- **THEN** la modale ManagerFont charge le catalogue paginé depuis `/api/builder/fonts` ; la police sélectionnée est enregistrée dans `FontUsageRegistry` et apparaît dans le sélecteur

### Requirement: Chargement des polices de page en preview et rendu public

Lors de la preview ou du rendu public d’une page, le système SHALL charger les polices référencées dans le contenu JSON de la page mais absentes du CSS de thème, afin que le rendu corresponde à l’éditeur. Le chargement SHALL être limité aux polices effectivement utilisées dans le contenu.

#### Scenario: Preview avec police hors thème

- **WHEN** une page contient un node dont le style utilise une police Google non incluse dans le thème
- **THEN** la preview injecte la feuille ou le `@font-face` de cette police ; le texte s’affiche avec la bonne famille typographique

### Requirement: Audit et retrait du code mort frontend

Le projet SHALL maintenir le dossier `assets/` exempt de modules, entrées Webpack, composants de nœuds (`Edit.tsx`, dossiers `Edits/`) et exports explicitement morts (fichiers non référencés par le build Encore, les templates Twig ou le code TypeScript/JavaScript actif). La propriété `edit` des configurations de nœuds (`NodeConfigurationType`) SHALL NOT exister lorsque le canevas ne monte que le composant `view`. Toute évolution du builder (polices, APIs, édition inline) SHALL être précédée d’un inventaire documenté des candidats à la suppression, idéalement via le script `audit:dead-code` (knip + revue manuelle des templates Twig).

#### Scenario: Inventaire avant modification du builder

- **WHEN** une tâche vise à modifier le sélecteur de polices, la sélection d’API d’un nœud ou la couche d’édition du canevas
- **THEN** un inventaire des fichiers, exports et dépendances npm non référencés dans `assets/` est produit et les suppressions confirmées sont appliquées avant le changement fonctionnel

#### Scenario: Build après nettoyage frontend

- **WHEN** des fichiers morts, la couche `Edit.tsx` ou des dépendances npm inutilisées sont retirés de `assets/`
- **THEN** la compilation Encore réussit et les entrypoints actifs (`pageBuilderStandalone`, `pagePreview`, `ThemeForm2`, `app`) restent fonctionnels

#### Scenario: Absence de reliquats médiathèque legacy

- **WHEN** le nettoyage frontend est terminé
- **THEN** l’entrypoint Webpack `fileManager`, `assets/fileManager.jsx`, `assets/components/FileManager.tsx` et le template `templates/media/index.html.twig` ne sont plus présents dans le dépôt

### Requirement: Indication des valeurs thème dans les placeholders des panneaux de style

Les panneaux de style partagés du builder (`Text2Settings`, `Background2Settings`, `Border2Settings`, `Spacing2Settings`, `Size2Settings`, `Object2Settings`) SHALL accepter un contexte de sélecteur d'override thème optionnel. Lorsqu'un champ de style du nœud est vide (aucune valeur inline persistée pour cette propriété) et que le thème de la page définit une valeur pour la propriété CSS correspondante dans `node_overrides`, le champ SHALL afficher cette valeur comme **placeholder** indicatif, après résolution des références `var(--…)` à partir des `vars` du thème. Lorsque le nœud possède déjà une valeur pour la propriété, le placeholder thème SHALL NOT remplacer la valeur affichée. Lorsqu'aucune valeur thème n'est définie pour la propriété, ou lorsque la variable CSS ne peut pas être résolue via les `vars` du thème, le placeholder générique existant (ex. `ex: 1.5rem`, `auto`) SHALL être conservé.

Le builder SHALL recevoir les `node_overrides` et les `vars` du thème associé à la page au chargement de l'éditeur, normalisés en structure exploitable côté frontend (y compris pour les overrides legacy stockés en chaîne CSS).

Les réglages de style de `NodeYoutube` (`Spacing2Settings`, `Border2Settings`) SHALL utiliser le sélecteur d'override `.ce-youtube` pour résoudre les placeholders thème des champs vides.

#### Scenario: Champ vide avec valeur thème littérale
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dont une propriété (ex. `font-size`) n'a pas de valeur inline
- **AND** le thème définit `font-size: 1.25rem` pour le sélecteur d'override correspondant
- **THEN** le champ affiche `1.25rem` en placeholder, sans préfixe

#### Scenario: Champ vide avec variable CSS résolue
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dont `color` n'a pas de valeur inline
- **AND** le thème définit `color: var(--color-primary)` pour le sélecteur correspondant
- **AND** `vars` contient `--color-primary: #3b82f6`
- **THEN** le champ affiche `#3b82f6` en placeholder
- **AND** le champ n'affiche pas la chaîne `var(--color-primary)`

#### Scenario: Champ renseigné sur le nœud
- **WHEN** l'utilisateur a défini une valeur inline pour une propriété de style sur le nœud
- **THEN** le champ affiche la valeur du nœud
- **AND** le placeholder thème n'est pas affiché à la place de cette valeur

#### Scenario: Aucune valeur thème pour la propriété
- **WHEN** le thème ne définit pas de valeur pour la propriété CSS concernée
- **THEN** le champ conserve le placeholder générique existant du composant (ex. `ex: 1.5rem`)

#### Scenario: Variable CSS non résolvable
- **WHEN** le thème définit une valeur `var(--inconnue)` pour une propriété
- **AND** `--inconnue` est absente des `vars` du thème
- **THEN** le champ conserve le placeholder générique existant du composant

#### Scenario: Contexte de sous-partie (ex. titre de carte)
- **WHEN** l'utilisateur édite le style du titre d'un NodeCard en position `top`
- **AND** le thème définit des overrides pour `.ce-card-position-top .ce-card-title`
- **THEN** les champs vides de `Text2Settings` / `Spacing2Settings` affichent les valeurs thème résolues de ce sélecteur en placeholder

#### Scenario: NodeYoutube avec overrides thème
- **WHEN** l'utilisateur ouvre les réglages de style d'un `NodeYoutube` dont `margin-top` n'a pas de valeur inline
- **AND** le thème définit `margin-top: 1rem` pour le sélecteur `.ce-youtube`
- **THEN** le champ `margin-top` de `Spacing2Settings` affiche `1rem` en placeholder indicatif

### Requirement: Saisie URL ou ID pour NodeYoutube

Le nœud `NodeYoutube` MUST stocker uniquement l'identifiant vidéo YouTube dans `content.videoId`. Le panneau de réglages du nœud SHALL accepter soit un ID brut, soit une URL YouTube complète ; lors de la saisie, le builder MUST normaliser la valeur et ne persister que l'ID extrait.

Les formats d'URL suivants MUST être reconnus pour l'extraction :
- `https://www.youtube.com/watch?v={id}` (et variantes `youtube.com`, `m.youtube.com`, avec paramètres additionnels)
- `https://youtu.be/{id}`
- `https://www.youtube.com/embed/{id}`
- `https://www.youtube.com/shorts/{id}`

Lorsque la valeur saisie correspond déjà à un ID YouTube valide (sans URL), le builder MUST la conserver telle quelle après trim des espaces.

#### Scenario: Collage d'une URL watch
- **WHEN** l'utilisateur colle `https://www.youtube.com/watch?v=dQw4w9WgXcQ` dans le champ vidéo de `NodeYoutube`
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`
- **AND** le champ affiche `dQw4w9WgXcQ`

#### Scenario: Collage d'une URL youtu.be
- **WHEN** l'utilisateur colle `https://youtu.be/dQw4w9WgXcQ` dans le champ vidéo
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Collage d'une URL shorts ou embed
- **WHEN** l'utilisateur colle `https://www.youtube.com/shorts/dQw4w9WgXcQ` ou `https://www.youtube.com/embed/dQw4w9WgXcQ`
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Saisie d'un ID brut
- **WHEN** l'utilisateur saisit directement `dQw4w9WgXcQ` (éventuellement entouré d'espaces)
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Rendu après extraction
- **WHEN** un `videoId` valide a été extrait et enregistré depuis une URL
- **THEN** le rendu `NodeYoutube` affiche le lecteur YouTube correspondant à cet ID

### Requirement: Titres de section lisibles en mode clair et sombre dans les panneaux Settings

Les panneaux de style partagés du builder (`Text2Settings`, `Background2Settings`, `Border2Settings`, `Spacing2Settings`, `Size2Settings`, `Object2Settings`) SHALL afficher leurs titres de section intermédiaires (ex. `Margin`, `Padding`, `Text`, `Border`, `Background`, `Image`, `Taille min / max`) via un composant ou un style partagé basé sur les tokens sémantiques du thème éditeur (`bg-muted`, `text-muted-foreground` ou équivalent), et non sur des couleurs Tailwind fixes non adaptatives (ex. `bg-gray-200/50`).

Le texte du titre SHALL rester lisible lorsque le panneau latéral droit du builder est affiché en mode clair ou en mode sombre (classe `dark` sur le conteneur du panneau).

#### Scenario: Mode clair du panneau réglages
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dans le panneau latéral droit en mode clair
- **THEN** les titres de section (`Margin`, `Padding`, etc.) sont visibles avec un contraste suffisant par rapport au fond du panneau

#### Scenario: Mode sombre du panneau réglages
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dans le panneau latéral droit en mode sombre
- **THEN** les titres de section utilisent un fond et une couleur de texte adaptés au mode sombre
- **AND** le libellé reste lisible (pas de texte atténué sur fond clair codé en dur)

### Requirement: Mode unifié ou par côté pour margin et padding dans Spacing2Settings

Le panneau partagé `Spacing2Settings` SHALL proposer, pour **margin** et pour **padding** indépendamment, deux modes de saisie :

1. **Mode unifié** : un seul champ texte dont la valeur s'applique aux quatre côtés en une fois.
2. **Mode par côté** : les quatre champs existants (`top`, `right`, `bottom`, `left`).

L'utilisateur SHALL pouvoir basculer entre ces deux modes pour chaque propriété (margin et padding) via un contrôle visible à côté du titre de section (`Margin` / `Padding`).

En **mode unifié**, la saisie SHALL persister la valeur via la propriété CSS shorthand (`margin` ou `padding`) et SHALL effacer les propriétés longhand correspondantes (`marginTop`, `marginRight`, `marginBottom`, `marginLeft` ou `paddingTop`, etc.) pour éviter les conflits.

En **mode par côté**, la saisie SHALL persister via les propriétés longhand et SHALL effacer la propriété shorthand correspondante (`margin` ou `padding`).

Lors de l'ouverture du panneau, le mode affiché par défaut SHALL être déterminé automatiquement :
- **Mode unifié** si seule la propriété shorthand est définie, ou si les quatre côtés longhand ont la même valeur non vide.
- **Mode par côté** si au moins deux côtés longhand ont des valeurs différentes, ou si seules des valeurs longhand asymétriques sont définies.

Lors du passage du mode unifié au mode par côté, si une valeur unifiée est définie, elle SHALL être répartie sur les quatre champs longhand.

Lors du passage du mode par côté au mode unifié, si les quatre côtés ont la même valeur non vide, le champ unifié SHALL afficher cette valeur ; sinon le champ unifié SHALL être vide jusqu'à une nouvelle saisie.

Les placeholders thème existants SHALL continuer de fonctionner : en mode unifié, le placeholder SHALL provenir de la propriété shorthand (`margin` / `padding`) du thème ; en mode par côté, les placeholders par côté existants SHALL être conservés.

#### Scenario: Saisie margin unifiée sur un conteneur
- **WHEN** l'utilisateur ouvre les réglages de style d'un `NodeContainer` en mode unifié pour margin
- **AND** saisit `1rem` dans le champ unique
- **THEN** le style du nœud contient `margin: 1rem`
- **AND** les propriétés `marginTop`, `marginRight`, `marginBottom`, `marginLeft` ne sont pas définies

#### Scenario: Saisie padding par côté asymétrique
- **WHEN** l'utilisateur bascule padding en mode par côté
- **AND** saisit `2rem` en top et `1rem` en bottom
- **THEN** le style contient `paddingTop: 2rem` et `paddingBottom: 1rem`
- **AND** la propriété shorthand `padding` n'est pas définie

#### Scenario: Bascule unifié vers par côté avec valeur existante
- **WHEN** le nœud a `margin: 1.5rem` en style inline
- **AND** l'utilisateur bascule margin en mode par côté
- **THEN** les quatre champs affichent `1.5rem`
- **AND** `margin` shorthand est retiré au profit des quatre propriétés longhand

#### Scenario: Détection automatique mode par côté
- **WHEN** le nœud a `paddingTop: 1rem` et `paddingBottom: 2rem` sans shorthand
- **THEN** `Spacing2Settings` ouvre padding en mode par côté
- **AND** les champs top et bottom affichent leurs valeurs respectives

#### Scenario: Détection automatique mode unifié (valeurs égales)
- **WHEN** le nœud a `marginTop`, `marginRight`, `marginBottom` et `marginLeft` tous à `1rem`
- **THEN** `Spacing2Settings` ouvre margin en mode unifié
- **AND** le champ unique affiche `1rem`

#### Scenario: Placeholder thème en mode unifié
- **WHEN** l'utilisateur ouvre `Spacing2Settings` pour un nœud sans margin inline
- **AND** le thème définit `margin: 1rem` pour le sélecteur d'override correspondant
- **AND** le panneau est en mode unifié pour margin
- **THEN** le champ unique affiche `1rem` en placeholder indicatif

#### Scenario: Placeholder thème en mode par côté inchangé
- **WHEN** l'utilisateur ouvre `Spacing2Settings` en mode par côté pour margin
- **AND** le thème définit `margin-top: 1rem` pour le sélecteur correspondant
- **AND** `margin-top` n'a pas de valeur inline sur le nœud
- **THEN** le champ `top` affiche `1rem` en placeholder indicatif

### Requirement: Mode unifie ou par cote pour border dans Border2Settings
Le panneau partage `Border2Settings` du builder SHALL proposer deux modes de saisie de la bordure:

1. **Mode unifie**: un champ global applique la meme bordure sur tous les cotes.
2. **Mode par cote**: des champs dedies permettent de configurer `borderTop`, `borderRight`, `borderBottom` et `borderLeft` independamment.

L'utilisateur SHALL pouvoir basculer entre ces modes via un controle visible dans la section `Border`.

En **mode unifie**, la saisie SHALL persister la propriete shorthand `border` et SHALL effacer les proprietes longhand par cote pour eviter les conflits.

En **mode par cote**, la saisie SHALL persister les proprietes longhand et SHALL effacer la shorthand `border`.

A l'ouverture du panneau, le mode affiche SHALL etre detecte automatiquement:
- **Mode unifie** si seule `border` est definie, ou si les quatre cotes longhand ont la meme valeur non vide.
- **Mode par cote** si au moins deux cotes portent des valeurs differentes, ou si une configuration asymetrique existe.

#### Scenario: Saisie d'une bordure basse uniquement
- **WHEN** l'utilisateur ouvre `Border2Settings` pour un noeud en mode par cote
- **AND** saisit une valeur sur `bottom` uniquement
- **THEN** le style du noeud contient `borderBottom` avec cette valeur
- **AND** `border`, `borderTop`, `borderRight` et `borderLeft` ne sont pas definies

#### Scenario: Saisie d'une bordure globale
- **WHEN** l'utilisateur bascule en mode unifie et saisit `1px solid #000`
- **THEN** le style du noeud contient `border: 1px solid #000`
- **AND** les proprietes `borderTop`, `borderRight`, `borderBottom`, `borderLeft` ne sont pas definies

#### Scenario: Detection automatique du mode par cote
- **WHEN** le noeud a `borderTop: 1px solid #000` et `borderBottom: 2px solid #000` sans shorthand
- **THEN** `Border2Settings` s'ouvre en mode par cote
- **AND** les champs `top` et `bottom` affichent les valeurs correspondantes

### Requirement: Interfaces builder compatibles endpoints API Platform

Le builder SHALL pouvoir consommer les donnees card API depuis des operations API Platform, tout en restant compatible avec les endpoints legacy `/page-builder/api/*` pendant la migration. La couche d'acces HTTP frontend SHALL encapsuler cette compatibilite pour les noeuds et composants qui recuperent des APIs, collections ou items.

#### Scenario: Selection d'API dans le builder apres migration
- **WHEN** l'utilisateur ouvre un selecteur d'API dans le builder
- **THEN** la liste des APIs est chargee via la couche HTTP compatible API Platform, sans casser les ecrans existants

#### Scenario: Chargement d'items pour un noeud consommateur
- **WHEN** un noeud builder consommateur d'API demande une collection ou un item
- **THEN** la couche HTTP utilise l'operation API Platform ou son endpoint de compatibilite et retourne un format uniforme au noeud

### Requirement: Adaptation explicite des interfaces critiques

Les interfaces critiques du builder (notamment NodeCard, NodeNavApi et tout noeud consommant des endpoints builder API) SHALL etre adaptees et validees contre la nouvelle couche API Platform-compatible avant suppression d'un endpoint legacy.

#### Scenario: Validation fonctionnelle NodeCard
- **WHEN** l'utilisateur configure un bloc card base sur une API puis selectionne un item
- **THEN** la recherche, la pagination et la selection d'item fonctionnent avec la couche API Platform-compatible

#### Scenario: Validation fonctionnelle NodeNavApi
- **WHEN** l'utilisateur configure un NodeNavApi relie a une API de type `list`
- **THEN** le menu affiche correctement les liens mappes (`title`, `link`) via la couche API Platform-compatible

### Requirement: Répartition des colonnes NodeTwoColumns

Le builder SHALL fournir un conteneur **NodeTwoColumns** (identifiant `node-two_columns`) avec deux zones enfants (`left`, `right`). Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (desktop, tablette, mobile), la répartition de largeur entre les deux colonnes et l'inversion de l'ordre (`reverseDesktop`, `reverseTablet`, `reverseMobile`).

Les répartitions prédéfinies suivantes MUST être proposées dans le sélecteur de largeur pour **tous** les breakpoints :

- `33-66`, `50-50`, `66-33` (existantes)
- `25-75`, `75-25` (nouvelles)
- `100-100` (empilement vertical)

Sur le breakpoint **desktop uniquement**, le sélecteur MUST proposer en plus l'option `custom` (pourcentages libres). Lorsque `custom` est sélectionné pour desktop, le panneau de réglages MUST afficher une ligne supplémentaire **sous la ligne desktop** du tableau de layout (et non dans la cellule du sélecteur). Cette ligne MUST contenir deux champs numériques entiers (colonne gauche et colonne droite, en pourcentage, avec libellés explicites) dont la somme MUST être égale à 100, sans pas imposé (toute valeur entière de 1 à 99). La ligne MUST être masquée lorsque `desktop` n'est pas `custom`. Les valeurs MUST être persistées dans `attributes.layout.customDesktop` sous la forme `{ left, right }`. L'option `custom` MUST NOT être disponible pour tablette ni mobile.

Le rendu MUST refléter la répartition choisie en mode édition (selon le breakpoint sélectionné), en prévisualisation et à l'export HTML. Les pages existantes utilisant uniquement les presets historiques MUST conserver leur rendu sans modification.

#### Scenario: Sélection du preset 25-75 sur desktop

- **WHEN** l'utilisateur sélectionne `25-75` pour le breakpoint desktop d'un `NodeTwoColumns`
- **THEN** la colonne gauche occupe environ 25 % de la largeur et la colonne droite environ 75 % sur desktop
- **AND** la valeur `25-75` est persistée dans `attributes.layout.desktop`

#### Scenario: Sélection du preset 75-25 sur tablette

- **WHEN** l'utilisateur sélectionne `75-25` pour le breakpoint tablette
- **THEN** la colonne gauche occupe environ 75 % et la colonne droite environ 25 % sur tablette
- **AND** la valeur `75-25` est persistée dans `attributes.layout.tablet`

#### Scenario: Ratio personnalisé 40-60 sur desktop

- **WHEN** l'utilisateur sélectionne `custom` pour desktop et saisit `40` % (gauche) et `60` % (droite)
- **THEN** `attributes.layout.desktop` vaut `custom` et `attributes.layout.customDesktop` vaut `{ left: 40, right: 60 }`
- **AND** le rendu desktop affiche les deux colonnes avec ce ratio

#### Scenario: Ligne de saisie custom sous la ligne desktop

- **WHEN** l'utilisateur sélectionne `custom` dans le sélecteur desktop du tableau de layout
- **THEN** une nouvelle ligne apparaît immédiatement sous la ligne desktop avec les champs gauche et droite (en %)
- **AND** les cellules tablette et mobile de cette ligne restent vides ou non éditables

#### Scenario: Masquage de la ligne custom

- **WHEN** l'utilisateur change le sélecteur desktop d'un preset `custom` vers un autre preset (ex. `50-50`)
- **THEN** la ligne de saisie custom sous la ligne desktop est masquée
- **AND** les valeurs `customDesktop` précédentes peuvent être conservées en JSON mais ne sont plus utilisées pour le rendu

#### Scenario: Custom indisponible sur tablette et mobile

- **WHEN** l'utilisateur ouvre les réglages de largeur pour tablette ou mobile d'un `NodeTwoColumns`
- **THEN** l'option `custom` n'est pas proposée dans le sélecteur
- **AND** seuls les presets (`33-66`, `50-50`, `66-33`, `25-75`, `75-25`, `100-100`) sont disponibles

#### Scenario: Rendu responsive avec custom desktop et presets tablette/mobile

- **WHEN** un `NodeTwoColumns` a `desktop: custom` avec `{ left: 40, right: 60 }`, `tablet: 50-50` et `mobile: 100-100`
- **THEN** en mode view le ratio desktop applique 40-60, le ratio tablette 50-50 et le ratio mobile empile les colonnes
- **AND** en mode édition le ratio affiché correspond au breakpoint actuellement sélectionné dans le builder

#### Scenario: Rétrocompatibilité des pages existantes

- **WHEN** une page sauvegardée contient un `NodeTwoColumns` avec `layout.desktop: 50-50` (sans champs custom)
- **THEN** le rendu reste identique à l'existant après déploiement de cette évolution

### Requirement: Renommage inline dans le navigateur de composants

En mode édition, le navigateur de composants SHALL permettre de **renommer un nœud sur place** par **double-clic** sur le libellé de son entrée. L’édition SHALL activer un champ texte inline. La valeur validée SHALL être persistée dans `editorLabel` du nœud (même champ que « Nom dans l’éditeur » dans **NodeSettings**) et SHALL être incluse dans le JSON sauvegardé de la page. Ce nom n’affecte pas le rendu public de la page.

La validation SHALL intervenir lorsque l’utilisateur confirme avec **Entrée** ou lorsque le champ perd le focus (**blur**). La touche **Échap** SHALL annuler l’édition sans modifier le nœud. Une valeur vide après validation SHALL supprimer `editorLabel` et rétablir le libellé par défaut de l’entrée. Un simple **clic** sur l’entrée SHALL conserver le comportement de sélection existant et ne SHALL pas ouvrir l’édition inline.

#### Scenario: Ouverture de l’édition par double-clic

- **WHEN** l’utilisateur double-clique sur le libellé d’une entrée du navigateur de composants
- **THEN** un champ texte inline remplace le libellé, prérempli avec le nom affiché courant
- **AND** le focus est placé dans ce champ pour permettre la saisie immédiate

#### Scenario: Validation du nouveau nom

- **WHEN** l’utilisateur saisit un nom et confirme avec Entrée ou quitte le champ (blur)
- **THEN** le nœud est mis à jour avec `editorLabel` égal à la valeur saisie (trimée)
- **AND** l’entrée de l’arbre affiche immédiatement le nouveau nom
- **AND** le champ « Nom dans l’éditeur » de NodeSettings reflète la même valeur si le nœud est sélectionné

#### Scenario: Annulation avec Échap

- **WHEN** l’utilisateur est en édition inline et appuie sur Échap
- **THEN** l’édition se ferme sans modifier `editorLabel`
- **AND** le libellé affiché dans l’arbre reste inchangé

#### Scenario: Suppression du nom personnalisé

- **WHEN** l’utilisateur efface entièrement le texte du champ inline puis valide
- **THEN** `editorLabel` est supprimé du nœud
- **AND** l’entrée retrouve le libellé par défaut (type ou contenu)

#### Scenario: Persistance après sauvegarde

- **WHEN** l’utilisateur renomme un nœud depuis le navigateur puis enregistre la page
- **THEN** le JSON sérialisé contient `editorLabel` pour ce nœud
- **AND** à la réouverture de la page, le nom personnalisé est affiché dans l’arbre

### Requirement: Conservation de la position de défilement lors du basculement Édition/Prévisualisation

Lors du basculement entre le mode **édition** et le mode **prévisualisation**, le builder SHALL conserver la **position de lecture** de l’utilisateur dans le canevas : la région de contenu visible avant le basculement SHALL rester visible après le basculement, sans remonter automatiquement en haut de la page ni sauter vers une autre section non consultée.

La conservation SHALL s’appliquer au conteneur de défilement du canevas (`.admin-layout__main`), que le builder soit monté en contexte standalone (`pageBuilderStandalone.jsx`) ou embarqué dans le formulaire d’édition de page. Le mécanisme SHALL fonctionner dans les deux sens (édition → prévisualisation et prévisualisation → édition).

Avant chaque bascule, le système SHALL mémoriser un **ancre de lecture** : l’identifiant du nœud visible au centre du canevas (`data-ce-id`) et son décalage par rapport au haut du viewport du canevas. Après le rendu du nouveau mode, le système SHALL restaurer la position en faisant défiler le canevas pour retrouver cet ancrage. Si aucun nœud n’est détectable, un ratio de défilement du canevas MAY servir de repli.

La restauration SHALL intervenir **après stabilisation du layout** (sidebars, grille, hauteur du contenu) afin d’éviter un repositionnement prématuré suivi d’un saut visuel.

#### Scenario: Bascule édition → prévisualisation après défilement

- **WHEN** l’utilisateur fait défiler le canevas en mode édition pour consulter une section au milieu ou en bas d’une page longue
- **AND** l’utilisateur active le mode prévisualisation
- **THEN** le canevas affiche la même région de contenu qu’avant le basculement
- **AND** le canevas ne revient pas automatiquement en haut de la page

#### Scenario: Bascule prévisualisation → édition

- **WHEN** l’utilisateur fait défiler le canevas en mode prévisualisation
- **AND** l’utilisateur revient en mode édition
- **THEN** le canevas reste positionné sur la même région de contenu qu’en prévisualisation

#### Scenario: Bascule sans défilement préalable

- **WHEN** l’utilisateur bascule entre édition et prévisualisation sans avoir fait défiler le canevas depuis le chargement ou le dernier basculement
- **THEN** le canevas reste en haut de la page

#### Scenario: Contexte standalone et embarqué

- **WHEN** l’utilisateur bascule entre édition et prévisualisation dans le builder standalone ou dans le builder embarqué du formulaire page
- **THEN** la position de lecture est conservée selon les mêmes règles dans les deux contextes

### Requirement: Conservation de la position de défilement lors du changement de breakpoint

Lors du basculement entre les breakpoints de prévisualisation (**mobile**, **tablette**, **bureau**), le builder SHALL conserver la même **position de lecture** dans le canevas selon le mécanisme d’ancrage par nœud (`data-ce-id` + décalage viewport) décrit ci-dessus.

La restauration SHALL attendre la fin de l’animation de largeur du conteneur racine de la page, puis la **stabilisation du layout** (repositionnement des blocs et hauteur du contenu) avant d’appliquer le défilement, afin d’éviter un saut visuel après repositionnement des éléments.

#### Scenario: Changement mobile → tablette après défilement

- **WHEN** l’utilisateur consulte une section au milieu d’une page longue avec le breakpoint **mobile** actif
- **AND** l’utilisateur sélectionne le breakpoint **tablette** ou **bureau**
- **THEN** après la transition de largeur et le repositionnement des blocs, le canevas affiche la même région de contenu qu’avant le changement

#### Scenario: Changement de breakpoint sans défilement préalable

- **WHEN** l’utilisateur change de breakpoint sans avoir fait défiler le canevas
- **THEN** le canevas reste en haut de la page

### Requirement: Grille responsive NodeGrid

Le builder SHALL fournir un conteneur **NodeGrid** (identifiant `node-grid`) organisant ses enfants dans des zones nommées `cell-{row}-{col}`. Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (**desktop**, **tablette**, **mobile**), le nombre de **colonnes** et de **lignes**, ainsi qu'un **gap** commun.

Les identifiants de zone SHALL être dérivés de la structure **desktop** (`rows(desktop) × cols(desktop)`). Le rendu en mode **view** (page publique, export HTML) SHALL afficher toutes ces zones et appliquer une grille responsive via les colonnes configurées par breakpoint (reflow CSS selon le viewport réel).

En mode **prévisualisation** et en mode **édition** du builder, le `NodeGrid` SHALL afficher **toutes** les zones de la structure desktop et appliquer le nombre de colonnes du breakpoint actuellement sélectionné dans la barre d'outils ; aucun enfant présent dans une zone desktop ne SHALL disparaître lors du basculement édition → prévisualisation ni lors d'un changement de breakpoint mobile ou tablette.

#### Scenario: Prévisualisation mobile avec moins de cellules configurées

- **WHEN** un `NodeGrid` a une structure desktop 2×2 avec du contenu dans chaque cellule `cell-0-0` à `cell-1-1`
- **AND** le layout mobile est configuré à 1 colonne et 1 ligne
- **AND** l'utilisateur bascule en mode prévisualisation avec le breakpoint **mobile** actif
- **THEN** les quatre blocs de contenu restent visibles dans le canevas
- **AND** ils sont disposés en une colonne selon le nombre de colonnes mobile configuré

#### Scenario: Changement de breakpoint en prévisualisation

- **WHEN** l'utilisateur consulte un `NodeGrid` en mode prévisualisation avec le breakpoint **mobile**
- **AND** le contenu de toutes les zones desktop est affiché
- **AND** l'utilisateur sélectionne le breakpoint **tablette** ou **bureau**
- **THEN** le même contenu reste visible
- **AND** la disposition se met à jour selon le nombre de colonnes du nouveau breakpoint

#### Scenario: Rendu public inchangé

- **WHEN** une page contenant un `NodeGrid` est affichée en mode **view** (hors builder)
- **THEN** toutes les zones desktop sont rendues avec reflow responsive selon le viewport réel
- **AND** le comportement reste identique à l'existant avant correction de la prévisualisation

#### Scenario: Édition alignée sur la prévisualisation

- **WHEN** le builder est en mode **édition** avec le breakpoint **mobile** sélectionné
- **AND** un `NodeGrid` a une structure desktop 2×2 avec du contenu dans chaque cellule
- **THEN** les quatre blocs de contenu sont visibles dans le canevas avec la même disposition qu'en prévisualisation mobile
- **AND** aucune bordure permanente de cellule d'édition n'est affichée
- **AND** l'utilisateur peut sélectionner une cellule ou son contenu via le navigateur de composants

### Requirement: Canevas d'édition WYSIWYG

En mode **édition** du builder, le canevas SHALL afficher chaque nœud avec le **même composant de rendu** qu'en mode **prévisualisation** (composant `view` du registre de nœuds). Le rendu visuel du contenu (disposition, styles, texte affiché) SHALL être **identique** entre édition et prévisualisation pour un même breakpoint sélectionné, **sauf** lorsqu'un nœud à contenu texte court est **sélectionné** et bascule en édition inline (voir scénario dédié).

Le mode édition SHALL conserver les capacités structurelles : **zones de dépôt** (`DropZone`), **glisser-déposer** et **sélection** de nœuds. Ces interactions SHALL être superposées au rendu WYSIWYG sans modifier l'apparence des nœuds eux-mêmes (pas de bordures de cellules d'édition, pas de composants `edit` dédiés sur le canevas).

L'édition du **contenu** des nœuds texte SHALL s'effectuer **directement sur le canevas lorsque le nœud est sélectionné** (édition inline), **ou** via le panneau **NodeSettings** (sidebar droite), **ou** via les modales déjà prévues (ex. `NodeRichText`). Hors sélection, le canevas SHALL afficher un aperçu non éditable identique à la prévisualisation.

#### Scenario: Rendu identique édition et prévisualisation

- **WHEN** l'utilisateur consulte une page contenant plusieurs types de nœuds (texte, bouton, flex, grille, etc.)
- **AND** l'utilisateur bascule entre le mode édition et le mode prévisualisation avec le même breakpoint actif
- **AND** aucun nœud texte court n'est en cours d'édition inline (non sélectionné ou prévisualisation)
- **THEN** la disposition et l'apparence du contenu restent visuellement identiques
- **AND** seul le chrome d'édition (menus, dropzones, bordures de survol) apparaît ou disparaît

#### Scenario: Édition inline à la sélection sur le canevas

- **WHEN** l'utilisateur sélectionne un `NodeText`, `NodeHeader`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` (via le canevas ou le navigateur de composants)
- **THEN** le canevas affiche une zone **contentEditable** sur le texte ou le libellé du nœud, avec les mêmes balises, classes et styles que le rendu final
- **AND** l'utilisateur peut modifier le contenu directement dans le nœud
- **AND** le contenu est persisté dans le modèle du nœud à la perte de focus (**blur**) ou à la validation équivalente

#### Scenario: Aperçu non éditable hors sélection

- **WHEN** un `NodeText`, `NodeHeader`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` n'est pas le nœud sélectionné en mode édition
- **THEN** le canevas affiche le rendu final (aperçu) sans zone éditable
- **AND** l'apparence est identique à la prévisualisation pour ce nœud

#### Scenario: Édition complémentaire via NodeSettings

- **WHEN** l'utilisateur sélectionne un nœud à contenu texte et modifie le texte dans le panneau **NodeSettings**
- **THEN** le canevas reflète immédiatement la modification
- **AND** l'édition inline sur le canevas reste disponible lorsque le nœud est sélectionné

#### Scenario: NodeRichText inchangé

- **WHEN** l'utilisateur sélectionne un `NodeRichText`
- **THEN** le canevas affiche l'aperçu du contenu sans éditeur inline sur le bloc
- **AND** la modale WYSIWYG s'ouvre pour l'édition, comme en prévisualisation

#### Scenario: Retour à la ligne en édition inline NodeText et NodeHeader

- **WHEN** l'utilisateur sélectionne un `NodeText` ou un `NodeHeader` en mode édition
- **AND** il place le curseur dans la zone contentEditable et appuie sur **Entrée** pour insérer un saut de ligne
- **THEN** le canevas affiche le texte sur plusieurs lignes
- **AND** après blur et sauvegarde, le contenu persisté dans `content.html` conserve le saut de ligne (balises HTML équivalentes, ex. `<br>`)
- **AND** le rendu en prévisualisation et à l'export affiche le même contenu multi-lignes

#### Scenario: NodeHeader rendu HTML cohérent

- **WHEN** un `NodeHeader` contient du HTML avec sauts de ligne dans `content.html`
- **AND** le nœud n'est pas en édition inline (prévisualisation ou non sélectionné en édition)
- **THEN** le titre est rendu via le HTML persisté (et non en texte brut échappé)
- **AND** les sauts de ligne sont visibles comme dans `NodeText`

### Requirement: Menu de bloc visible à la sélection uniquement

En mode **édition**, le **menu de bloc** (`NodeMenu`) d'un nœud éditable SHALL être affiché **uniquement** lorsque ce nœud est le nœud **sélectionné** du builder. Lorsqu'aucun nœud n'est sélectionné ou qu'un autre nœud est sélectionné, le menu du nœud non actif SHALL être masqué. La sélection SHALL rester possible via le **navigateur de composants** (Explorer) ou par **clic** sur le conteneur du bloc dans le canevas.

Le menu de bloc SHALL être positionné en **overlay flottant** **au-dessus** du conteneur visuel du nœud sélectionné, aligné en haut à gauche (`position: absolute; bottom: 100%` ou équivalent), **hors du flux** de mise en page. Il SHALL **ne pas** réserver d'espace vertical ni horizontal dans le conteneur et SHALL **ne pas recouvrir** le contenu du nœud : le contenu SHALL occuper la même emprise qu'en prévisualisation (sans menu). Le menu SHALL rester **toujours visible** (fond opaque, z-index suffisant) lorsque le nœud est sélectionné, y compris dans des conteneurs flex compacts (`NodeFlex`, `NodeNav`, etc.).

La **poignée de déplacement** (grip) du menu SHALL rester le point d'ancrage du drag-and-drop du nœud (`handleRef`). Le menu flottant SHALL **ne pas** bloquer les interactions de dépôt (dropzones) ni le clic de sélection sur le contenu adjacent ; les zones interactives du menu (grip, duplication, suppression, actions spécifiques) restent cliquables.

#### Scenario: Menu masqué hors sélection

- **WHEN** le builder est en mode édition et aucun nœud n'est sélectionné
- **THEN** aucun menu de bloc n'est visible sur le canevas

#### Scenario: Menu affiché à la sélection depuis l'Explorer

- **WHEN** l'utilisateur sélectionne un nœud via le navigateur de composants
- **THEN** le menu de bloc de ce nœud apparaît au-dessus du conteneur, aligné en haut à gauche, sans recouvrir le contenu
- **AND** les menus des autres nœuds restent masqués

#### Scenario: Sélection et menu via clic sur le conteneur

- **WHEN** l'utilisateur clique sur le conteneur d'un bloc non sélectionné dans le canevas
- **THEN** ce nœud devient sélectionné et son menu de bloc s'affiche en overlay flottant

#### Scenario: Pas de décalage de mise en page en édition

- **WHEN** un nœud est sélectionné en mode édition
- **THEN** le contenu du nœud n'est pas poussé vers le bas ou vers la droite par le menu de bloc
- **AND** l'emprise visuelle du contenu correspond à celle affichée en prévisualisation pour le même nœud

#### Scenario: Enfant NodeFlex sans débordement dû au menu

- **WHEN** un enfant d'un `NodeFlex` est sélectionné en mode édition
- **THEN** le menu de bloc s'affiche en overlay sans provoquer de débordement du conteneur flex attribuable à la hauteur du menu
- **AND** l'alignement flex des frères (direction, justify, align, wrap) reste cohérent avec la prévisualisation

#### Scenario: Drag-and-drop via la poignée du menu

- **WHEN** l'utilisateur saisit la poignée de déplacement du menu de bloc d'un nœud sélectionné
- **THEN** le nœud peut être déplacé par drag-and-drop vers une dropzone valide
- **AND** le déplacement reste fluide (pas de blocage par le positionnement flottant du menu)

#### Scenario: Dropzones accessibles avec menu flottant

- **WHEN** un nœud parent (ex. `NodeFlex`) contient des dropzones entre ou après ses enfants
- **AND** un enfant est sélectionné (menu flottant visible)
- **THEN** l'utilisateur peut toujours cibler et utiliser les dropzones pour déposer ou réordonner des nœuds

### Requirement: Surbrillance au survol du conteneur en édition

En mode **édition**, le conteneur visuel d'un nœud éditable (wrapper autour du contenu du bloc) SHALL modifier la **couleur de sa bordure** lorsque le pointeur de la souris le survole, afin d'indiquer la zone interactive. La bordure au survol SHALL être visuellement distincte de l'état par défaut et ne SHALL pas remplacer les repères de sélection active.

#### Scenario: Bordure au survol

- **WHEN** l'utilisateur survole avec la souris le conteneur d'un bloc en mode édition
- **THEN** la bordure du conteneur change de couleur par rapport à l'état par défaut

#### Scenario: Pas de surbrillance en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **THEN** les conteneurs de blocs n'affichent pas la bordure de survol d'édition

### Requirement: Panneau latéral droit rétractable en mode édition

En mode **édition**, le panneau latéral droit du builder (**NodeSettings**) SHALL être **repliable et dépliable** par l’utilisateur, sur le même principe que le panneau latéral gauche (bibliothèque / structure).

Lorsque le panneau droit est replié, son contenu SHALL être masqué, la colonne droite de la grille du layout SHALL avoir une largeur nulle, et le canevas SHALL occuper l’espace libéré. Un **bouton de bascule** SHALL rester accessible sur le bord intérieur du panneau (ou à sa place lorsque replié) pour rouvrir ou fermer le panneau, avec une transition visuelle cohérente avec le panneau gauche.

Le repli du panneau droit SHALL être **indépendant** du repli du panneau gauche. Lorsque les deux panneaux sont repliés, le canevas SHALL occuper toute la largeur disponible entre le header et le footer du builder.

La **sélection de nœud** (via le canevas ou le navigateur de composants) SHALL **ouvrir automatiquement** le panneau droit s'il est replié, et **NodeSettings** SHALL afficher les réglages du nœud sélectionné.

#### Scenario: Repli du panneau de réglages

- **WHEN** l’utilisateur est en mode édition avec le panneau droit ouvert
- **AND** l’utilisateur actionne le bouton de repli du panneau droit
- **THEN** le panneau NodeSettings est masqué
- **AND** le canevas s’élargit pour occuper l’espace libéré
- **AND** un bouton permet de rouvrir le panneau

#### Scenario: Dépli du panneau de réglages

- **WHEN** le panneau droit est replié en mode édition
- **AND** l’utilisateur actionne le bouton pour l’afficher
- **THEN** le panneau NodeSettings réapparaît avec son contenu
- **AND** la largeur du canevas est réduite en conséquence

#### Scenario: Sélection avec panneau droit replié

- **WHEN** le panneau droit est replié
- **AND** l’utilisateur sélectionne un nœud depuis le canevas ou le navigateur de composants
- **THEN** le nœud est bien sélectionné dans le builder
- **AND** le panneau droit s'ouvre automatiquement
- **AND** NodeSettings affiche les réglages de ce nœud

#### Scenario: Repli simultané des deux panneaux

- **WHEN** l’utilisateur replie le panneau gauche et le panneau droit en mode édition
- **THEN** seuls le header, le canevas et le footer (si présent) restent visibles latéralement
- **AND** le canevas occupe la largeur maximale disponible

#### Scenario: Stabilité du défilement au repli

- **WHEN** l’utilisateur a fait défiler le canevas sur une page longue
- **AND** l’utilisateur replie ou déplie le panneau droit
- **THEN** la région de contenu consultée reste approximativement la même, sans saut visuel majeur dû au changement de largeur du layout

### Requirement: Liens inactifs en mode édition du canevas

En mode **édition** du builder, les éléments du **canevas** (`admin-layout__main`) capables de provoquer une **navigation** (liens `<a href>`, ancres équivalentes dans le contenu riche, boutons-lien des nœuds) SHALL **ne pas déclencher de navigation** ni quitter le builder. Un clic sur ces éléments SHALL permettre la **sélection** du nœud parent via le chrome d’édition (conteneur de bloc, navigateur de composants).

En mode **prévisualisation** et en **view** (rendu public), ces liens SHALL conserver leur comportement de navigation habituel.

Les **iframes** et lecteurs embarqués (ex. `NodeYoutube`) qui interceptent les clics SHALL être neutralisés en mode édition afin de ne pas empêcher la sélection du nœud.

Cette règle SHALL s’appliquer au contenu rendu dans le canevas uniquement ; elle SHALL **exclure** le chrome du builder (header, sidebars, contrôles hors canevas).

#### Scenario: Lien de menu sans navigation en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeNavItem` ou un lien de `NodeNavApi` affiche un `href` valide
- **AND** l’utilisateur clique sur ce lien dans le canevas
- **THEN** aucune navigation n’est déclenchée et l’utilisateur reste dans le builder
- **AND** le nœud menu ou l’élément ciblé peut être sélectionné

#### Scenario: Lien actif en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **AND** un nœud affiche un lien cliquable dans le canevas
- **AND** l’utilisateur clique sur ce lien
- **THEN** la navigation vers l’URL configurée est déclenchée selon le `target` du lien

#### Scenario: Lien dans NodeRichText en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeRichText` contient un lien inséré via l’éditeur riche
- **AND** l’utilisateur clique sur ce lien dans l’aperçu du canevas
- **THEN** aucune navigation n’est déclenchée
- **AND** l’utilisateur peut sélectionner le `NodeRichText` (via le conteneur ou l’Explorer)

#### Scenario: Slide NodeSlideshow avec lien en édition

- **WHEN** le builder est en mode édition
- **AND** une slide de `NodeSlideshow` a un champ `link` renseigné
- **AND** l’utilisateur clique sur l’image ou le lien de la slide
- **THEN** aucune navigation n’est déclenchée

#### Scenario: NodeYoutube sélectionnable en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeYoutube` affiche un lecteur embarqué avec un `videoId` valide
- **AND** l’utilisateur clique sur la zone du lecteur dans le canevas
- **THEN** le nœud `NodeYoutube` peut être sélectionné
- **AND** le lecteur ne capture pas le clic pour lancer la lecture ou ouvrir YouTube

#### Scenario: NodeYoutube interactif en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **AND** un `NodeYoutube` affiche un lecteur embarqué
- **THEN** l’utilisateur peut interagir avec le lecteur YouTube normalement

### Requirement: Paramétrage NodeRoot par onglets

Le builder SHALL exposer un panneau **NodeSettings** pour le nœud racine **`NodeRoot`** (`node-root`) structuré en **onglets**, au minimum : **Général** (titre de la page), **Arrière-plan**, et **Typographie** (styles par défaut h1–h6, div, p). L’onglet **Typographie** SHALL conserver les champs existants (`fontSize`, `fontFamily`, `lineHeight`, `color`) par élément. Le titre de page SHALL continuer d’être persisté dans `node.content.title` et d’alimenter `document.title` comme aujourd’hui.

#### Scenario: Affichage des onglets NodeRoot

- **WHEN** l’utilisateur sélectionne le nœud racine `node-root` dans le builder (via le canevas ou le navigateur de composants)
- **THEN** le panneau droit affiche les onglets **Général**, **Arrière-plan** et **Typographie**
- **AND** le contenu de chaque onglet correspond à la section de configuration attendue

#### Scenario: Typographie inchangée après refonte

- **WHEN** l’utilisateur modifie la taille ou la couleur d’un élément (ex. `h1`) dans l’onglet **Typographie**
- **THEN** la valeur est persistée dans `node.content.defaultStyles`
- **AND** le rendu de la page applique les styles de typographie injectés comme avant la refonte

### Requirement: Arrière-plan de page NodeRoot

Le nœud **`NodeRoot`** SHALL permettre de configurer un **arrière-plan pleine page** persisté dans `node.content.background`. Le mode SHALL être **exclusif** parmi : **`default`** (comportement thème actuel, aucun fond personnalisé), **`color`**, **`image`**, **`video`**.

En mode **`color`**, le builder SHALL persister une couleur (`color`) et l’appliquer comme `background-color` sur le conteneur pleine page de la racine.

En mode **`image`**, le builder SHALL persister au minimum une URL d’image (`url`), une **position** (`position`, ex. `center`, `top`, `bottom`), une **taille** (`size`, ex. `cover`, `contain`) et un **repeat** (`repeat`). L’utilisateur SHALL pouvoir sélectionner l’image via la **médiathèque** (iframe file manager). Une **couleur de fallback** (`color`) MAY être renseignée et SHALL être appliquée sous l’image.

En mode **`video`**, le builder SHALL persister une URL de fichier vidéo (`url`). La vidéo SHALL être rendue en arrière-plan pleine page avec **lecture automatique**, **muette**, **en boucle** et **`playsInline`**. La couche vidéo SHALL être **fixée au viewport** (`position: fixed` ou équivalent) afin de rester visible pendant le défilement du contenu de la page. L’utilisateur SHALL pouvoir sélectionner la vidéo via la médiathèque (`type` vidéo). Le builder SHALL exposer au minimum un cadrage (`objectFit`, ex. `cover` / `contain`) et MAY exposer `objectPosition` et une image **poster** optionnelle. Une **couleur de fallback** (`color`) MAY être affichée pendant le chargement.

L’arrière-plan configuré SHALL être visible en mode **édition** (iframe), **prévisualisation** et **rendu final** (page publiée). En mode édition, la couche vidéo SHALL NOT intercepter les interactions pointeur du canevas (`pointer-events: none` ou équivalent).

Lorsqu’aucune clé `background` n’est présente ou que `type` vaut `default`, le rendu SHALL rester visuellement équivalent au comportement existant avant cette évolution.

#### Scenario: Fond couleur unie

- **WHEN** l’utilisateur choisit le type **Couleur** et renseigne `#1a2b3c`
- **THEN** `node.content.background` contient `{ type: 'color', color: '#1a2b3c' }`
- **AND** le conteneur pleine page de `NodeRoot` affiche cette couleur en arrière-plan

#### Scenario: Fond image avec position

- **WHEN** l’utilisateur choisit le type **Image**, sélectionne un fichier via la médiathèque et définit position `center` et taille `cover`
- **THEN** `node.content.background` contient `type: 'image'`, l’URL absolue de l’image, `position: 'center'` et `size: 'cover'`
- **AND** l’image couvre le viewport en arrière-plan de la page

#### Scenario: Fond vidéo en boucle

- **WHEN** l’utilisateur choisit le type **Vidéo** et sélectionne un fichier vidéo via la médiathèque
- **THEN** `node.content.background` contient `type: 'video'` et l’URL de la vidéo
- **AND** une balise vidéo en arrière-plan joue la vidéo en **autoplay**, **muted**, **loop** et **playsInline**
- **AND** la vidéo reste fixée au viewport pendant le défilement de la page
- **AND** les clics sur le canevas en mode édition atteignent toujours les nœuds enfants

#### Scenario: Page existante sans arrière-plan configuré

- **WHEN** une page chargée ne contient pas `node.content.background` sur `node-root`
- **THEN** le rendu visuel reste celui du thème par défaut (équivalent à `type: 'default'`)
- **AND** aucune erreur n’est levée à l’ouverture du builder

#### Scenario: Persistance après sauvegarde

- **WHEN** l’utilisateur configure un arrière-plan image ou vidéo et enregistre la page
- **THEN** après rechargement du builder ou consultation du rendu public, la même configuration d’arrière-plan est appliquée

### Requirement: Audit et retrait du code mort backend PHP

Le projet SHALL maintenir `src/` exempt de services, factories et blocs de configuration Symfony explicitement morts (classes non injectées, paramètres `services.yaml` sans consommateur, listeners référençant des routes supprimées). L’audit SHALL combiner PHPStan (niveau bas minimal) et revue manuelle des `services.yaml` avant suppression.

#### Scenario: Services legacy média retirés

- **WHEN** le stockage média est entièrement délégué à keyboardman/filesystem-bundle
- **THEN** `MediaStorage`, `S3ClientFactory` et le bloc `media_storage.*` de `config/services.yaml` sont absents ou documentés comme exception justifiée

#### Scenario: Tests après nettoyage PHP

- **WHEN** des classes ou paramètres morts sont retirés de `src/` ou `config/`
- **THEN** `composer test` réussit et les routes `/filemanager` et `/api/filesystem/*` restent opérationnelles

### Requirement: Factorisation des composants dupliqués du builder

Les paires de nœuds ou settings partageant la même structure de rendu SHALL utiliser des modules partagés plutôt que des copies locales, lorsque la duplication est confirmée par l’audit (ex. vues Card entre `NodeCard` et `NodeCardApi`, settings icône entre `NodeIcone` et `NodeTextIcon`). Les classes CSS, sélecteurs d’override thème et contrats de contenu JSON des nœuds SHALL être préservés après factorisation.

#### Scenario: Vues Card partagées

- **WHEN** `NodeCard` et `NodeCardApi` exposent des composants de vue identiques (titre, lien, image)
- **THEN** ces composants résident dans un module partagé sous `assets/editeur/ManagerNode/` et sont importés par les deux nœuds sans duplication de fichier

#### Scenario: Settings icône partagés

- **WHEN** `NodeIcone` et `NodeTextIcon` partagent la même logique de réglages d’icône et de conteneur
- **THEN** un composant ou factory de settings partagé est utilisé par les deux panneaux Settings

#### Scenario: Rendu inchangé après factorisation

- **WHEN** l’utilisateur édite une page contenant des nœuds Card, CardApi, Icone ou TextIcon avant et après la factorisation
- **THEN** le rendu preview et public reste visuellement et structurellement identique

### Requirement: Documentation technique alignée sur l’implémentation

La documentation du dépôt SHALL refléter l’état réel du code : stack, commandes de développement, intégration file manager keyboardman, et entrypoints Webpack actifs. `openspec/project.md` SHALL documenter le purpose du projet, la stack et les conventions de test. `README.md` SHALL fournir une vue d’ensemble et les commandes essentielles (Docker, Encore, PHPUnit). Les documents obsolètes contredisant l’implémentation (ex. file manager non installé, entrypoint `fileManager` actif) SHALL être corrigés ou archivés.

#### Scenario: project.md exploitable

- **WHEN** un contributeur ouvre `openspec/project.md`
- **THEN** il trouve le purpose du projet, la stack technique, l’architecture du page builder et la procédure d’initialisation de la base de données

#### Scenario: README et AGENTS cohérents avec le file manager

- **WHEN** un contributeur suit `README.md` ou `AGENTS.md` pour accéder aux médias
- **THEN** la documentation indique `/filemanager` (keyboardman) et l’intégration iframe du builder, sans référence à une page `/media` React legacy ni à l’entrypoint `fileManager`

#### Scenario: Script d’audit documenté

- **WHEN** un contributeur exécute `npm run audit:dead-code`
- **THEN** un rapport liste les exports et dépendances candidates à la suppression dans `assets/`, documenté dans `openspec/project.md` ou `README.md`

### Requirement: Tests unitaires frontend du builder

Le projet SHALL fournir une infrastructure de tests unitaires pour le code React/TypeScript sous `assets/editeur/`, exécutable via `npm run test:frontend:run`, indépendamment du build Webpack Encore.

#### Scenario: Exécution locale

- **WHEN** un développeur lance `npm run test:frontend:run`
- **THEN** Vitest exécute les fichiers `assets/**/*.{test,spec}.{ts,tsx}` et retourne un code de sortie 0 si tous les tests passent

#### Scenario: Couverture minimale des utilitaires

- **WHEN** les tests frontend sont exécutés
- **THEN** les fonctions de libellé de nœuds (`getNodeDisplayLabel`, `getNodeTypeLabel`) sont couvertes par au moins un test par cas nominal

### Requirement: Documentation des tests frontend

La documentation du dépôt SHALL décrire comment écrire et lancer un test de composant React (utilitaires, hooks, composants avec contexte mocké).

#### Scenario: Guide contributeur

- **WHEN** un développeur consulte `docs/frontend-testing.md` ou la section Testing de `openspec/project.md`
- **THEN** il trouve les commandes npm, la convention de nommage des fichiers de test et un exemple avec `NodeBuilderContext`

### Requirement: URL API absolue en preview et rendu public

Lors du chargement de la **preview admin** ou du **rendu public** d’une page (entrypoint `pagePreview`), le système SHALL injecter une **URL absolue** pour la base API page-builder (ex. `https://pagebuilder.example/api/page-builder`) dans les données passées au frontend (attribut `data-api-cards-base-url` ou équivalent). Les appels HTTP effectués par `registerBackendApis` et les adaptateurs card (`fetchCollection`, `fetchItem`, `fetchCategories`) SHALL cibler cet hôte, de sorte que le rendu fonctionne lorsque la page est affichée depuis un autre domaine, un reverse proxy ou une iframe sans réécrire l’origine des requêtes vers le site hôte.

Le post-traitement serveur du HTML de rendu public (`PageController::renderPageContent` ou équivalent) SHALL absolutiser les attributs `data-*` contenant des chemins relatifs vers l’API page-builder, de la même manière que les attributs `href` et `src` déjà traités.

#### Scenario: Rendu public avec URL API absolue

- **WHEN** un client charge la route GET de rendu public d’une page existante
- **THEN** le HTML renvoyé contient `data-api-cards-base-url` avec une URL absolue pointant vers `/api/page-builder` sur l’hôte du page builder (schéma + host + chemin)

#### Scenario: Appels API depuis une intégration cross-site

- **WHEN** la page de rendu est affichée dans un contexte où l’origine visible diffère de celle du page builder (iframe, reverse proxy, domaine tiers)
- **THEN** les requêtes réseau déclenchées par `pagePreview` vers la liste des cards et les collections/items utilisent l’URL absolue du page builder et non un chemin relatif résolu contre l’origine du site hôte

#### Scenario: Preview admin alignée sur le rendu public

- **WHEN** un éditeur authentifié ouvre la preview admin d’une page contenant des nœuds consommateurs d’API card
- **THEN** `data-api-cards-base-url` est également une URL absolue, avec le même format que sur le rendu public

