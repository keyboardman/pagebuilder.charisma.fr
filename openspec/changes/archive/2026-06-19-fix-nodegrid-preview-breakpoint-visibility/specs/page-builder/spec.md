## ADDED Requirements

### Requirement: Grille responsive NodeGrid

Le builder SHALL fournir un conteneur **NodeGrid** (identifiant `node-grid`) organisant ses enfants dans des zones nommées `cell-{row}-{col}`. Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (**desktop**, **tablette**, **mobile**), le nombre de **colonnes** et de **lignes**, ainsi qu'un **gap** commun.

Les identifiants de zone SHALL être dérivés de la structure **desktop** (`rows(desktop) × cols(desktop)`). Le rendu en mode **view** (page publique, export HTML) SHALL afficher toutes ces zones et appliquer une grille responsive via les colonnes configurées par breakpoint (reflow CSS selon le viewport réel).

En mode **prévisualisation** du builder, le `NodeGrid` SHALL afficher **toutes** les zones de la structure desktop et appliquer le nombre de colonnes du breakpoint actuellement sélectionné dans la barre d'outils ; aucun enfant présent dans une zone desktop ne SHALL disparaître lors du basculement édition → prévisualisation ni lors d'un changement de breakpoint mobile ou tablette.

En mode **édition**, le `NodeGrid` MAY limiter la grille affichée aux dimensions (`colonnes × lignes`) du breakpoint sélectionné afin de guider le dépôt dans les cellules du breakpoint courant.

#### Scenario: Prévisualisation mobile avec moins de cellules configurées

- **WHEN** un `NodeGrid` a une structure desktop 2×2 avec du contenu dans chaque cellule `cell-0-0` à `cell-1-1`
- **AND** le layout mobile est configuré à 1 colonne et 1 ligne
- **AND** l'utilisateur bascule en mode prévisualisation avec le breakpoint **mobile** actif
- **THEN** les quatre blocs de contenu restent visibles dans le canevas
- **AND** ils sont disposés en une colonne selon le nombre de colonnes mobile configuré

#### Scenario: Changement de breakpoint en prévisualisation

- **WHEN** l'utilisateur consulte un `NodeGrid` en mode prévisualisation avec le breakpoint **mobile**
- **AND** le contenu de toutes les zones desktop est affiché
- **AND** l'utilisateur sélectionne le breakpoint **tablette** ou **bureau**
- **THEN** le même contenu reste visible
- **AND** la disposition se met à jour selon le nombre de colonnes du nouveau breakpoint

#### Scenario: Rendu public inchangé

- **WHEN** une page contenant un `NodeGrid` est affichée en mode **view** (hors builder)
- **THEN** toutes les zones desktop sont rendues avec reflow responsive selon le viewport réel
- **AND** le comportement reste identique à l'existant avant correction de la prévisualisation

#### Scenario: Édition guidée par breakpoint

- **WHEN** le builder est en mode **édition** avec le breakpoint **mobile** sélectionné
- **AND** le layout mobile définit 1 colonne et 1 ligne
- **THEN** la grille éditable affiche une seule cellule déposable pour ce breakpoint
- **AND** le contenu des autres zones desktop reste accessible via le navigateur de composants ou en changeant de breakpoint en édition
