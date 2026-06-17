# builder-api-registry Specification

## Purpose
TBD - created by archiving change add-builder-api-registry-php. Update Purpose after archive.
## Requirements
### Requirement: Interfaces PHP pour les APIs card (article et vidéo)

Le système SHALL exposer des interfaces PHP décrivant le contrat des APIs « card » utilisables par le builder. Une interface de base (ex. `ApiCardInterface`) SHALL définir les méthodes : identifiant, libellé, type, récupération d’une collection, récupération d’un item par ID, et mapping d’un item brut vers un format standard (id, title, description, image, labels, link, text, raw). Les interfaces `ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface` et `ApiCardListInterface` SHALL étendre cette base et fixer le type à `article`, `video`, `image` et `list` respectivement.

Pour les APIs de type `article`, `video`, `image` et `list`, le contrat SHALL permettre deux modes de consommation:
- un mode normal (collection standard, ex. pilotée par recherche/filtres/pagination selon l’implémentation),
- un mode collection fixe (curatée côté backend), destinée à un usage éditorial dans le builder, sans exiger de recherche ni de pagination pilotée par l’utilisateur.

#### Scenario: Implémentation d’une API article

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `article`

#### Scenario: Implémentation d’une API vidéo

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `video`

#### Scenario: Implémentation d’une API article en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` et retournant une collection fixe d’items article
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `article`, sans dépendre d’une interaction de recherche utilisateur

#### Scenario: Implémentation d’une API vidéo en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` et retournant une collection fixe d’items vidéo
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `video`, sans dépendre d’une interaction de recherche utilisateur

#### Scenario: Implémentation d’une API image en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardImageInterface` et retournant une collection fixe d’items image
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `image`, sans dépendre d’une interaction de recherche utilisateur

#### Scenario: Implémentation d’une API image en mode normal

- **WHEN** un développeur crée un service PHP implémentant `ApiCardImageInterface` avec une collection standard (non fixe)
- **THEN** ce service est consommable par le builder de la même manière que les APIs `article` et `video` en mode normal

#### Scenario: Implémentation d’une API list

- **WHEN** un développeur crée un service PHP implémentant `ApiCardListInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list`

