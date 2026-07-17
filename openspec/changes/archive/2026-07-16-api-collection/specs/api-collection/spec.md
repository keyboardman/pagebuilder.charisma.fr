## ADDED Requirements

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

Le système SHALL exposer `GET /api/page-builder/collections/{apiId}/items` qui délègue à l’ApiCollection correspondante (`fetchItems`) indépendamment du `type`. Un `apiId` inconnu ou désactivé SHALL produire une réponse d’erreur appropriée (404) ou une page vide documentée, de façon déterministe.

#### Scenario: Chargement items image fixed

- **WHEN** NodeCollection appelle `/collections/{apiId}/items` pour une API image fixed avec pagination
- **THEN** la réponse contient des items au format mapping standard

#### Scenario: apiId inconnu

- **WHEN** le client demande les items d’un `apiId` absent du registre
- **THEN** le système répond 404 (ou équivalent API Platform) sans fuite d’erreur interne

### Requirement: Adapters de compatibilité

Le registre ApiCollection SHALL inclure des **adapters** exposant les sources PHP existantes (`ApiListArticle`, `ApiListImage`, sources dynamic article, collections video ApiCard le cas échéant) sous le contrat ApiCollection, afin de préserver les catalogues déjà utilisés en production.

#### Scenario: Liste article legacy visible

- **WHEN** une ApiListArticle existante (ex. `charisma_article_enaction_home`) est enregistrée via adapter
- **THEN** elle apparaît dans `GET /collections?type=article&mode=fixed` avec le même `id`

#### Scenario: Liste image legacy visible

- **WHEN** une ApiListImage existante est enregistrée via adapter
- **THEN** elle apparaît dans `GET /collections?type=image&mode=fixed` avec le même `id`
