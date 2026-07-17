## ADDED Requirements

### Requirement: Options card NodeCardApi pour la vue article default

Lorsque `collectionType=article` et `view=default`, le panneau de réglages NodeCollection SHALL exposer les mêmes options de configuration card que **NodeCardApi** :

- toggles de visibilité : image, titre, texte (persisté via `content.show.description`), labels ;
- layout du container : `position` (`left` | `right` | `top` | `overlay`), `align`, `ratio`, gap contenu ;
- styles par sous-partie : `card`, `container`, `image`, `title`, `text`, `labels` (className et/ou background, border, spacing, object-fit selon le pattern Card API).

Ces contrôles SHALL écrire dans `content.card`, `content.container`, `content.image`, `content.title`, `content.text`, `content.labels` et `content.show`. Ils SHALL **ne pas** apparaître lorsque `view=article` (liste API) ni pour les types `image` / `video`.

#### Scenario: Affichage des options card en vue default

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default` et ouvre l'onglet Style
- **THEN** les contrôles position / align / ratio / gap et les styles card/container/image/titre/texte/labels sont disponibles

#### Scenario: Options card masquées en vue liste API

- **WHEN** l'utilisateur configure `collectionType=article`, `view=article`
- **THEN** les options layout/styles spécifiques Card API ne sont pas proposées ; les toggles show adaptés à la liste API (titre, description, counter, like) restent disponibles

#### Scenario: Position image appliquée à tous les items

- **WHEN** l'utilisateur choisit `container.position=left` (ou `right` / `overlay`) en vue article default
- **THEN** chaque item de la collection rend une card avec la classe `ce-card-position-<position>` correspondante

#### Scenario: Toggle texte masque la description

- **WHEN** l'utilisateur désactive le toggle Texte / description en vue article default
- **THEN** `content.show.description` vaut `false` et aucun texte de description n'est affiché dans les cards

### Requirement: Parité de rendu article default avec NodeCardApi

Lorsque `collectionType=article` et `view=default`, chaque item SHALL être rendu avec la structure et les hooks CSS de **NodeCardApi** : `ce-card`, `ce-card-position-*`, `ce-card-align-*`, `ce-card-image`, `ce-card-image-ratio-*`, `ce-card-container-content`, `ce-card-title`, `ce-card-text`, `ce-card-label`, en respectant `content.show`, `content.container` et les styles des sous-parties.

#### Scenario: Card collection identique au thème Card API

- **WHEN** un NodeCollection article en `view=default` affiche un item avec image, titre, texte et label visibles
- **THEN** le markup de l'item utilise les classes `.ce-card*` du thème Card API (pas `.ce-list-api`)

#### Scenario: Ratio image appliqué

- **WHEN** l'utilisateur configure `container.ratio=1_3` en vue article default
- **THEN** l'image de chaque item porte la classe `ce-card-image-ratio-1_3`

## MODIFIED Requirements

### Requirement: Rendu view default

Lorsque `view=default`, chaque item SHALL être rendu selon le layout thème du type correspondant :

- `image` → image (et lien optionnel), aligné sur NodeImage (`.ce-image`) ;
- `article` → card alignée sur **NodeCardApi** (structure container/image/titre/texte/labels, hooks `.ce-card*`), pilotée par `content.show`, `content.container` et les styles des sous-parties card ;
- `video` → poster et titre, aligné sur NodeVideoApi.

Les toggles `content.show.*` SHALL contrôler la visibilité des sous-parties lorsque le type et le mapping le permettent. Pour article default, le texte de la card est piloté par `content.show.description` (équivalent fonctionnel de `show.text` côté NodeCardApi).

#### Scenario: Vue default article avec toggles show

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default`, `show.description=false`
- **THEN** les items affichent image et titre (si activés) mais pas le texte de description

#### Scenario: Vue default article utilise ce-card

- **WHEN** l'utilisateur configure `collectionType=article`, `view=default` avec des items chargés
- **THEN** chaque item est rendu dans un élément portant la classe `ce-card`
