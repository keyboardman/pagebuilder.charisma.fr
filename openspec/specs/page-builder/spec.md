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

Le builder SHALL fournir un type de nœud conteneur **NodeFlex** (identifiant `node-flex`) dans lequel les composants enfants sont alignés à l’aide des propriétés CSS Flexbox. Le nœud SHALL être droppable (une zone unique, par ex. `main`) et SHALL exposer des options configurables pour la disposition flex : direction (row, column, row-reverse, column-reverse), justify-content, align-items, gap et flex-wrap.

En mode **édition** et direction **horizontale** (`row`, `row-reverse`) avec **justify-content** à `flex-start`, le conteneur flex `.ce-flex-inner` SHALL occuper toute la largeur disponible. La zone de dépôt du conteneur `main` — qu’elle soit **seule** (flex vide) ou **finale** (après les enfants) — SHALL occuper l’espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente aux dropzones vides (`min-height: 2.5rem`), afin que l’utilisateur puisse identifier et cibler facilement l’emplacement de dépôt sans chercher visuellement. Les dropzones intermédiaires (entre enfants) conservent leur taille compacte actuelle pour le réordonnancement précis. Lorsque **justify-content** est `center`, `flex-end` ou une valeur `space-*`, la dropzone finale reste **compacte** en mode édition afin de ne pas perturber l’alignement des enfants ni bloquer leur sélection.

Lorsque l’option **wrap** est `nowrap`, le style CSS `flex-wrap: nowrap` SHALL être appliqué **uniquement** en modes **preview** et **view** (prévisualisation et rendu final). En mode **edit**, le conteneur SHALL utiliser `flex-wrap: wrap` afin que les enfants et la dropzone restent accessibles au drag-and-drop, sans modifier la valeur `nowrap` persistée dans le contenu du nœud.

#### Scenario: Ajout d’un conteneur Flex depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l’utilisateur peut y déposer d’autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l’utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l’éditeur selon ces propriétés (sauf `flex-wrap: nowrap` en mode édition, voir scénario dédié) ; le rendu en prévisualisation et à l’export reflète l’alignement complet, y compris `nowrap` si configuré

#### Scenario: Dropzone visible en horizontal sans enfant

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) ne contient aucun enfant et que le builder est en mode édition
- **THEN** le conteneur `.ce-flex-inner` occupe toute la largeur disponible
- **AND** la zone de dépôt unique s’étend sur cet espace horizontal disponible
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)

#### Scenario: Dropzone finale visible en horizontal avec enfants existants

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) avec **justify-content** `flex-start` contient au moins un enfant et que le builder est en mode édition
- **THEN** la dernière zone de dépôt du conteneur `main` s’étend pour occuper l’espace horizontal restant après les enfants
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)
- **AND** les dropzones entre les enfants restent compactes pour permettre un réordonnancement précis

#### Scenario: Dropzone compacte si justify autre que flex-start

- **WHEN** un NodeFlex en direction horizontale utilise **justify-content** `center`, `flex-end` ou une valeur `space-*` et que le builder est en mode édition
- **THEN** la dropzone finale du conteneur `main` reste compacte (sans `flex: 1`)
- **AND** les enfants conservent l’alignement configuré et restent sélectionnables

#### Scenario: No wrap appliqué uniquement en preview et view

- **WHEN** l’utilisateur configure l’option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **preview** ou **view**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: nowrap` et les enfants ne passent pas à la ligne

#### Scenario: No wrap ignoré en mode édition

- **WHEN** l’utilisateur configure l’option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **edit**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: wrap` (les enfants peuvent passer à la ligne)
- **AND** la valeur `nowrap` reste enregistrée dans les options du nœud pour la prévisualisation et le rendu final

#### Scenario: Persistance du conteneur Flex

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l’affichage, y compris l’option `wrap` telle que configurée

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText). Le libellé (`content.label`) SHALL être éditable en inline dans le canevas et SHALL supporter le **gras partiel** conformément à l'exigence **Gras partiel du libellé NodeButton**.

#### Scenario: Ajout d’un NodeButton depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l’utilisateur peut modifier le type (button / submit / link), le libellé (y compris gras partiel) et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l’utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Paramètres visuels (fond, bordure, texte)

