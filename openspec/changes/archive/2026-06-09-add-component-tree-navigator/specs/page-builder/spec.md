## ADDED Requirements

### Requirement: Navigateur de composants en arbre

En mode édition, le builder SHALL exposer un **navigateur de composants** affichant la hiérarchie des nœuds de la page sous forme d’**arbre** (structure parent/enfant analogue à un arbre DOM). Le navigateur SHALL être accessible depuis la **sidebar gauche** (onglet ou section dédiée, distincte de la bibliothèque de blocs). Il SHALL partir du nœud racine de la page (`node-root`) et SHALL lister récursivement les descendants selon les relations `parent` des `NodesType`, y compris lorsque les enfants sont répartis dans **plusieurs zones** de dépôt d’un même conteneur (ex. cellules de grille).

Chaque entrée de l’arbre SHALL afficher un libellé lisible dérivé du type de nœud (libellé du registre `NodeRegistry` lorsqu’il est défini). Les nœuds conteneurs SHALL pouvoir être **repliés ou dépliés** pour parcourir la structure.

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