#### Scenario: Implémentation d’une API list en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardListInterface` et retournant une collection fixe d’entrées de navigation
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list`, sans dépendre d’une interaction de recherche utilisateur

### Requirement: Registre Symfony listant toutes les APIs card

Le système SHALL fournir un registre (service Symfony) qui agrège toutes les implémentations des interfaces ApiCard (Article, Vidéo, Image, List) enregistrées via le conteneur (ex. tag `app.builder_api_card`). Le registre SHALL exposer une méthode pour lister toutes les APIs disponibles (id, label, type, category) et une méthode pour obtenir une API par identifiant.

#### Scenario: Liste des APIs après enregistrement de services tagués

- **WHEN** des services implémentant `ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface` ou `ApiCardListInterface` sont tagués pour le registre
- **THEN** le registre retourne la liste de ces APIs avec leurs métadonnées (id, label, type, category) sans appeler fetchCollection ni fetchItem

#### Scenario: Récupération d’une API par ID

- **WHEN** le registre est interrogé avec un identifiant d’API existant
- **THEN** il retourne l’instance correspondante ; pour un identifiant inconnu, il retourne null ou lève une exception selon le contrat choisi

### Requirement: Endpoints HTTP pour le builder (liste, collection, item)

Le systeme SHALL exposer des endpoints HTTP permettant au builder de recuperer la liste des APIs card et les donnees (collection paginee, item) pour chaque API. Au minimum : `GET` liste des cards (reponse JSON : id, label, type, category) ; `GET` collection pour une API donnee (parametres de requete : page, limit, search, sort, category) ; `GET` item par API et ID d’item. Optionnellement : `GET` categories pour une API. Les reponses SHALL etre en JSON. Les endpoints SHALL etre proteges avec la meme politique d’acces que l’edition de pages.

L’implementation Symfony de ces endpoints SHALL etre organisee dans un repertoire dedie `src/Controller/Api/` avec une separation par responsabilite fonctionnelle (ex. cards APIs, polices, catalogue de formulaires), plutot qu’un controller unique regroupant tous les domaines.

La restructuration SHALL conserver strictement les routes publiques existantes du builder (`/page-builder/api/*`), les parametres supportes, les payloads JSON et les statuts HTTP attendus.

#### Scenario: Recuperation de la liste des APIs depuis le frontend

- **WHEN** le builder ou la page d’edition appelle l’endpoint de liste des APIs (authentifie comme pour l’edition de page)
- **THEN** la reponse JSON contient un tableau d’objets avec id, label, type et optionnellement category pour chaque API enregistree

#### Scenario: Recuperation d’une collection paginee pour une API

- **WHEN** le frontend appelle l’endpoint de collection pour un identifiant d’API valide avec page, limit et optionnellement search, sort, category
- **THEN** le serveur delegue a l’implementation ApiCard correspondante et retourne un JSON du type `{ items: [...], total: number }`, les items etant au format mappe (id, title, description, image, etc.)

#### Scenario: Recuperation d’un item par ID

- **WHEN** le frontend appelle l’endpoint item pour un identifiant d’API et un identifiant d’item valides
- **THEN** le serveur delegue a l’implementation ApiCard et retourne l’item au format mappe en JSON

#### Scenario: Responsabilites separees dans Controller Api

- **WHEN** un developpeur inspecte le code backend des endpoints builder API
- **THEN** les actions sont reparties dans des controllers specialises sous `src/Controller/Api/` selon leur domaine fonctionnel
- **AND** aucun endpoint `/page-builder/api/*` n’est perdu ou renomme uniquement a cause de cette refactorisation

### Requirement: Variante d’affichage image gérée côté éditeur

Le système SHALL gérer la variante d’affichage image (`list` ou `slider`) uniquement dans l’éditeur page builder (configuration de bloc ou logique frontend). Les APIs `ApiCard` backend SHALL rester agnostiques de cette variante et ne SHALL pas exposer de métadonnée dédiée pour `list`/`slider`.

#### Scenario: Rendu image en mode list configuré dans l’éditeur

- **WHEN** un bloc image API est configuré en mode `list` dans l’éditeur
- **THEN** le frontend rend les images sous forme de liste, sans dépendre d’une métadonnée `list` provenant de l’API card backend

#### Scenario: Rendu image en mode slider configuré dans l’éditeur

- **WHEN** un bloc image API est configuré en mode `slider` dans l’éditeur
- **THEN** le frontend rend les images dans un composant slider, sans dépendre d’une métadonnée `slider` provenant de l’API card backend

### Requirement: Format minimal des items image mappés

Pour une API de type `image`, chaque item mappé SHALL fournir au minimum un identifiant stable (`id`) et une source d’image exploitable (`image` ou `src` selon le contrat normalisé choisi), avec un texte alternatif optionnel (`alt`) et un lien optionnel (`link`). Ce format SHALL être suffisant pour les deux variantes de rendu (`list`, `slider`).

#### Scenario: Mapping d’un item image compatible liste et slider

- **WHEN** le backend mappe un item brut provenant d’une API image
- **THEN** l’item JSON contient les champs minimaux requis pour être rendu sans transformation supplémentaire par le builder en mode `list` comme en mode `slider`

### Requirement: Format minimal des items article et vidéo en collection fixe

Pour une API de type `article` ou `video` exploitée en collection fixe, chaque item mappé SHALL fournir un identifiant stable (`id`), un titre (`title`) et les champs de présentation nécessaires au composant cible du builder (au minimum image/thumbnail et lien quand applicable). Le format SHALL rester compatible avec le contrat normalisé des APIs card.

#### Scenario: Mapping d’un item article en collection fixe

- **WHEN** le backend mappe un item brut provenant d’une API article en mode collection fixe
- **THEN** l’item JSON contient les champs requis pour être affiché dans une liste fixe d’articles du builder

#### Scenario: Mapping d’un item vidéo en collection fixe

- **WHEN** le backend mappe un item brut provenant d’une API vidéo en mode collection fixe
- **THEN** l’item JSON contient les champs requis pour être affiché dans une liste fixe de vidéos du builder

### Requirement: Format minimal des items list pour la navigation

Pour une API de type `list`, chaque item mappé SHALL fournir au minimum un identifiant stable (`id`), un libellé affichable (`title`) et une URL de destination (`link`). Les champs `description`, `image`, `labels` et `text` restent optionnels. La cible des liens (`target`) ne fait pas partie du contrat ApiCard `list` : elle est gérée par le nœud **NodeNavApi** dans le builder.

#### Scenario: Mapping d’un item list exploitable par NodeNavApi

- **WHEN** le backend mappe un item brut provenant d’une API `list`
- **THEN** l’item JSON contient `id`, `title` et `link` non vides pour permettre le rendu d’un lien de menu sans transformation supplémentaire côté frontend

### Requirement: Endpoints builder API compatibles API Platform

Le systeme SHALL exposer les endpoints du domaine builder API via des operations API Platform documentees et consommables par les interfaces du builder. Les operations SHALL couvrir au minimum:
- la liste des APIs card disponibles,
- la collection d'une API donnee avec pagination et filtres,
- le detail d'un item mappe.

Les operations API Platform SHALL reutiliser la logique metier existante du registre ApiCard et du mapping d'items afin d'eviter toute divergence fonctionnelle.

#### Scenario: Recuperation de la liste des APIs via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de listing des APIs card
- **THEN** la reponse JSON contient les metadonnees attendues (`id`, `label`, `type`, `category`) pour chaque API enregistree

#### Scenario: Recuperation d'une collection via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de collection avec `page`, `limit`, `search`, `sort` ou `category`
- **THEN** le backend retourne un payload JSON compatible avec le contrat builder (`items`, `total`) en s'appuyant sur l'implementation ApiCard correspondante

#### Scenario: Recuperation d'un item via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de detail avec un `apiId` et un `itemId` valides
- **THEN** le backend retourne l'item mappe au format standardise du registre builder API

### Requirement: Compatibilite descendante des routes publiques builder API

La migration vers API Platform SHALL conserver les routes publiques existantes du builder sous `/page-builder/api/*` pendant la phase de transition. Ces routes SHALL deleguer vers la meme logique applicative que les operations API Platform afin de garantir la parite de comportement (parametres supportes, payload JSON, statuts HTTP, gestion des erreurs).

#### Scenario: Appel legacy pendant la transition
- **WHEN** une interface existante appelle un endpoint historique `/page-builder/api/*`
- **THEN** la reponse obtenue reste compatible avec le contrat actuel, sans rupture fonctionnelle visible cote frontend

#### Scenario: Parite entre route legacy et operation API Platform
- **WHEN** la meme requete metier est executee via route legacy puis via operation API Platform equivalente
- **THEN** les deux reponses presentent les memes donnees metier et des statuts HTTP cohérents

