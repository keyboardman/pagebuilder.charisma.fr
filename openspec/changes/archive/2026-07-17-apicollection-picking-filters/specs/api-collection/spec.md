## ADDED Requirements

### Requirement: Filtres search et category sur fetchItems

Le contrat ApiCollection SHALL accepter, sur `fetchItems` et sur `GET /api/page-builder/collections/{apiId}/items`, les query params optionnels **`search`** et **`category`** (en plus de `page` et `itemsPerPage`). Lorsqu’une source déclare un mapping de nom distant pour l’un de ces filtres, la valeur non vide SHALL être transmise à l’API distante sous ce nom. Lorsqu’aucun mapping n’est déclaré, le filtre SHALL être ignoré sans erreur.

#### Scenario: Recherche transmise (définition configurable)

- **WHEN** une définition a `searchQueryParam=titre` et le client appelle `/collections/{apiId}/items?search=paris`
- **THEN** le runtime appelle l’endpoint distant avec le query param `titre=paris`

#### Scenario: Catégorie transmise (définition configurable)

- **WHEN** une définition a `categoryQueryParam=themes` et le client appelle `/collections/{apiId}/items?category=actu`
- **THEN** le runtime appelle l’endpoint distant avec le query param `themes=actu`

#### Scenario: Filtre non configuré

- **WHEN** le client envoie `search=foo` sur une source sans `searchQueryParam`
- **THEN** la requête distante n’inclut pas de paramètre dérivé de `search` et la réponse reste déterministe (pas d’erreur 500)

#### Scenario: Adapter ApiCard

- **WHEN** un adapter ApiCard reçoit `search` et `category` via `fetchItems`
- **THEN** il les transmet à `fetchCollection` sous les clés attendues par la card (`search`, `category`)

### Requirement: Endpoint catégories ApiCollection

Le système SHALL exposer `GET /api/page-builder/collections/{apiId}/categories` retournant une liste JSON d’objets `{ id, label }`. Pour une définition configurable avec `categoriesUrl`, le runtime SHALL charger et mapper cette liste. Pour un adapter ApiCard, le système SHALL déléguer à `fetchCategories`. Une source sans catégories SHALL retourner une liste vide (HTTP 200). Un `apiId` inconnu SHALL produire 404.

#### Scenario: Catégories depuis définition

- **WHEN** une définition Flashnews expose `categoriesUrl` vers l’API thèmes et le client appelle `/collections/flashnews/categories`
- **THEN** la réponse contient des entrées `{ id, label }` dérivées de la réponse distante

#### Scenario: Catégories via adapter video

- **WHEN** le client appelle `/collections/videos/categories`
- **THEN** la réponse reflète les catégories fournies par la card PHP sous-jacente

#### Scenario: Source sans catégories

- **WHEN** le client appelle `/collections/{apiId}/categories` pour une source sans URL ni fetchCategories
- **THEN** la réponse est `{ "categories": [] }` (ou équivalent normalisé) avec statut succès

### Requirement: Métadonnées de filtre sur ApiCollectionDefinition

Une `ApiCollectionDefinition` SHALL pouvoir déclarer optionnellement `searchQueryParam`, `categoryQueryParam`, `categoriesUrl` et les chemins de mapping catégories nécessaires au runtime. Le formulaire admin SHALL permettre de saisir ces champs. Les définitions seedées des sources qui supportaient déjà search/catégorie en PHP SHALL être mises à jour pour renseigner ces métadonnées.

#### Scenario: Admin configure searchQueryParam

- **WHEN** un administrateur définit `searchQueryParam=titre` sur une définition et sauvegarde
- **THEN** les appels items suivants avec `search` utilisent ce mapping

#### Scenario: Seed Flashnews

- **WHEN** la migration data des filtres est appliquée pour `flashnews` / `flashnews_article`
- **THEN** ces définitions exposent `searchQueryParam=titre` et `categoryQueryParam=themes` (et une URL catégories lorsque applicable)

## MODIFIED Requirements

### Requirement: Endpoint items unifié

Le système SHALL exposer `GET /api/page-builder/collections/{apiId}/items` qui délègue à l’ApiCollection correspondante (`fetchItems`) indépendamment du `type`. L’endpoint SHALL accepter les query params **`page`**, **`itemsPerPage`**, et optionnellement **`search`** et **`category`**. Un `apiId` inconnu ou désactivé SHALL produire une réponse d’erreur appropriée (404) ou une page vide documentée, de façon déterministe.

#### Scenario: Chargement items image fixed

- **WHEN** NodeCollection appelle `/collections/{apiId}/items` pour une API image fixed avec pagination
- **THEN** la réponse contient des items au format mapping standard

#### Scenario: apiId inconnu

- **WHEN** le client demande les items d’un `apiId` absent du registre
- **THEN** le système répond 404 (ou équivalent API Platform) sans fuite d’erreur interne

#### Scenario: Items avec filtres de picking

- **WHEN** le client appelle `/collections/{apiId}/items?page=1&itemsPerPage=20&search=foo&category=bar` sur une source qui mappe ces filtres
- **THEN** `fetchItems` reçoit `search` et `category` et la page retournée reflète le filtrage distant
