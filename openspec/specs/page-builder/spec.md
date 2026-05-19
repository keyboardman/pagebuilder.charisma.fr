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

