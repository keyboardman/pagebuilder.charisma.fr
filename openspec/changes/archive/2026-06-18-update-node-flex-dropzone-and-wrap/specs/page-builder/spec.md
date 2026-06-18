## MODIFIED Requirements

### Requirement: Conteneur Flex (NodeFlex)

Le builder SHALL fournir un type de nœud conteneur **NodeFlex** (identifiant `node-flex`) dans lequel les composants enfants sont alignés à l’aide des propriétés CSS Flexbox. Le nœud SHALL être droppable (une zone unique, par ex. `main`) et SHALL exposer des options configurables pour la disposition flex : direction (row, column, row-reverse, column-reverse), justify-content, align-items, gap et flex-wrap.

En mode **édition** et direction **horizontale** (`row`, `row-reverse`) avec **justify-content** à `flex-start`, le conteneur flex `.ce-flex-inner` SHALL occuper toute la largeur disponible. La zone de dépôt du conteneur `main` — qu’elle soit **seule** (flex vide) ou **finale** (après les enfants) — SHALL occuper l’espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente aux dropzones vides (`min-height: 2.5rem`), afin que l’utilisateur puisse identifier et cibler facilement l’emplacement de dépôt sans chercher visuellement. Les dropzones intermédiaires (entre enfants) conservent leur taille compacte actuelle pour le réordonnancement précis. Lorsque **justify-content** est `center`, `flex-end` ou une valeur `space-*`, la dropzone finale reste **compacte** en mode édition afin de ne pas perturber l’alignement des enfants ni bloquer leur sélection.

Lorsque l’option **wrap** est `nowrap`, le style CSS `flex-wrap: nowrap` SHALL être appliqué **uniquement** en modes **preview** et **view** (prévisualisation et rendu final). En mode **edit**, le conteneur SHALL utiliser `flex-wrap: wrap` afin que les enfants et la dropzone restent accessibles au drag-and-drop, sans modifier la valeur `nowrap` persistée dans le contenu du nœud.

#### Scenario: Ajout d’un conteneur Flex depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l’utilisateur peut y déposer d’autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l’utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l’éditeur selon ces propriétés (sauf `flex-wrap: nowrap` en mode édition, voir scénario dédié) ; le rendu en prévisualisation et à l’export reflète l’alignement complet, y compris `nowrap` si configuré

#### Scenario: Dropzone visible en horizontal sans enfant

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) ne contient aucun enfant et que le builder est en mode édition
- **THEN** le conteneur `.ce-flex-inner` occupe toute la largeur disponible
- **AND** la zone de dépôt unique s’étend sur cet espace horizontal disponible
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)

#### Scenario: Dropzone finale visible en horizontal avec enfants existants

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) avec **justify-content** `flex-start` contient au moins un enfant et que le builder est en mode édition
- **THEN** la dernière zone de dépôt du conteneur `main` s’étend pour occuper l’espace horizontal restant après les enfants
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)
- **AND** les dropzones entre les enfants restent compactes pour permettre un réordonnancement précis

#### Scenario: Dropzone compacte si justify autre que flex-start

- **WHEN** un NodeFlex en direction horizontale utilise **justify-content** `center`, `flex-end` ou une valeur `space-*` et que le builder est en mode édition
- **THEN** la dropzone finale du conteneur `main` reste compacte (sans `flex: 1`)
- **AND** les enfants conservent l’alignement configuré et restent sélectionnables

#### Scenario: No wrap appliqué uniquement en preview et view

- **WHEN** l’utilisateur configure l’option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **preview** ou **view**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: nowrap` et les enfants ne passent pas à la ligne

#### Scenario: No wrap ignoré en mode édition

- **WHEN** l’utilisateur configure l’option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **edit**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: wrap` (les enfants peuvent passer à la ligne)
- **AND** la valeur `nowrap` reste enregistrée dans les options du nœud pour la prévisualisation et le rendu final

#### Scenario: Persistance du conteneur Flex

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l’affichage, y compris l’option `wrap` telle que configurée
