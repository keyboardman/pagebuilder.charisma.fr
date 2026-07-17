## ADDED Requirements

### Requirement: Source fixed via ApiCollection

Lorsque `mode=fixed`, NodeCollection SHALL charger les items via **`GET /api/page-builder/collections/{apiId}/items`** avec les paramètres **`page`** et **`itemsPerPage`**, quel que soit `collectionType` (`image`, `video`, `article`). Le sélecteur d’API en settings SHALL être alimenté par **`GET /api/page-builder/collections?type={collectionType}&mode=fixed`**.

#### Scenario: Article fixed unifié

- **WHEN** l’utilisateur configure `collectionType=article`, `mode=fixed`, un `apiId` valide, `page=1`, `itemsPerPage=10`
- **THEN** le nœud appelle `/page-builder/collections/{apiId}/items` et affiche les items mappés

#### Scenario: Video fixed unifié

- **WHEN** l’utilisateur configure `collectionType=video`, `mode=fixed` et sélectionne une API du catalogue
- **THEN** le sélecteur ne propose que les APIs `type=video` supportant `fixed`, et le chargement passe par le même endpoint collections

#### Scenario: Image fixed unifié

- **WHEN** l’utilisateur configure `collectionType=image`, `mode=fixed`
- **THEN** le nœud utilise le catalogue et l’endpoint ApiCollection (plus `lists-image` dédié pour ce nœud)

### Requirement: Source dynamic via ApiCollection (article et video)

Lorsque `mode=dynamic` et `collectionType` vaut `article` ou `video`, NodeCollection SHALL :

- proposer le picking depuis les APIs du catalogue filtrées `mode=dynamic` et `type` correspondant ;
- persister des références `{ apiId, itemId }` (ou équivalent) dans `dynamicItems` ;
- résoudre les items via **`POST /api/page-builder/collections/resolve`**.

Le mode dynamic **`image`** MAY conserver le picking file manager (hors ApiCollection) comme comportement éditorial.

#### Scenario: Resolve article dynamic

- **WHEN** l’utilisateur a sélectionné deux articles en mode dynamic
- **THEN** le nœud appelle resolve avec les deux références et affiche les items mappés dans l’ordre persisté

#### Scenario: Catalogue dynamic filtré

- **WHEN** l’utilisateur ouvre le picker en `collectionType=video`, `mode=dynamic`
- **THEN** seules les APIs `type=video` supportant `dynamic` sont proposées

### Requirement: Consommation du mapping standard

NodeCollection SHALL consommer les champs du mapping ApiCollection (`image`, `title`, `description`, `label`/`labels`, `counter`, `like`, `link`) selon `collectionType`, `view` et les toggles `content.show.*`, sans dépendre d’un mapping spécifique à un registre legacy.

#### Scenario: Affichage counter et like

- **WHEN** un item article mappé contient `counter` et `like` et que les toggles show correspondants sont actifs
- **THEN** le rendu affiche ces valeurs

#### Scenario: Champ image optionnel

- **WHEN** un item n’a pas de champ `image` et que le toggle image est actif
- **THEN** le rendu omet ou placeholdère l’image sans planter
