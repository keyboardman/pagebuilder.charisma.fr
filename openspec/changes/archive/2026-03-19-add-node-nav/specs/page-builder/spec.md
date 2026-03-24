## ADDED Requirements

### Requirement: Conteneur de navigation (NodeNav)

Le builder SHALL fournir un type de nœud conteneur **NodeNav** (identifiant `node-nav`) qui n’accepte comme enfants que des nœuds de type **NodeNavItem**. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeNav SHALL exposer les options configurables suivantes : **direction** (horizontal, vertical) pour l’alignement des items, et **icône burger** (booléen) pour recenser tous les NodeNavItem dans un menu repliable (ex. menu burger sur mobile).

#### Scenario: Ajout d’un NodeNav depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le menu de navigation (NodeNav)
- **THEN** un nœud NodeNav est inséré dans la page ; l’utilisateur peut y déposer uniquement des NodeNavItem ; les autres types de blocs ne sont pas acceptés dans ce conteneur

#### Scenario: Direction horizontal ou vertical

- **WHEN** l’utilisateur modifie l’option direction du NodeNav (horizontal ou vertical) dans les paramètres du nœud
- **THEN** les NodeNavItem enfants sont alignés selon cette direction dans l’éditeur, la prévisualisation et le rendu final

#### Scenario: Icône burger pour recenser les items

- **WHEN** l’option « icône burger » est activée sur un NodeNav
- **THEN** une icône burger est affichée et permet de recenser ou d’afficher tous les NodeNavItem (ex. liste déroulante ou overlay) ; le comportement est visible en prévisualisation et à l’export

#### Scenario: Persistance du NodeNav

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeNav avec direction et option burger définies
- **THEN** le contenu sérialisé conserve la structure, la direction, l’état de l’option burger et les références aux NodeNavItem enfants

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
