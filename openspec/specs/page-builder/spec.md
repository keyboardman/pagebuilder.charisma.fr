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

#### Scenario: Édition avec styles du thème

- **WHEN** l'utilisateur édite une page avec un thème ayant un fichier CSS généré
- **THEN** la feuille de style du thème est chargée dans la page d'édition et le contenu affiché dans le builder utilise ces styles

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

#### Scenario: Ajout d’un conteneur Flex depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l’utilisateur peut y déposer d’autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l’utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l’éditeur selon ces propriétés ; le rendu en prévisualisation et à l’export reflète le même alignement

#### Scenario: Persistance du conteneur Flex

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l’affichage

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText).

#### Scenario: Ajout d’un NodeButton depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l’utilisateur peut modifier le type (button / submit / link), le libellé et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l’utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Paramètres visuels (fond, bordure, texte)

- **WHEN** l’utilisateur modifie les options du NodeButton via Background2Settings, Border2Settings ou Text2Settings
- **THEN** les styles sont appliqués immédiatement sur le bouton ou le lien dans l’éditeur ; le rendu en prévisualisation et à l’export reflète ces styles

#### Scenario: Persistance du NodeButton

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé, href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l’affichage

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

#### Scenario: Ajout d’un NodeNav depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le menu de navigation (NodeNav)
- **THEN** un nœud NodeNav est inséré dans la page ; l’utilisateur peut y déposer uniquement des NodeNavItem ; les autres types de blocs ne sont pas acceptés dans ce conteneur

#### Scenario: Direction horizontal ou vertical

- **WHEN** l’utilisateur modifie l’option direction du NodeNav (horizontal ou vertical) dans les paramètres du nœud
- **THEN** les NodeNavItem enfants sont alignés selon cette direction dans l’éditeur, la prévisualisation et le rendu final

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

#### Scenario: Persistance de la configuration du node
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow
- **THEN** les images (dans leur ordre), leurs métadonnées de slide (dont `alt`, source d'image et lien éventuel), ainsi que les options d’affichage Swiper définies, sont sérialisées et restituées lors d’un rechargement

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)
Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d’un endpoint API image (collection fixe) dans le panneau ; le système charge automatiquement la collection et la mappe en slides.

Dans les deux modes, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final.

Après chaque action, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview.

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la liste des slides affichée (et recharger depuis l’API lorsque `api-endpoint` est sélectionné).

#### Scenario: Tri par drag-and-drop
- **WHEN** l’utilisateur réordonne les slides par drag-and-drop
- **THEN** l’ordre Swiper correspond à l’ordre visuel dans la liste

#### Scenario: Ajout de slide en mode manuel (saisie d’URL)
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur clique sur “Ajouter une slide”
- **AND** l’utilisateur renseigne une URL dans le champ “Source (URL)”
- **THEN** une nouvelle slide apparaît dans la liste et la preview est mise à jour

#### Scenario: Suppression de la slide sélectionnée
- **WHEN** l’utilisateur sélectionne une slide puis clique “Supprimer”
- **THEN** la slide est retirée de la liste et la preview est mise à jour

#### Scenario: Sélection d’un endpoint API pour charger les slides
- **WHEN** l’utilisateur passe en mode `api-endpoint`
- **AND** l’utilisateur sélectionne une API image fixe dans le sélecteur “Endpoint API (image fixed)”
- **THEN** les slides sont chargées automatiquement depuis la collection de l’API sélectionnée

#### Scenario: Lien optionnel par slide
- **WHEN** l’utilisateur renseigne une URL de lien sur une slide
- **THEN** la slide devient cliquable dans le rendu
- **WHEN** l’utilisateur vide le champ de lien
- **THEN** la slide redevient non cliquable

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

Le builder SHALL fournir un type de nœud **NodeRichText** (identifiant `node-rich-text`) permettant l’édition de texte riche sans saisie de HTML brut. Le nœud SHALL proposer un éditeur visuel (WYSIWYG) directement dans l’interface de configuration du nœud.

#### Scenario: Ajout d’un NodeRichText depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud texte riche (NodeRichText)
- **THEN** un nœud NodeRichText est inséré dans la page avec un contenu texte initial éditable

### Requirement: Mise en forme riche de base

Le nœud NodeRichText SHALL exposer au minimum les actions de mise en forme suivantes: **gras**, **italique**, **souligné**, **barré**, **liste à puces**, **liste numérotée** et **lien**. Les actions SHALL s’appliquer à la sélection courante dans l’éditeur.

#### Scenario: Application d’un style inline
- **WHEN** l’utilisateur sélectionne un texte dans NodeRichText puis active une action inline (ex. gras ou italique)
- **THEN** la mise en forme est appliquée immédiatement au texte sélectionné dans l’éditeur et visible en preview

#### Scenario: Création d’une liste
- **WHEN** l’utilisateur sélectionne un ou plusieurs paragraphes et active une liste à puces ou numérotée
- **THEN** le contenu est transformé en liste correspondante dans le rendu du NodeRichText

#### Scenario: Insertion d’un lien
- **WHEN** l’utilisateur sélectionne du texte puis renseigne une URL via l’action lien
- **THEN** le texte est rendu comme lien cliquable avec l’URL configurée

### Requirement: Persistance du contenu riche

Le builder SHALL sérialiser le contenu de NodeRichText dans le format de persistance existant de page et SHALL le restaurer de manière éditable lors du rechargement.

#### Scenario: Sauvegarde et rechargement du NodeRichText
- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeRichText
- **THEN** le contenu riche (structure et formats) est conservé et restitué à l’identique lors de la réouverture de la page

### Requirement: Conteneur formulaire (NodeForm)

Le builder SHALL fournir un type de nœud conteneur **NodeForm** (identifiant `node-form`) représentant un élément HTML `<form>`. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeForm SHALL exposer au minimum les propriétés configurables **method** (méthode HTTP, ex. `GET` ou `POST`) et **action** (URL absolue ou relative de soumission). Le NodeForm SHALL soumettre le formulaire en **AJAX** via `fetch` lors du `submit` (interception de l’événement), et afficher un message d’alerte de retour (succès en fond vert, erreur en fond rouge) dans l’interface de l’éditeur. Le NodeForm SHALL autoriser comme descendants directs ou indirects : les nœuds **NodeFormInput**, **NodeFormSelect**, **NodeFormRadio**, les nœuds **NodeButton** (pour des actions comme “submit”), et les nœuds du builder dont la catégorie d’enregistrement est **container** (ex. NodeFlex, NodeGrid, NodeContainer), afin de permettre la mise en page à l’intérieur du formulaire. Le NodeForm SHALL refuser l’imbrication d’un second NodeForm en tant qu’enfant (formulaires non imbriqués).

#### Scenario: Ajout d’un NodeForm depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur formulaire (NodeForm)
- **THEN** un nœud NodeForm est inséré dans la page ; l’utilisateur peut définir method et action, et déposer des champs formulaire et des conteneurs de mise en page dans la zone du formulaire

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

