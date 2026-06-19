## ADDED Requirements

### Requirement: Canevas d'édition WYSIWYG

En mode **édition** du builder, le canevas SHALL afficher chaque nœud avec le **même composant de rendu** qu'en mode **prévisualisation** (composant `view` du registre de nœuds). Le rendu visuel du contenu (disposition, styles, texte affiché) SHALL être **identique** entre édition et prévisualisation pour un même breakpoint sélectionné.

Le mode édition SHALL conserver les capacités structurelles : **zones de dépôt** (`DropZone`), **glisser-déposer** et **sélection** de nœuds. Ces interactions SHALL être superposées au rendu WYSIWYG sans modifier l'apparence des nœuds eux-mêmes (pas de bordures de cellules d'édition, pas de composants `edit` dédiés sur le canevas).

L'édition du **contenu** des nœuds texte SHALL s'effectuer via le panneau **NodeSettings** (sidebar droite) ou via les modales déjà prévues (ex. `NodeRichText`), et non par édition inline sur le canevas.

#### Scenario: Rendu identique édition et prévisualisation

- **WHEN** l'utilisateur consulte une page contenant plusieurs types de nœuds (texte, bouton, flex, grille, etc.)
- **AND** l'utilisateur bascule entre le mode édition et le mode prévisualisation avec le même breakpoint actif
- **THEN** la disposition et l'apparence du contenu restent visuellement identiques
- **AND** seul le chrome d'édition (menus, dropzones, bordures de survol) apparaît ou disparaît

#### Scenario: Édition de contenu via NodeSettings

- **WHEN** l'utilisateur sélectionne un `NodeText` ou un `NodeButton` via le navigateur de composants
- **THEN** le canevas affiche le rendu final (aperçu) du nœud
- **AND** l'utilisateur modifie le texte ou le libellé dans le panneau NodeSettings

#### Scenario: NodeRichText inchangé

- **WHEN** l'utilisateur sélectionne un `NodeRichText`
- **THEN** le canevas affiche l'aperçu du contenu
- **AND** la modale WYSIWYG s'ouvre pour l'édition, comme en prévisualisation

### Requirement: Menu de bloc visible à la sélection uniquement

En mode **édition**, le **menu de bloc** (`NodeMenu`) d'un nœud éditable SHALL être affiché **uniquement** lorsque ce nœud est le nœud **sélectionné** du builder. Lorsqu'aucun nœud n'est sélectionné ou qu'un autre nœud est sélectionné, le menu du nœud non actif SHALL être masqué. La sélection SHALL rester possible via le **navigateur de composants** (Explorer) ou par **clic** sur le conteneur du bloc dans le canevas.

#### Scenario: Menu masqué hors sélection

- **WHEN** le builder est en mode édition et aucun nœud n'est sélectionné
- **THEN** aucun menu de bloc n'est visible sur le canevas

#### Scenario: Menu affiché à la sélection depuis l'Explorer

- **WHEN** l'utilisateur sélectionne un nœud via le navigateur de composants
- **THEN** le menu de bloc de ce nœud apparaît sur le canevas
- **AND** les menus des autres nœuds restent masqués

#### Scenario: Sélection et menu via clic sur le conteneur

- **WHEN** l'utilisateur clique sur le conteneur d'un bloc non sélectionné dans le canevas
- **THEN** ce nœud devient sélectionné et son menu de bloc s'affiche

### Requirement: Surbrillance au survol du conteneur en édition

En mode **édition**, le conteneur visuel d'un nœud éditable (wrapper autour du contenu du bloc) SHALL modifier la **couleur de sa bordure** lorsque le pointeur de la souris le survole, afin d'indiquer la zone interactive. La bordure au survol SHALL être visuellement distincte de l'état par défaut et ne SHALL pas remplacer les repères de sélection active.

#### Scenario: Bordure au survol

- **WHEN** l'utilisateur survole avec la souris le conteneur d'un bloc en mode édition
- **THEN** la bordure du conteneur change de couleur par rapport à l'état par défaut

