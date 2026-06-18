## MODIFIED Requirements

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

## ADDED Requirements

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
