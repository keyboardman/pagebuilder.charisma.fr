## MODIFIED Requirements

### Requirement: Menu de bloc visible à la sélection uniquement

En mode **édition**, le **menu de bloc** (`NodeMenu`) d'un nœud éditable SHALL être affiché **uniquement** lorsque ce nœud est le nœud **sélectionné** du builder. Lorsqu'aucun nœud n'est sélectionné ou qu'un autre nœud est sélectionné, le menu du nœud non actif SHALL être masqué. La sélection SHALL rester possible via le **navigateur de composants** (Explorer) ou par **clic** sur le conteneur du bloc dans le canevas.

Le menu de bloc SHALL être positionné en **overlay flottant** **au-dessus** du conteneur visuel du nœud sélectionné, aligné en haut à gauche (`position: absolute; bottom: 100%` ou équivalent), **hors du flux** de mise en page. Il SHALL **ne pas** réserver d'espace vertical ni horizontal dans le conteneur et SHALL **ne pas recouvrir** le contenu du nœud : le contenu SHALL occuper la même emprise qu'en prévisualisation (sans menu). Le menu SHALL rester **toujours visible** (fond opaque, z-index suffisant) lorsque le nœud est sélectionné, y compris dans des conteneurs flex compacts (`NodeFlex`, `NodeNav`, etc.).

La **poignée de déplacement** (grip) du menu SHALL rester le point d'ancrage du drag-and-drop du nœud (`handleRef`). Le menu flottant SHALL **ne pas** bloquer les interactions de dépôt (dropzones) ni le clic de sélection sur le contenu adjacent ; les zones interactives du menu (grip, duplication, suppression, actions spécifiques) restent cliquables.

#### Scenario: Menu masqué hors sélection

- **WHEN** le builder est en mode édition et aucun nœud n'est sélectionné
- **THEN** aucun menu de bloc n'est visible sur le canevas

#### Scenario: Menu affiché à la sélection depuis l'Explorer

- **WHEN** l'utilisateur sélectionne un nœud via le navigateur de composants
- **THEN** le menu de bloc de ce nœud apparaît au-dessus du conteneur, aligné en haut à gauche, sans recouvrir le contenu
- **AND** les menus des autres nœuds restent masqués

#### Scenario: Sélection et menu via clic sur le conteneur

- **WHEN** l'utilisateur clique sur le conteneur d'un bloc non sélectionné dans le canevas
- **THEN** ce nœud devient sélectionné et son menu de bloc s'affiche en overlay flottant

#### Scenario: Pas de décalage de mise en page en édition

- **WHEN** un nœud est sélectionné en mode édition
- **THEN** le contenu du nœud n'est pas poussé vers le bas ou vers la droite par le menu de bloc
- **AND** l'emprise visuelle du contenu correspond à celle affichée en prévisualisation pour le même nœud

#### Scenario: Enfant NodeFlex sans débordement dû au menu

- **WHEN** un enfant d'un `NodeFlex` est sélectionné en mode édition
- **THEN** le menu de bloc s'affiche en overlay sans provoquer de débordement du conteneur flex attribuable à la hauteur du menu
- **AND** l'alignement flex des frères (direction, justify, align, wrap) reste cohérent avec la prévisualisation

#### Scenario: Drag-and-drop via la poignée du menu

- **WHEN** l'utilisateur saisit la poignée de déplacement du menu de bloc d'un nœud sélectionné
- **THEN** le nœud peut être déplacé par drag-and-drop vers une dropzone valide
- **AND** le déplacement reste fluide (pas de blocage par le positionnement flottant du menu)

#### Scenario: Dropzones accessibles avec menu flottant

- **WHEN** un nœud parent (ex. `NodeFlex`) contient des dropzones entre ou après ses enfants
- **AND** un enfant est sélectionné (menu flottant visible)
- **THEN** l'utilisateur peut toujours cibler et utiliser les dropzones pour déposer ou réordonner des nœuds