#### Scenario: Pas de surbrillance en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **THEN** les conteneurs de blocs n'affichent pas la bordure de survol d'édition

## MODIFIED Requirements

### Requirement: Conteneur Flex (NodeFlex)

Le builder SHALL fournir un type de nœud conteneur **NodeFlex** (identifiant `node-flex`) dans lequel les composants enfants sont alignés à l'aide des propriétés CSS Flexbox. Le nœud SHALL être droppable (une zone unique, par ex. `main`) et SHALL exposer des options configurables pour la disposition flex : direction (row, column, row-reverse, column-reverse), justify-content, align-items, gap et flex-wrap.

En mode **édition** et direction **horizontale** (`row`, `row-reverse`) avec **justify-content** à `flex-start`, le conteneur flex `.ce-flex-inner` SHALL occuper toute la largeur disponible. La zone de dépôt du conteneur `main` — qu'elle soit **seule** (flex vide) ou **finale** (après les enfants) — SHALL occuper l'espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente aux dropzones vides (`min-height: 2.5rem`), afin que l'utilisateur puisse identifier et cibler facilement l'emplacement de dépôt sans chercher visuellement. Les dropzones intermédiaires (entre enfants) conservent leur taille compacte actuelle pour le réordonnancement précis. Lorsque **justify-content** est `center`, `flex-end` ou une valeur `space-*`, la dropzone finale reste **compacte** en mode édition afin de ne pas perturber l'alignement des enfants ni bloquer leur sélection.

L'option **wrap** (`flex-wrap`) SHALL être appliquée de manière identique en modes **édition**, **prévisualisation** et **view**, conformément au canevas WYSIWYG.

#### Scenario: Ajout d'un conteneur Flex depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l'utilisateur peut y déposer d'autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l'utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l'éditeur selon ces propriétés, y compris `flex-wrap: nowrap` si configuré
- **AND** le rendu en prévisualisation et à l'export reflète le même alignement

#### Scenario: Dropzone visible en horizontal sans enfant

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) ne contient aucun enfant et que le builder est en mode édition
- **THEN** le conteneur `.ce-flex-inner` occupe toute la largeur disponible
- **AND** la zone de dépôt unique s'étend sur cet espace horizontal disponible
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)

#### Scenario: Dropzone finale visible en horizontal avec enfants existants

- **WHEN** un NodeFlex en direction horizontale (`row` ou `row-reverse`) avec **justify-content** `flex-start` contient au moins un enfant et que le builder est en mode édition
- **THEN** la dernière zone de dépôt du conteneur `main` s'étend pour occuper l'espace horizontal restant après les enfants
- **AND** cette zone conserve une taille minimale permettant de la cibler sans chercher visuellement (au moins `min-height: 2.5rem`)
- **AND** les dropzones entre les enfants restent compactes pour permettre un réordonnancement précis

#### Scenario: Dropzone compacte si justify autre que flex-start

- **WHEN** un NodeFlex en direction horizontale utilise **justify-content** `center`, `flex-end` ou une valeur `space-*` et que le builder est en mode édition
- **THEN** la dropzone finale du conteneur `main` reste compacte (sans `flex: 1`)
- **AND** les enfants conservent l'alignement configuré et restent sélectionnables

#### Scenario: No wrap appliqué en édition

- **WHEN** l'utilisateur configure l'option wrap du NodeFlex sur `nowrap` (No wrap)
- **AND** le builder est en mode **édition**
- **THEN** le conteneur `.ce-flex-inner` applique `flex-wrap: nowrap` comme en prévisualisation
- **AND** les dropzones restent utilisables pour le glisser-déposer

#### Scenario: Persistance du conteneur Flex

- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l'affichage, y compris l'option `wrap` telle que configurée

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText). Le libellé (`content.label`) SHALL être éditable dans le panneau **NodeSettings** et SHALL supporter le **gras partiel** conformément à l'exigence **Gras partiel du libellé NodeButton**.