- **WHEN** l’utilisateur modifie les options du NodeButton via Background2Settings, Border2Settings ou Text2Settings
- **THEN** les styles sont appliqués immédiatement sur le bouton ou le lien dans l’éditeur ; le rendu en prévisualisation et à l’export reflète ces styles

#### Scenario: Persistance du NodeButton

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé (texte brut ou HTML inline de gras autorisé), href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l’affichage

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

Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d’un endpoint API image (collection fixe) dans le panneau ; le système charge la collection à l’affichage via `fetchCollection` et la mappe en slides, sans persister les données de la collection dans le contenu du nœud.

En mode `manual`, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final. En mode `api-endpoint`, les liens SHALL provenir du mapping ApiCard (`mapItem`) de chaque item.

Après chaque action en mode `manual`, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview. En mode `api-endpoint`, la preview SHALL refléter la collection API courante (rechargée à l’affichage ou via le bouton « Recharger » du panneau).

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la source des slides affichées (liste manuelle vide ou placeholder en mode API) et SHALL purger toute donnée de slide persistée lorsque le mode API est actif.

En mode `api-endpoint`, la sélection de l’API SHALL utiliser le composant standard `ApiManagerModal` avec filtre de type `image` et mode de collection `fixed`, de sorte que seules les APIs cards image adaptées au diaporama sont proposées (sans mélange avec le catalogue de polices servi par `/api/builder/fonts`).

#### Scenario: Tri par drag-and-drop en mode manuel

- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur réordonne les slides par drag-and-drop
- **THEN** l’ordre Swiper correspond à l’ordre visuel dans la liste

#### Scenario: Ajout de slide en mode manuel (saisie d’URL)

- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur clique sur “Ajouter une slide”
- **AND** l’utilisateur renseigne une URL dans le champ “Source (URL)”
- **THEN** une nouvelle slide apparaît dans la liste et la preview est mise à jour

#### Scenario: Suppression de la slide sélectionnée

- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur sélectionne une slide puis clique “Supprimer”
- **THEN** la slide est retirée de la liste et la preview est mise à jour

#### Scenario: Sélection d’un endpoint API pour afficher les slides

- **WHEN** l’utilisateur passe en mode `api-endpoint`
- **AND** l’utilisateur sélectionne une API image fixe via `ApiManagerModal` (filtre type `image`, collection `fixed`)
- **THEN** les slides sont chargées depuis la collection de l’API sélectionnée pour la preview
- **AND** seuls `slidesMode` et `apiId` sont persistés dans le contenu du nœud

#### Scenario: Données API fraîches à l’affichage

- **WHEN** un NodeSlideshow en mode `api-endpoint` avec un `apiId` valide est affiché (éditeur, preview ou rendu final)
- **THEN** le système appelle `fetchCollection` sur l’API référencée et mappe les items en slides
- **AND** le rendu reflète la collection courante de l’API, indépendamment d’un éventuel snapshot `slides` présent dans d’anciennes sauvegardes

#### Scenario: Rechargement manuel dans le panneau

- **WHEN** l’utilisateur clique sur “Recharger” en mode `api-endpoint`
- **THEN** la preview des vignettes est rafraîchie depuis l’API sans écrire les slides dans le contenu persisté du nœud

#### Scenario: Lien optionnel par slide en mode manuel

- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur renseigne une URL de lien sur une slide
- **THEN** la slide devient cliquable dans le rendu
- **WHEN** l’utilisateur vide le champ de lien
- **THEN** la slide redevient non cliquable

#### Scenario: API indisponible ou collection vide en mode API

