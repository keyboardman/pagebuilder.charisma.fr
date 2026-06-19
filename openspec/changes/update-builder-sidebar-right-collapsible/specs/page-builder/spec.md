## ADDED Requirements

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
