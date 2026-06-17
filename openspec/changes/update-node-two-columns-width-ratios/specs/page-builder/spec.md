## ADDED Requirements

### Requirement: Répartition des colonnes NodeTwoColumns

Le builder SHALL fournir un conteneur **NodeTwoColumns** (identifiant `node-two_columns`) avec deux zones enfants (`left`, `right`). Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (desktop, tablette, mobile), la répartition de largeur entre les deux colonnes et l'inversion de l'ordre (`reverseDesktop`, `reverseTablet`, `reverseMobile`).

Les répartitions prédéfinies suivantes MUST être proposées dans le sélecteur de largeur pour **tous** les breakpoints :

- `33-66`, `50-50`, `66-33` (existantes)
- `25-75`, `75-25` (nouvelles)
- `100-100` (empilement vertical)

Sur le breakpoint **desktop uniquement**, le sélecteur MUST proposer en plus l'option `custom` (pourcentages libres). Lorsque `custom` est sélectionné pour desktop, le panneau de réglages MUST afficher une ligne supplémentaire **sous la ligne desktop** du tableau de layout (et non dans la cellule du sélecteur). Cette ligne MUST contenir deux champs numériques entiers (colonne gauche et colonne droite, en pourcentage, avec libellés explicites) dont la somme MUST être égale à 100, sans pas imposé (toute valeur entière de 1 à 99). La ligne MUST être masquée lorsque `desktop` n'est pas `custom`. Les valeurs MUST être persistées dans `attributes.layout.customDesktop` sous la forme `{ left, right }`. L'option `custom` MUST NOT être disponible pour tablette ni mobile.

Le rendu MUST refléter la répartition choisie en mode édition (selon le breakpoint sélectionné), en prévisualisation et à l'export HTML. Les pages existantes utilisant uniquement les presets historiques MUST conserver leur rendu sans modification.

#### Scenario: Sélection du preset 25-75 sur desktop

- **WHEN** l'utilisateur sélectionne `25-75` pour le breakpoint desktop d'un `NodeTwoColumns`
- **THEN** la colonne gauche occupe environ 25 % de la largeur et la colonne droite environ 75 % sur desktop
- **AND** la valeur `25-75` est persistée dans `attributes.layout.desktop`

#### Scenario: Sélection du preset 75-25 sur tablette

- **WHEN** l'utilisateur sélectionne `75-25` pour le breakpoint tablette
- **THEN** la colonne gauche occupe environ 75 % et la colonne droite environ 25 % sur tablette
- **AND** la valeur `75-25` est persistée dans `attributes.layout.tablet`

#### Scenario: Ratio personnalisé 40-60 sur desktop

- **WHEN** l'utilisateur sélectionne `custom` pour desktop et saisit `40` % (gauche) et `60` % (droite)
- **THEN** `attributes.layout.desktop` vaut `custom` et `attributes.layout.customDesktop` vaut `{ left: 40, right: 60 }`
- **AND** le rendu desktop affiche les deux colonnes avec ce ratio

#### Scenario: Ligne de saisie custom sous la ligne desktop

- **WHEN** l'utilisateur sélectionne `custom` dans le sélecteur desktop du tableau de layout
- **THEN** une nouvelle ligne apparaît immédiatement sous la ligne desktop avec les champs gauche et droite (en %)
- **AND** les cellules tablette et mobile de cette ligne restent vides ou non éditables

#### Scenario: Masquage de la ligne custom

- **WHEN** l'utilisateur change le sélecteur desktop d'un preset `custom` vers un autre preset (ex. `50-50`)
- **THEN** la ligne de saisie custom sous la ligne desktop est masquée
- **AND** les valeurs `customDesktop` précédentes peuvent être conservées en JSON mais ne sont plus utilisées pour le rendu

#### Scenario: Custom indisponible sur tablette et mobile

- **WHEN** l'utilisateur ouvre les réglages de largeur pour tablette ou mobile d'un `NodeTwoColumns`
- **THEN** l'option `custom` n'est pas proposée dans le sélecteur
- **AND** seuls les presets (`33-66`, `50-50`, `66-33`, `25-75`, `75-25`, `100-100`) sont disponibles

#### Scenario: Rendu responsive avec custom desktop et presets tablette/mobile

- **WHEN** un `NodeTwoColumns` a `desktop: custom` avec `{ left: 40, right: 60 }`, `tablet: 50-50` et `mobile: 100-100`
- **THEN** en mode view le ratio desktop applique 40-60, le ratio tablette 50-50 et le ratio mobile empile les colonnes
- **AND** en mode édition le ratio affiché correspond au breakpoint actuellement sélectionné dans le builder

#### Scenario: Rétrocompatibilité des pages existantes

- **WHEN** une page sauvegardée contient un `NodeTwoColumns` avec `layout.desktop: 50-50` (sans champs custom)
- **THEN** le rendu reste identique à l'existant après déploiement de cette évolution
