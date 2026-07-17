# api-collection Specification

## Purpose

Contrat backend unifié **ApiCollection** pour alimenter NodeCollection : catalogue, items paginés, resolve dynamic, mapping item standard, adapters PHP et définitions admin.

## Requirements

### Requirement: Contrat ApiCollection unifié

Le système SHALL exposer un contrat **ApiCollection** pour les sources de données consommées par NodeCollection. Chaque API SHALL déclarer :

- un identifiant unique (`id`) et un libellé (`label`) ;
- un **`type`** parmi `image`, `video`, `article` ;
- une liste de **modes supportés** parmi `fixed` et `dynamic` ;
- une capacité à retourner une page d’items (`fetchItems` avec `page` et `itemsPerPage`) ;
- lorsque `dynamic` est supporté, une capacité à résoudre un item par identifiant (`fetchItem`).

#### Scenario: API article fixed enregistrée

- **WHEN** une ApiCollection de type `article` avec mode `fixed` est enregistrée
- **THEN** elle apparaît dans le catalogue filtré `type=article&mode=fixed` et expose `fetchItems` paginé

#### Scenario: API video dynamic avec fetchItem

- **WHEN** une ApiCollection de type `video` déclare le mode `dynamic`
- **THEN** `fetchItem(id)` est disponible et retourne un item mappé ou `null` si introuvable

### Requirement: Mapping item standard

Chaque item retourné par ApiCollection SHALL être mappé vers un objet standard dont le seul champ obligatoire est **`id`** (string). Les champs suivants SHALL être optionnels et omis lorsqu’absents ou non mappables : **`image`**, **`title`**, **`description`**, **`label`**, **`labels`** (liste), **`counter`**, **`like`**, **`link`**, **`alt`**.

#### Scenario: Article avec compteur et likes

- **WHEN** la source distante fournit des champs mappés vers `counter` et `like`
- **THEN** l’item JSON exposé contient `counter` et `like` en plus de `id` et des autres champs mappés

#### Scenario: Image minimale

- **WHEN** une API de type `image` mappe uniquement `id` et `image`
- **THEN** l’item JSON contient au minimum `id` et `image`, sans exiger `title` ni `description`

#### Scenario: Champ absent non forcé

- **WHEN** le mapping ne définit pas `description` ou que la valeur source est vide
- **THEN** le champ `description` est absent ou null dans la réponse, sans erreur

### Requirement: Mode fixed paginé

Pour une ApiCollection supportant `fixed`, l’endpoint d’items SHALL accepter **`page`** (entier ≥ 1, défaut 1) et **`itemsPerPage`** (entier ≥ 1, borne max documentée, défaut 10) et SHALL retourner une page contenant la liste d’items mappés ainsi que les métadonnées de pagination (`totalItems`, `totalPages`, `page`, `itemsPerPage`) lorsque la source les permet.

#### Scenario: Pagination transmise

- **WHEN** le client demande `page=2` et `itemsPerPage=5` sur une API fixed paginée
- **THEN** la réponse contient les items de la page 2 et les métadonnées de pagination cohérentes

#### Scenario: Source sans pagination distante

- **WHEN** l’API fixed a un style de pagination `none`
- **THEN** le runtime découpe localement la collection selon `page` et `itemsPerPage` ou retourne l’ensemble sur une seule page selon la configuration, sans erreur 500

### Requirement: Mode dynamic browse et resolve

Pour une ApiCollection supportant `dynamic`, le système SHALL permettre :

1. de **parcourir** la collection (`fetchItems`) pour le picker éditorial ;
2. de **résoudre** une liste ordonnée de références `{ apiId, itemId }` vers des items mappés via un endpoint de resolve dédié.

Les références dont l’item est introuvable SHALL être ignorées (ou omises) sans faire échouer toute la résolution.

#### Scenario: Resolve multi-références

- **WHEN** le client envoie `POST /api/page-builder/collections/resolve` avec deux références valides
- **THEN** la réponse contient les deux items mappés dans le même ordre

#### Scenario: Référence invalide

- **WHEN** une des références pointe vers un `itemId` inconnu
- **THEN** cet item est omis et les autres références valides sont tout de même retournées

### Requirement: Catalogue unifié

Le système SHALL exposer `GET /api/page-builder/collections` listant toutes les ApiCollection actives (adapters PHP et définitions admin enabled). La liste SHALL pouvoir être filtrée par query **`type`** et/ou **`mode`**. Chaque entrée de catalogue SHALL inclure au minimum `id`, `label`, `type`, `supportedModes`.

#### Scenario: Filtre type et mode

- **WHEN** le builder appelle `GET /api/page-builder/collections?type=article&mode=fixed`
- **THEN** seules les APIs article supportant `fixed` sont retournées

#### Scenario: Fusion adapters et définitions

- **WHEN** des adapters PHP et des définitions admin enabled coexistent
- **THEN** le catalogue contient les deux origines sans doublon d’`id`

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

### Requirement: Adapters de compatibilité

Le registre ApiCollection SHALL inclure des **adapters** exposant les sources PHP encore non migrées en définition seedée (notamment ApiListImage bannières à pagination custom, ApiCard video, et tout ApiList/ApiCard hors set seed v1) sous le contrat ApiCollection. Les sources déjà seedées en base SHALL NOT nécessiter d’adapter PHP actif pour le même `api_id`.

#### Scenario: Liste image legacy visible

- **WHEN** une ApiListImage bannière existante (ex. `charisma_evenement_home`) est encore enregistrée via adapter
- **THEN** elle apparaît dans `GET /collections?type=image&mode=fixed` avec le même `id`

#### Scenario: Source seedée sans adapter

- **WHEN** une ApiListArticle historique a été importée en `api_collection_definition` et son tag DI retiré
- **THEN** elle reste visible dans le catalogue via la définition DB uniquement

### Requirement: Définitions seedées dans le catalogue

Le catalogue ApiCollection SHALL traiter les définitions `api_collection_definition` seedées (enabled) au même titre que les définitions créées manuellement : elles SHALL apparaître dans `GET /api/page-builder/collections` et servir `fetchItems` / `fetchItem` via le runtime configurable, sans exiger d’adapter PHP pour ces `api_id`.

#### Scenario: Source seedée visible sans adapter

- **WHEN** une définition seedée `flashnews_article_home` est enabled et qu’aucun adapter PHP ne porte cet id
- **THEN** elle apparaît dans le catalogue filtré `type=article&mode=fixed` et expose des items via `/collections/flashnews_article_home/items`

#### Scenario: Priorité anti-doublon

- **WHEN** un `api_id` est à la fois présent en définition enabled et en adapter PHP
- **THEN** le système MUST empêcher ce doublon (validation admin / ids réservés / désenregistrement adapter) plutôt que d’exposer deux entrées