#### Scenario: Ajout d'un NodeButton depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l'utilisateur peut modifier le type (button / submit / link), le libellé (y compris gras partiel) et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l'utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Persistance du NodeButton

- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé (texte brut ou HTML inline de gras autorisé), href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l'affichage

### Requirement: Gras partiel du libellé NodeButton

Le nœud **NodeButton** SHALL permettre de mettre en **gras une partie seulement** de son libellé (`content.label`), sans appliquer le gras à l'intégralité du bouton via **Text2Settings**. L'édition du libellé et du gras partiel SHALL s'effectuer dans le panneau **NodeSettings** du nœud sélectionné. Le libellé SHALL être persisté avec des balises inline limitées (`<strong>` ou `<b>`) ; toute autre balise SHALL être supprimée à l'enregistrement. Le rendu en édition, en prévisualisation et à l'export SHALL afficher le gras partiel. Les libellés texte brut existants (sans balises HTML) SHALL rester valides et inchangés visuellement.

#### Scenario: Gras sur une portion du libellé

- **WHEN** l'utilisateur modifie le libellé d'un NodeButton dans NodeSettings et y applique du gras sur une portion du texte
- **THEN** seule la portion concernée est rendue en gras dans le canevas ; le reste du libellé conserve son apparence normale

#### Scenario: Rendu preview et export

- **WHEN** un NodeButton possède un libellé avec une partie en gras
- **THEN** la prévisualisation et le rendu HTML final affichent le même gras partiel sur le bouton ou le lien

#### Scenario: Persistance du libellé formaté

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeButton dont le libellé comporte du gras partiel
- **THEN** le contenu sérialisé conserve les balises de gras autorisées ; à la réouverture de la page, le libellé et le formatage partiel sont restaurés à l'identique

#### Scenario: Rétrocompatibilité libellé texte brut

- **WHEN** une page contient un NodeButton avec un libellé texte brut sans balises HTML (contenu existant avant cette évolution)
- **THEN** le libellé s'affiche sans erreur ni altération du rendu

#### Scenario: Sanitisation des balises non autorisées

- **WHEN** le libellé d'un NodeButton contient ou reçoit du HTML avec des balises autres que `strong` ou `b` (ex. collage ou contenu malveillant)
- **THEN** seules les balises de gras autorisées sont conservées ; les autres balises sont supprimées tout en préservant le texte

### Requirement: Grille responsive NodeGrid

Le builder SHALL fournir un conteneur **NodeGrid** (identifiant `node-grid`) organisant ses enfants dans des zones nommées `cell-{row}-{col}`. Le panneau de réglages SHALL permettre de configurer, pour chaque breakpoint (**desktop**, **tablette**, **mobile**), le nombre de **colonnes** et de **lignes**, ainsi qu'un **gap** commun.

Les identifiants de zone SHALL être dérivés de la structure **desktop** (`rows(desktop) × cols(desktop)`). Le rendu en mode **view** (page publique, export HTML) SHALL afficher toutes ces zones et appliquer une grille responsive via les colonnes configurées par breakpoint (reflow CSS selon le viewport réel).

En mode **prévisualisation** et en mode **édition** du builder, le `NodeGrid` SHALL afficher **toutes** les zones de la structure desktop et appliquer le nombre de colonnes du breakpoint actuellement sélectionné dans la barre d'outils ; aucun enfant présent dans une zone desktop ne SHALL disparaître lors du basculement édition → prévisualisation ni lors d'un changement de breakpoint mobile ou tablette.

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

#### Scenario: Édition alignée sur la prévisualisation

- **WHEN** le builder est en mode **édition** avec le breakpoint **mobile** sélectionné
- **AND** un `NodeGrid` a une structure desktop 2×2 avec du contenu dans chaque cellule
- **THEN** les quatre blocs de contenu sont visibles dans le canevas avec la même disposition qu'en prévisualisation mobile
- **AND** aucune bordure permanente de cellule d'édition n'est affichée
- **AND** l'utilisateur peut sélectionner une cellule ou son contenu via le navigateur de composants
