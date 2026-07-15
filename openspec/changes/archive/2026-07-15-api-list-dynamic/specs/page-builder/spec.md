## ADDED Requirements

### Requirement: NodeListApi mode fixe ou dynamique

Le nœud `NodeListApi` SHALL supporter deux modes de contenu : `fixed` (défaut) et `dynamic`.

#### Scenario: Nœud existant sans listMode

- **WHEN** un nœud `NodeListApi` n'a pas de champ `content.listMode`
- **THEN** il SHALL se comporter comme en mode `fixed` (sélection d'une `ApiListArticle` via `apiId`)

#### Scenario: Bascule vers mode dynamique

- **WHEN** l'éditeur sélectionne le mode `dynamic` dans les réglages
- **THEN** le sélecteur d'API fixe SHALL être remplacé par une interface de composition d'items individuels
- **AND** les items SHALL être stockés dans `content.dynamicItems` sous la forme `{ id, type }`

#### Scenario: Tri des items dynamiques

- **WHEN** l'éditeur réordonne les items en mode dynamique
- **THEN** l'ordre dans `content.dynamicItems` SHALL refléter l'ordre d'affichage

### Requirement: Résolution des items dynamiques

Le backend SHALL exposer `POST /api/page-builder/lists/dynamic/resolve` acceptant `{ entries: [{ id, type }, ...] }` et retournant les items mappés dans le même ordre (items introuvables omis).

#### Scenario: Items multi-sources

- **WHEN** les entrées référencent des sources `type` différentes
- **THEN** chaque item SHALL être résolu via la source correspondante
- **AND** la réponse SHALL contenir les champs attendus par NodeListApi (`id`, `title`, `description`, `counter`, `like`, `link`)

#### Scenario: Affichage paginé en mode dynamique

- **WHEN** le nœud est en mode `dynamic` avec `page` et `itemsPerPage` configurés
- **THEN** la pagination d'affichage SHALL s'appliquer sur la liste résolue côté frontend
