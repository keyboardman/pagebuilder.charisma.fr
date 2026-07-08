## MODIFIED Requirements

### Requirement: Interfaces PHP pour les APIs card (article et vidéo)

Le système SHALL exposer des interfaces PHP décrivant le contrat des APIs « card » utilisables par le builder. Une interface de base (ex. `ApiCardInterface`) SHALL définir les méthodes : identifiant, libellé, type, récupération d’une collection, récupération d’un item par ID, et mapping d’un item brut vers un format standard (id, title, description, image, labels, link, text, counter, raw). Les interfaces `ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface` et `ApiCardListInterface` SHALL étendre cette base et SHALL fournir une implémentation par défaut de `getType()` retournant respectivement `article`, `video`, `image` et `list`. Les classes concrètes implémentant une interface typée SHALL NOT être tenues de redéclarer `getType()` tant qu'elles n'ont pas besoin de surcharger le type.

Pour les APIs de type `article`, `video`, `image` et `list`, le contrat SHALL permettre deux modes de consommation:
- un mode normal (collection standard, ex. pilotée par recherche/filtres/pagination selon l’implémentation),
- un mode collection fixe (curatée côté backend), destinée à un usage éditorial dans le builder, sans exiger de recherche ni de pagination pilotée par l’utilisateur.

Le champ **`counter`** SHALL être optionnel dans le format mappe : lorsqu’il est present, il SHALL representer une valeur affichable (nombre ou chaine) telle qu’un compteur de vues, de likes ou un rang.

#### Scenario: Implémentation d’une API article

- **WHEN** un développeur crée un service PHP implémentant `ApiCardArticleInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `article` sans implémenter explicitement `getType()`

#### Scenario: Implémentation d’une API vidéo

- **WHEN** un développeur crée un service PHP implémentant `ApiCardVideoInterface` avec fetchCollection, fetchItem et mapItem
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `video` sans implémenter explicitement `getType()`

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
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list` sans implémenter explicitement `getType()`

#### Scenario: Implémentation d’une API list en collection fixe

- **WHEN** un développeur crée un service PHP implémentant `ApiCardListInterface` et retournant une collection fixe d’entrées de navigation
- **THEN** ce service peut être enregistré dans le registre et exposé au builder comme API de type `list`, sans dépendre d’une interaction de recherche utilisateur

#### Scenario: Mapping avec compteur optionnel

- **WHEN** une implémentation ApiCard mappe un item brut contenant un compteur exploitable (ex. vues, likes, rang)
- **THEN** l’item mappe expose ce compteur dans le champ optionnel `counter` en plus des champs standard existants

## ADDED Requirements

### Requirement: Propagation du champ counter dans les réponses API Platform

Les ressources et DTOs exposant un item ApiCard mappe (ex. `BuilderApiCardItem`, `BuilderApiCardItemData`) SHALL inclure le champ optionnel **`counter`**. La factory de mapping backend SHALL transmettre `counter` depuis le resultat de `mapItem` vers le JSON retourne par les endpoints API Platform de collection et de detail item.

#### Scenario: Item avec compteur dans une collection paginee

- **WHEN** le frontend appelle l’endpoint de collection pour une API dont `mapItem` retourne un `counter`
- **THEN** chaque item JSON de la reponse contient le champ `counter` avec la valeur mappee

#### Scenario: Item sans compteur

- **WHEN** le frontend appelle l’endpoint de collection ou de detail pour une API dont `mapItem` ne retourne pas de `counter`
- **THEN** le champ `counter` est absent ou null dans le JSON, sans erreur de serialisation

#### Scenario: Compatibilite des clients existants

- **WHEN** un client builder existant consomme les endpoints ApiCard sans connaitre le champ `counter`
- **THEN** le comportement des champs existants (`id`, `title`, `description`, `image`, etc.) reste inchange

## MODIFIED Requirements

### Requirement: Format minimal des items list pour la navigation

Pour une API de type `list`, chaque item mappé SHALL fournir au minimum un identifiant stable (`id`), un libellé affichable (`title`) et une URL de destination (`link`). Les champs `description`, `image`, `labels`, `text` et `counter` restent optionnels. La cible des liens (`target`) ne fait pas partie du contrat ApiCard `list` : elle est gérée par le nœud **NodeNavApi** dans le builder. Le nœud **NodeListApi** SHALL consommer les mêmes APIs `list` et exploiter les champs optionnels `image`, `description` et `counter` lorsqu’ils sont fournis par `mapItem`.

#### Scenario: Mapping d’un item list exploitable par NodeNavApi

- **WHEN** le backend mappe un item brut provenant d’une API `list`
- **THEN** l’item JSON contient `id`, `title` et `link` non vides pour permettre le rendu d’un lien de menu sans transformation supplémentaire côté frontend

#### Scenario: Mapping d’un item list riche pour NodeListApi

- **WHEN** le backend mappe un item `list` contenant `image`, `description` ou `counter` en plus de `id` et `title`
- **THEN** l’item JSON expose ces champs optionnels pour permettre le rendu conditionnel dans **NodeListApi** sans transformation supplémentaire côté frontend
