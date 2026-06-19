## ADDED Requirements

### Requirement: Paramétrage NodeRoot par onglets

Le builder SHALL exposer un panneau **NodeSettings** pour le nœud racine **`NodeRoot`** (`node-root`) structuré en **onglets**, au minimum : **Général** (titre de la page), **Arrière-plan**, et **Typographie** (styles par défaut h1–h6, div, p). L’onglet **Typographie** SHALL conserver les champs existants (`fontSize`, `fontFamily`, `lineHeight`, `color`) par élément. Le titre de page SHALL continuer d’être persisté dans `node.content.title` et d’alimenter `document.title` comme aujourd’hui.

#### Scenario: Affichage des onglets NodeRoot

- **WHEN** l’utilisateur sélectionne le nœud racine `node-root` dans le builder (via le canevas ou le navigateur de composants)
- **THEN** le panneau droit affiche les onglets **Général**, **Arrière-plan** et **Typographie**
- **AND** le contenu de chaque onglet correspond à la section de configuration attendue

#### Scenario: Typographie inchangée après refonte

- **WHEN** l’utilisateur modifie la taille ou la couleur d’un élément (ex. `h1`) dans l’onglet **Typographie**
- **THEN** la valeur est persistée dans `node.content.defaultStyles`
- **AND** le rendu de la page applique les styles de typographie injectés comme avant la refonte

### Requirement: Arrière-plan de page NodeRoot

Le nœud **`NodeRoot`** SHALL permettre de configurer un **arrière-plan pleine page** persisté dans `node.content.background`. Le mode SHALL être **exclusif** parmi : **`default`** (comportement thème actuel, aucun fond personnalisé), **`color`**, **`image`**, **`video`**.

En mode **`color`**, le builder SHALL persister une couleur (`color`) et l’appliquer comme `background-color` sur le conteneur pleine page de la racine.

En mode **`image`**, le builder SHALL persister au minimum une URL d’image (`url`), une **position** (`position`, ex. `center`, `top`, `bottom`), une **taille** (`size`, ex. `cover`, `contain`) et un **repeat** (`repeat`). L’utilisateur SHALL pouvoir sélectionner l’image via la **médiathèque** (iframe file manager). Une **couleur de fallback** (`color`) MAY être renseignée et SHALL être appliquée sous l’image.

En mode **`video`**, le builder SHALL persister une URL de fichier vidéo (`url`). La vidéo SHALL être rendue en arrière-plan pleine page avec **lecture automatique**, **muette**, **en boucle** et **`playsInline`**. La couche vidéo SHALL être **fixée au viewport** (`position: fixed` ou équivalent) afin de rester visible pendant le défilement du contenu de la page. L’utilisateur SHALL pouvoir sélectionner la vidéo via la médiathèque (`type` vidéo). Le builder SHALL exposer au minimum un cadrage (`objectFit`, ex. `cover` / `contain`) et MAY exposer `objectPosition` et une image **poster** optionnelle. Une **couleur de fallback** (`color`) MAY être affichée pendant le chargement.

L’arrière-plan configuré SHALL être visible en mode **édition** (iframe), **prévisualisation** et **rendu final** (page publiée). En mode édition, la couche vidéo SHALL NOT intercepter les interactions pointeur du canevas (`pointer-events: none` ou équivalent).

Lorsqu’aucune clé `background` n’est présente ou que `type` vaut `default`, le rendu SHALL rester visuellement équivalent au comportement existant avant cette évolution.

#### Scenario: Fond couleur unie

- **WHEN** l’utilisateur choisit le type **Couleur** et renseigne `#1a2b3c`
- **THEN** `node.content.background` contient `{ type: 'color', color: '#1a2b3c' }`
- **AND** le conteneur pleine page de `NodeRoot` affiche cette couleur en arrière-plan

#### Scenario: Fond image avec position

- **WHEN** l’utilisateur choisit le type **Image**, sélectionne un fichier via la médiathèque et définit position `center` et taille `cover`
- **THEN** `node.content.background` contient `type: 'image'`, l’URL absolue de l’image, `position: 'center'` et `size: 'cover'`
- **AND** l’image couvre le viewport en arrière-plan de la page

#### Scenario: Fond vidéo en boucle

- **WHEN** l’utilisateur choisit le type **Vidéo** et sélectionne un fichier vidéo via la médiathèque
- **THEN** `node.content.background` contient `type: 'video'` et l’URL de la vidéo
- **AND** une balise vidéo en arrière-plan joue la vidéo en **autoplay**, **muted**, **loop** et **playsInline**
- **AND** la vidéo reste fixée au viewport pendant le défilement de la page
- **AND** les clics sur le canevas en mode édition atteignent toujours les nœuds enfants

#### Scenario: Page existante sans arrière-plan configuré

- **WHEN** une page chargée ne contient pas `node.content.background` sur `node-root`
- **THEN** le rendu visuel reste celui du thème par défaut (équivalent à `type: 'default'`)
- **AND** aucune erreur n’est levée à l’ouverture du builder

#### Scenario: Persistance après sauvegarde

- **WHEN** l’utilisateur configure un arrière-plan image ou vidéo et enregistre la page
- **THEN** après rechargement du builder ou consultation du rendu public, la même configuration d’arrière-plan est appliquée
