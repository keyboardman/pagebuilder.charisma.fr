## MODIFIED Requirements

### Requirement: Grille responsive NodeGrid

Le builder SHALL fournir un conteneur **NodeGrid** (identifiant `node-grid`) organisant ses enfants dans des **zones de dépôt** identifiées par une chaîne opaque (aujourd’hui `cell-{row}-{col}`, sémantiquement équivalente à un identifiant du type `zone-N`). Ces identifiants SHALL servir uniquement de clé de zone (`parent.zone`) ; le système SHALL NOT déduire une position CSS Grid en parsant l’identifiant.

Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (**desktop**, **tablette**, **mobile**) :

- le nombre de **colonnes** et de **lignes** ;
- un **gap** commun (partagé) ;
- pour chaque zone de la structure desktop, un **colSpan** et un **rowSpan** (défaut **1** pour chaque dimension absente).

Les identifiants de zone SHALL être dérivés de la structure **desktop** (`rows(desktop) × cols(desktop)`), dans un ordre stable déterminé par les settings (parcours row-major). L’ordre de rendu des zones SHALL suivre cet ordre.

Pour un breakpoint donné, une zone d’index `i` (0-based dans l’ordre desktop) SHALL être **visible** si et seulement si `i < columns(breakpoint) × rows(breakpoint)` (budget `cellCount`).

Les zones hors budget SHALL être masquées au rendu pour ce breakpoint ; leur contenu SHALL rester conservé en données. La réduction du nombre de colonnes ou de lignes d’un breakpoint SHALL donc masquer les zones excédentaires sans les supprimer.

Le **colSpan** / **rowSpan** d’une zone SHALL s’appliquer au wrapper de cette zone et SHALL NOT masquer les autres zones. Le placement de toutes les zones **visibles** SHALL rester l’auto-flow CSS Grid (un span décale les items suivants dans l’ordre). Les valeurs effectives SHALL être clampées : `colSpan` entre 1 et `columns(breakpoint)`, `rowSpan` entre 1 et `rows(breakpoint)`.

Le rendu en mode **view** (page publique, export HTML) SHALL :

- rendre les zones desktop avec visibilité responsive selon le `cellCount` de chaque breakpoint ;
- appliquer les colonnes de grille et les spans via classes CSS responsive selon le viewport réel.

En mode **prévisualisation** et en mode **édition** du builder, le `NodeGrid` SHALL :

- appliquer le nombre de colonnes et les spans du breakpoint actuellement sélectionné dans la barre d’outils (sans s’appuyer sur les media queries du viewport navigateur pour ces valeurs) ;
- masquer uniquement les zones hors `cellCount` à ce breakpoint ;
- conserver le contenu des zones masquées en données.

#### Scenario: Prévisualisation mobile avec moins de cellules configurées

- **WHEN** un `NodeGrid` a une structure desktop 2×2 (quatre zones) avec du contenu dans chaque zone
- **AND** le layout mobile est configuré à 1 colonne et 1 ligne
- **AND** l'utilisateur bascule en mode prévisualisation avec le breakpoint **mobile** actif
- **THEN** seule la première zone (index 0) est visible dans le canevas
- **AND** les trois autres zones sont masquées
- **AND** le contenu des zones masquées reste présent dans les données du document

#### Scenario: Changement de breakpoint en prévisualisation

- **WHEN** l'utilisateur consulte un `NodeGrid` en mode prévisualisation avec le breakpoint **mobile**
- **AND** seules les zones dans le `cellCount` mobile sont visibles
- **AND** l'utilisateur sélectionne le breakpoint **tablette** ou **bureau**
- **THEN** la visibilité des zones se met à jour selon le `cellCount` du nouveau breakpoint
- **AND** la disposition (colonnes et spans) se met à jour selon ce breakpoint

#### Scenario: Rendu public avec reflow responsive

- **WHEN** une page contenant un `NodeGrid` est affichée en mode **view** (hors builder)
- **THEN** les zones desktop sont rendues avec visibilité et spans responsive selon le viewport réel
- **AND** le nombre de colonnes de la grille suit la configuration par breakpoint

#### Scenario: Édition alignée sur la prévisualisation

- **WHEN** le builder est en mode **édition** avec le breakpoint **mobile** sélectionné
- **AND** un `NodeGrid` a une structure desktop 2×2
- **AND** le layout mobile est 1×1
- **THEN** seule la première zone est visible dans le canevas, comme en prévisualisation mobile
- **AND** aucune bordure permanente de cellule d'édition n'est affichée
- **AND** l'utilisateur peut sélectionner une zone visible ou son contenu via le navigateur de composants

#### Scenario: Colspan indépendant par breakpoint

- **WHEN** une zone d’un `NodeGrid` a `colSpan` desktop = 2 et `colSpan` mobile = 1
- **AND** le layout desktop a au moins 2 colonnes
- **AND** l'utilisateur est en prévisualisation avec le breakpoint **desktop**
- **THEN** le wrapper de cette zone occupe 2 colonnes de la grille
- **AND** la zone immédiatement suivante dans l’ordre reste visible et est placée par auto-flow après le span
- **WHEN** l'utilisateur sélectionne ensuite le breakpoint **mobile**
- **THEN** le wrapper de cette même zone occupe 1 colonne selon le `colSpan` mobile
- **AND** toutes les zones dans le `cellCount` mobile restent visibles

#### Scenario: Span colspan et rowspan (3×2) sans masquage

- **WHEN** un `NodeGrid` a une structure 3 colonnes × 2 lignes
- **AND** la première cellule a `colSpan = 2` et `rowSpan = 2` pour ce breakpoint
- **THEN** les **6** cellules restent visibles (budget cellCount)
- **AND** le wrapper de la première cellule occupe 2 colonnes et 2 lignes
- **AND** les cellules suivantes sont placées par auto-flow CSS Grid dans l’ordre

#### Scenario: Clamp du colspan

- **WHEN** une zone a un `colSpan` configuré à 3 pour le breakpoint **mobile**
- **AND** le layout mobile n’a qu’**1** colonne
- **THEN** le span effectif appliqué au rendu pour ce breakpoint est **1**

#### Scenario: Configuration des spans dans Settings

- **WHEN** l'utilisateur ouvre les réglages d’un `NodeGrid`
- **THEN** il peut sélectionner une cellule de la structure desktop (ex. Cellule 1, 2, …)
- **AND** définir pour cette cellule, pour chaque breakpoint, un `colSpan` et un `rowSpan`
- **AND** toutes les cellules dans le `cellCount` desktop apparaissent dans le sélecteur
- **AND** les valeurs par défaut absentes se comportent comme `1×1`

#### Scenario: Grille existante sans spans

- **WHEN** un `NodeGrid` enregistré avant cette capacité n’a pas de champ `spans` dans son layout
- **THEN** chaque zone se comporte comme `colSpan = 1` et `rowSpan = 1` à tous les breakpoints
- **AND** le rendu reste équivalent à celui d’avant l’introduction des spans