- **WHEN** l’API sélectionnée ne répond pas, retourne une erreur ou une collection vide en mode `api-endpoint`
- **THEN** le NodeSlideshow affiche un état dégradé (placeholder ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Sélection d’API sans mélange avec le catalogue Font

- **WHEN** l’utilisateur configure la source API d’un NodeSlideshow
- **THEN** `ApiManagerModal` n’affiche que les APIs cards de type `image` en collection `fixed` ; les endpoints du catalogue `Font` (`/api/builder/fonts`) ne figurent pas dans cette liste

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

Le builder SHALL fournir un type de nœud **NodeNavApi** (identifiant `node-nav-api`) qui affiche un menu de navigation alimenté par une **ApiCard** de type `list` (voir capacité `builder-api-registry`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection via les endpoints Symfony (`fetchCollection`) et SHALL rendre chaque item mappé comme un lien (`title` → libellé, `link` → `href`). Le nœud SHALL exposer une option **target** (`_self` ou `_blank`) appliquée à tous les liens du menu ; cette option SHALL être configurée côté **NodeNavApi** et ne SHALL pas dépendre du mapping ApiCard `list`. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d’enfants **NodeNavItem** : les entrées proviennent uniquement de l’API.

Le NodeNavApi SHALL réutiliser les options de présentation du **NodeNav** : **direction** (horizontal, vertical), **variante** (`navbar`, `liste`) avec hooks DOM (`data-ce-variant`, classe `ce-menu--{variant}` sur le conteneur `<nav>`), **icône burger** (booléen) pour regrouper les liens sur petit viewport, ainsi que les réglages d’alignement et d’espacement équivalents (ex. `justify`, `gap`) lorsqu’ils sont supportés par **NodeNav**. Le NodeNavApi SHALL exposer une option **scrollWithoutScrollbar** (défilement sans barre visible) : lorsqu’elle est activée, les liens dépassant la largeur (ou la hauteur en mode vertical) SHALL être scrollables à la souris (molette, trackpad) et au tactile, sans afficher de barre de défilement.

#### Scenario: Ajout d’un NodeNavApi depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc menu API (NodeNavApi) depuis le panneau des composants
- **THEN** un nœud `node-nav-api` est inséré ; l’utilisateur peut choisir une API de type `list` dans les réglages ; aucun enfant manuel n’est attendu

#### Scenario: Sélection d’une API list

- **WHEN** l’utilisateur ouvre les réglages du NodeNavApi et choisit une API
- **THEN** seules les APIs enregistrées avec le type `list` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des liens depuis la collection

- **WHEN** le NodeNavApi a un `apiId` valide et que l’endpoint collection retourne des items mappés
- **THEN** le builder affiche un `<nav>` contenant un lien par item (`<a href="…">` avec le libellé `title`) dans l’éditeur, la prévisualisation et le rendu exporté

#### Scenario: Option target appliquée à tous les liens

- **WHEN** l’utilisateur configure l’option **target** du NodeNavApi sur `_blank`
- **THEN** tous les liens rendus depuis la collection API utilisent `target="_blank"` (et `rel="noopener noreferrer"`) quel que soit le contenu mappé par l’ApiCard `list`

#### Scenario: Options direction et variante

- **WHEN** l’utilisateur modifie la direction ou la variante (`navbar` / `liste`) du NodeNavApi
- **THEN** le rendu applique les mêmes conventions DOM que **NodeNav** (`data-ce-variant`, `ce-menu--{variant}`) pour permettre le styling CSS thème

#### Scenario: Défilement sans barre de scroll

- **WHEN** l’utilisateur active l’option de défilement sans barre sur un NodeNavApi horizontal contenant plus de liens que la largeur disponible
- **THEN** le menu permet de faire défiler les liens à la molette ou au glissement tactile sans afficher de scrollbar ; en mode vertical, le défilement suit l’axe vertical

#### Scenario: Menu burger sur petit viewport

- **WHEN** l’utilisateur active l’option burger sur un NodeNavApi
- **THEN** sur viewport tablette/mobile (selon les mêmes règles que **NodeNav**), une icône burger permet d’afficher ou masquer la liste des liens issus de l’API

#### Scenario: API indisponible ou vide

- **WHEN** l’API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeNavApi affiche un état dégradé (menu vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeNavApi

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeNavApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, les options de présentation (direction, variante, burger, etc.) et permet de recharger le menu à l’affichage

### Requirement: Navigateur de composants en arbre

En mode édition, le builder SHALL exposer un **navigateur de composants** affichant la hiérarchie des nœuds de la page sous forme d’**arbre** (structure parent/enfant analogue à un arbre DOM). Le navigateur SHALL être accessible depuis la **sidebar gauche** (onglet ou section dédiée, distincte de la bibliothèque de blocs). Il SHALL partir du nœud racine de la page (`node-root`) et SHALL lister récursivement les descendants selon les relations `parent` des `NodesType`, y compris lorsque les enfants sont répartis dans **plusieurs zones** de dépôt d’un même conteneur (ex. cellules de grille).

Chaque entrée de l’arbre SHALL afficher un libellé lisible. Lorsqu’un **nom personnalisé** (`editorLabel`) est défini sur le nœud, il SHALL être affiché en priorité, avec le libellé de type (registre `NodeRegistry`) indiqué de façon secondaire (ex. entre parenthèses). À défaut de nom personnalisé, le libellé SHALL être dérivé du type de nœud (libellé du registre `NodeRegistry` lorsqu’il est défini) ou, le cas échéant, d’un libellé de contenu pertinent (ex. `NodeNavItem`). Les nœuds conteneurs SHALL pouvoir être **repliés ou dépliés** pour parcourir la structure.

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

Le nœud **NodeButton** SHALL permettre de mettre en **gras une partie seulement** de son libellé (`content.label`), sans appliquer le gras à l'intégralité du bouton via **Text2Settings**. L'édition SHALL s'effectuer en **inline** dans le canevas lorsque l'utilisateur modifie le libellé du bouton ou du lien. Le système SHALL exposer une action **Gras** (et le raccourci **Ctrl/Cmd+B**) applicable à la sélection courante dans le libellé. Le libellé SHALL être persisté avec des balises inline limitées (`<strong>` ou `<b>`) ; toute autre balise SHALL être supprimée à l'enregistrement. Le rendu en édition, en prévisualisation et à l'export SHALL afficher le gras partiel. Les libellés texte brut existants (sans balises HTML) SHALL rester valides et inchangés visuellement.

#### Scenario: Gras sur une sélection du libellé
- **WHEN** l'utilisateur sélectionne une portion du libellé d'un NodeButton en édition inline et active l'action Gras (bouton ou Ctrl/Cmd+B)
- **THEN** seule la portion sélectionnée est rendue en gras dans le canevas ; le reste du libellé conserve son apparence normale

#### Scenario: Rendu preview et export
- **WHEN** un NodeButton possède un libellé avec une partie en gras
- **THEN** la prévisualisation et le rendu HTML final affichent le même gras partiel sur le bouton ou le lien

#### Scenario: Persistance du libellé formaté
- **WHEN** l'utilisateur sauvegarde une page contenant un NodeButton dont le libellé comporte du gras partiel
- **THEN** le contenu sérialisé conserve les balises de gras autorisées ; à la réouverture de la page, le libellé et le formatage partiel sont restaurés à l'identique

#### Scenario: Rétrocompatibilité libellé texte brut
- **WHEN** une page contient un NodeButton avec un libellé texte brut sans balises HTML (contenu existant avant cette évolution)
- **THEN** le libellé s'affiche et s'édite comme auparavant, sans erreur ni altération du rendu

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

Le projet SHALL maintenir le dossier `assets/` exempt de modules, entrées Webpack et exports explicitement morts (fichiers non référencés par le build Encore, les templates Twig ou le code TypeScript/JavaScript actif). Toute évolution du flux polices ou des sélecteurs API du builder SHALL être précédée d’un inventaire documenté des candidats à la suppression et de la validation qu’aucun template ou entrypoint ne les référence encore.

#### Scenario: Inventaire avant modification fonts ou API

- **WHEN** une tâche vise à modifier le sélecteur de polices ou la sélection d’API d’un nœud (ex. NodeSlideshow)
- **THEN** un inventaire des fichiers et exports non référencés dans `assets/` est produit et les suppressions confirmées sont appliquées avant le changement fonctionnel

#### Scenario: Build après nettoyage

- **WHEN** des fichiers ou entrées Webpack morts sont retirés de `assets/`
- **THEN** la compilation Encore réussit et les entrypoints actifs (`pageBuilderStandalone`, `pagePreview`, `ThemeForm2`, `app`, `fileManager`) restent fonctionnels

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

