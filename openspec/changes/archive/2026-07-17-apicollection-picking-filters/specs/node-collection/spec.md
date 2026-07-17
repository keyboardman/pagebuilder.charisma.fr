## ADDED Requirements

### Requirement: Filtres de picking dynamique (search et catégorie)

Lorsque l’utilisateur ouvre le picker d’items en mode **dynamic** (`collectionType` `article` ou `video`), NodeCollection SHALL :

1. proposer un champ de **recherche** qui appelle `GET /api/page-builder/collections/{apiId}/items` avec le paramètre `search` (debounce) ;
2. charger `GET /api/page-builder/collections/{apiId}/categories` pour la source sélectionnée ;
3. lorsque la liste de catégories est non vide, afficher un **sélecteur de catégorie** et transmettre la valeur choisie via le paramètre `category` sur l’endpoint items ;
4. réinitialiser la pagination à la page 1 lors d’un changement de recherche ou de catégorie.

#### Scenario: Recherche dans le picker article

- **WHEN** l’utilisateur sélectionne une source article dynamic et saisit un terme dans le champ rechercher
- **THEN** le picker recharge les items via `/collections/{apiId}/items` avec `search` égal au terme saisi

#### Scenario: Filtre catégorie affiché

- **WHEN** `/collections/{apiId}/categories` retourne au moins une catégorie
- **THEN** le picker affiche un sélecteur de catégorie et, après sélection, recharge les items avec `category` correspondant

#### Scenario: Pas de catégories

- **WHEN** `/collections/{apiId}/categories` retourne une liste vide
- **THEN** le picker n’affiche pas de sélecteur de catégorie et continue de lister les items (avec recherche éventuelle)

#### Scenario: Changement de filtre reset page

- **WHEN** l’utilisateur est en page 2 et modifie le terme de recherche ou la catégorie
- **THEN** le picker repasse à la page 1 avant de recharger

## MODIFIED Requirements

### Requirement: Source dynamic via ApiCollection (article et video)

Lorsque `mode=dynamic` et `collectionType` vaut `article` ou `video`, NodeCollection SHALL :

- proposer le picking depuis les APIs du catalogue filtrées `mode=dynamic` et `type` correspondant ;
- permettre d’affiner le browse du picker via **recherche** et, si disponibles, **catégories**, en consommant les endpoints ApiCollection (`items` avec `search`/`category`, `categories`) ;
- persister des références `{ apiId, itemId }` (ou équivalent) dans `dynamicItems` ;
- résoudre les items via **`POST /api/page-builder/collections/resolve`**.

Le mode dynamic **`image`** MAY conserver le picking file manager (hors ApiCollection) comme comportement éditorial.

#### Scenario: Resolve article dynamic

- **WHEN** l’utilisateur a sélectionné deux articles en mode dynamic
- **THEN** le nœud appelle resolve avec les deux références et affiche les items mappés dans l’ordre persisté

#### Scenario: Catalogue dynamic filtré

- **WHEN** l’utilisateur ouvre le picker en `collectionType=video`, `mode=dynamic`
- **THEN** seules les APIs `type=video` supportant `dynamic` sont proposées

#### Scenario: Picking avec filtres

- **WHEN** l’utilisateur ouvre le picker dynamic article/video sur une source supportant search/catégorie
- **THEN** il peut filtrer la liste affichée avant de sélectionner un item, sans quitter la modale
