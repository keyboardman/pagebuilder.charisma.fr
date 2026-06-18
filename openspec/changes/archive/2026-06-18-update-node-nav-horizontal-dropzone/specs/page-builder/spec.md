## MODIFIED Requirements

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
