## ADDED Requirements

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
