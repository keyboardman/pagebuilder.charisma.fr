# builder-api-registry Specification

## Purpose
TBD - created by archiving change add-builder-api-registry-php. Update Purpose after archive.
## Requirements
### Requirement: Interfaces PHP pour les APIs card (article et vidéo)

Le système SHALL exposer des interfaces PHP décrivant le contrat des APIs « card » utilisables par le builder. Une interface de base (ex. `ApiCardInterface`) SHALL définir les méthodes : identifiant, libellé, type, récupération d’une collection paginée, récupération d’un item par ID, et mapping d’un item brut vers un format standard (id, title, description, image, labels, link, text, raw). Les interfaces `ApiCardArticleInterface` et `ApiCardVideoInterface` SHALL étendre cette base et fixer le type à `article` respectivement `video`. Les méthodes optionnelles (liste des catégories, nom du paramètre de requête pour la catégorie) SHALL être autorisées sur l’interface de base.

#### Scenario: Implémentation d’une API article

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type « article »

#### Scenario: Implémentation d’une API vidéo

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type « vidéo »

### Requirement: Registre Symfony listant toutes les APIs card

Le système SHALL fournir un registre (service Symfony) qui agrège toutes les implémentations des interfaces ApiCard (Article / Vidéo) enregistrées via le conteneur (ex. tag `app.builder_api_card`). Le registre SHALL exposer une méthode pour lister toutes les APIs disponibles (id, label, type, category) et une méthode pour obtenir une API par identifiant.

#### Scenario: Liste des APIs après enregistrement de services tagués

- **WHEN** des services implémentant `ApiCardArticleInterface` ou `ApiCardVideoInterface` sont tagués pour le registre
- **THEN** le registre retourne la liste de ces APIs avec leurs métadonnées (id, label, type, category) sans appeler fetchCollection ni fetchItem

#### Scenario: Récupération d’une API par ID

- **WHEN** le registre est interrogé avec un identifiant d’API existant
- **THEN** il retourne l’instance correspondante ; pour un identifiant inconnu, il retourne null ou lève une exception selon le contrat choisi

### Requirement: Endpoints HTTP pour le builder (liste, collection, item)

Le système SHALL exposer des endpoints HTTP permettant au builder de récupérer la liste des APIs card et les données (collection paginée, item) pour chaque API. Au minimum : `GET` liste des cards (réponse JSON : id, label, type, category) ; `GET` collection pour une API donnée (paramètres de requête : page, limit, search, sort, category) ; `GET` item par API et ID d’item. Optionnellement : `GET` catégories pour une API. Les réponses SHALL être en JSON. Les endpoints SHALL être protégés avec la même politique d’accès que l’édition de pages.

#### Scenario: Récupération de la liste des APIs depuis le frontend

- **WHEN** le builder ou la page d’édition appelle l’endpoint de liste des APIs (authentifié comme pour l’édition de page)
- **THEN** la réponse JSON contient un tableau d’objets avec id, label, type et optionnellement category pour chaque API enregistrée

#### Scenario: Récupération d’une collection paginée pour une API

- **WHEN** le frontend appelle l’endpoint de collection pour un identifiant d’API valide avec page, limit et optionnellement search, sort, category
- **THEN** le serveur délègue à l’implémentation ApiCard correspondante et retourne un JSON du type `{ items: [...], total: number }`, les items étant au format mappé (id, title, description, image, etc.)

#### Scenario: Récupération d’un item par ID

- **WHEN** le frontend appelle l’endpoint item pour un identifiant d’API et un identifiant d’item valides
- **THEN** le serveur délègue à l’implémentation ApiCard et retourne l’item au format mappé en JSON

