## ADDED Requirements

### Requirement: Visibilité des nœuds

Le builder SHALL permettre de **masquer** un nœud sans le supprimer, via une propriété optionnelle `hidden` (booléen) sur `NodeType`. Par défaut (`hidden` absent ou `false`), le nœud est visible.

Un nœud est **effectivement masqué** si `hidden === true` sur ce nœud ou sur **l'un de ses ancêtres**. Le masquage d'un conteneur SHALL masquer implicitement tout son sous-arbre à l'affichage, sans modifier le flag `hidden` des descendants en base.

Le nœud racine (`node-root`) SHALL **ne pas** pouvoir être masqué.

En modes **édition** (`edit`), **prévisualisation** (`preview`), **vue** (`view`) et **rendu public**, un nœud effectivement masqué SHALL **ne pas être rendu** sur le canevas (aucun HTML de ce nœud ni de ses descendants), afin que le mode édition reflète fidèlement la prévisualisation.

En mode **édition**, un nœud effectivement masqué SHALL rester présent dans le navigateur Structure (avec icône œil barré et style atténué) afin de permettre sa réactivation et l'accès à ses réglages via la sélection dans l'arbre.

La propriété `hidden` SHALL être **persistée** dans le JSON de la page à la sauvegarde et **restaurée** au rechargement.

#### Scenario: Masquage d'un nœud feuille

- **WHEN** l'utilisateur masque un nœud feuille (ex. `NodeText`) depuis le navigateur Structure
- **THEN** ce nœud possède `hidden: true` dans l'état du builder
- **AND** il n'apparaît plus sur le canevas en mode édition ni en prévisualisation ni en rendu public
- **AND** il reste visible dans le navigateur Structure

#### Scenario: Masquage d'un conteneur et de ses enfants

- **WHEN** l'utilisateur masque un conteneur (ex. `NodeFlex`, `NodeGrid`)
- **THEN** le conteneur et tous ses descendants sont effectivement masqués à l'affichage
- **AND** les enfants conservent leur propre valeur `hidden` en base (non modifiée)

#### Scenario: Réactivation d'un nœud masqué

- **WHEN** l'utilisateur réactive un nœud précédemment masqué (`hidden: false` ou propriété retirée)
- **THEN** le nœud redevient visible en prévisualisation et en rendu public
- **AND** ses descendants masqués individuellement (`hidden: true`) restent masqués

#### Scenario: Enfant masqué individuellement sous parent visible

- **WHEN** un parent est visible et un enfant possède `hidden: true`
- **THEN** seul l'enfant (et ses descendants) est masqué à l'affichage

#### Scenario: Impossibilité de masquer la racine

- **WHEN** l'utilisateur consulte l'entrée `node-root` dans le navigateur Structure
- **THEN** aucun contrôle de masquage n'est proposé pour ce nœud

#### Scenario: Persistance du masquage

- **WHEN** l'utilisateur sauvegarde une page contenant des nœuds masqués puis la rouvre
- **THEN** les nœuds masqués conservent `hidden: true`
- **AND** leur visibilité effective est identique à avant sauvegarde

## MODIFIED Requirements

### Requirement: Navigateur de composants en arbre

En mode édition, le builder SHALL exposer un **navigateur de composants** affichant la hiérarchie des nœuds de la page sous forme d'**arbre** (structure parent/enfant analogue à un arbre DOM). Le navigateur SHALL être accessible depuis la **sidebar gauche** (onglet ou section dédiée, distincte de la bibliothèque de blocs). Il SHALL partir du nœud racine de la page (`node-root`) et SHALL lister récursivement les descendants selon les relations `parent` des `NodesType`, y compris lorsque les enfants sont répartis dans **plusieurs zones** de dépôt d'un même conteneur (ex. cellules de grille).

Chaque entrée de l'arbre SHALL afficher un libellé lisible. Lorsqu'un **nom personnalisé** (`editorLabel`) est défini sur le nœud, il SHALL être affiché en priorité, avec le libellé de type (registre `NodeRegistry`) indiqué de façon secondaire (ex. entre parenthèses). À défaut de nom personnalisé, le libellé SHALL être dérivé du type de nœud (libellé du registre `NodeRegistry` lorsqu'il est défini) ou, le cas échéant, d'un libellé de contenu pertinent (ex. `NodeNavItem`). Les nœuds conteneurs SHALL pouvoir être **repliés ou dépliés** pour parcourir la structure.

Chaque entrée de l'arbre (sauf `node-root`) SHALL afficher une **icône œil** permettant de basculer la visibilité du nœud (`hidden`). L'icône SHALL refléter l'état de visibilité effective : œil ouvert si visible, œil barré si effectivement masqué. Un clic sur l'icône SHALL basculer `hidden` sur le nœud correspondant **sans** déclencher la sélection de ce nœud. Les entrées effectivement masquées SHALL être visuellement distinguées (ex. opacité réduite).

#### Scenario: Affichage de l'arbre en mode édition

- **WHEN** l'utilisateur ouvre le builder en mode édition et consulte le navigateur de composants
- **THEN** la hiérarchie des nœuds de la page courante est affichée en arbre à partir de `node-root`
- **AND** les nœuds imbriqués apparaissent comme enfants de leur conteneur parent

#### Scenario: Enfants dans plusieurs zones

- **WHEN** un conteneur possède des enfants dans plus d'une zone (ex. grille `NodeGrid` avec cellules `cell-*`)
- **THEN** l'arbre regroupe ou identifie ces enfants sous leur zone respective afin de refléter la structure réelle de la page

#### Scenario: Repli et dépli des conteneurs

- **WHEN** l'utilisateur replie un nœud conteneur dans le navigateur
- **THEN** les descendants de ce conteneur ne sont plus visibles jusqu'au dépli

#### Scenario: Nom personnalisé affiché dans l'arbre

- **WHEN** un nœud possède un `editorLabel` non vide
- **THEN** l'entrée correspondante dans le navigateur affiche ce nom en priorité
- **AND** le libellé de type du nœud reste identifiable (ex. entre parenthèses)

#### Scenario: Bascule de visibilité depuis l'icône œil

- **WHEN** l'utilisateur clique sur l'icône œil d'une entrée du navigateur (hors `node-root`)
- **THEN** la propriété `hidden` du nœud correspondant est inversée
- **AND** le nœud n'est pas sélectionné par ce clic
- **AND** l'icône et le style de la ligne reflètent immédiatement le nouvel état de visibilité

#### Scenario: Icône œil absente sur la racine

- **WHEN** l'utilisateur consulte l'entrée `node-root` dans le navigateur
- **THEN** aucune icône œil n'est affichée pour cette entrée
