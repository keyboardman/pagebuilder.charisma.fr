## MODIFIED Requirements

### Requirement: Interfaces PHP pour les APIs card (article et vidéo)

Le système SHALL exposer des interfaces PHP décrivant le contrat des APIs « card » utilisables par le builder. Une interface de base (ex. `ApiCardInterface`) SHALL définir les méthodes : identifiant, libellé, type, récupération d'une collection, récupération d'un item par ID, et mapping d'un item brut vers un format standard (id, title, description, image, labels, link, text, raw). Les interfaces `ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface` et `ApiCardListInterface` SHALL étendre cette base et SHALL fournir une implémentation par défaut de `getType()` retournant respectivement `article`, `video`, `image` et `list`. Les classes concrètes implémentant une interface typée SHALL NOT être tenues de redéclarer `getType()` tant qu'elles n'ont pas besoin de surcharger le type.

Pour les APIs de type `article`, `video`, `image` et `list`, le contrat SHALL permettre deux modes de consommation:
- un mode normal (collection standard, ex. pilotée par recherche/filtres/pagination selon l'implémentation),
- un mode collection fixe (curatée côté backend), destinée à un usage éditorial dans le builder, sans exiger de recherche ni de pagination pilotée par l'utilisateur.

#### Scenario: Implémentation d'une API article

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `article` sans implémenter explicitement `getType()`

#### Scenario: Implémentation d'une API vidéo

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `video` sans implémenter explicitement `getType()`

#### Scenario: Implémentation d'une API article en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` et retournant une collection fixe d'items article
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `article`, sans dépendre d'une interaction de recherche utilisateur

#### Scenario: Implémentation d'une API vidéo en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` et retournant une collection fixe d'items vidéo
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `video`, sans dépendre d'une interaction de recherche utilisateur

#### Scenario: Implémentation d'une API image en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardImageInterface` et retournant une collection fixe d'items image
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `image`, sans dépendre d'une interaction de recherche utilisateur

#### Scenario: Implémentation d'une API image en mode normal

- **WHEN** un développeur crée un service PHP implémentant `ApiCardImageInterface` avec une collection standard (non fixe)
- **THEN** ce service est consommable par le builder de la même manière que les APIs `article` et `video` en mode normal

#### Scenario: Implémentation d'une API list

- **WHEN** un développeur crée un service PHP implémentant `ApiCardListInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list` sans implémenter explicitement `getType()`

#### Scenario: Implémentation d'une API list en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardListInterface` et retournant une collection fixe d'entrées de navigation
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list`, sans dépendre d'une interaction de recherche utilisateur

#### Scenario: Type par défaut hérité de l'interface

- **WHEN** le registre appelle `getType()` sur un service implémentant `ApiCardImageInterface` sans méthode `getType()` propre
- **THEN** la valeur retournée est `image`
