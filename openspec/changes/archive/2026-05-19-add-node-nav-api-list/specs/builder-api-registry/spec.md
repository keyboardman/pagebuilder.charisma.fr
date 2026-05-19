## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Format minimal des items list pour la navigation

Pour une API de type `list`, chaque item mappé SHALL fournir au minimum un identifiant stable (`id`), un libellé affichable (`title`) et une URL de destination (`link`). Les champs `description`, `image`, `labels` et `text` restent optionnels. La cible des liens (`target`) ne fait pas partie du contrat ApiCard `list` : elle est gérée par le nœud **NodeNavApi** dans le builder.

#### Scenario: Mapping d’un item list exploitable par NodeNavApi

- **WHEN** le backend mappe un item brut provenant d’une API `list`
- **THEN** l’item JSON contient `id`, `title` et `link` non vides pour permettre le rendu d’un lien de menu sans transformation supplémentaire côté frontend
