## MODIFIED Requirements
### Requirement: Interfaces PHP pour les APIs card (article et vidéo)

Le système SHALL exposer des interfaces PHP décrivant le contrat des APIs « card » utilisables par le builder. Une interface de base (ex. `ApiCardInterface`) SHALL définir les méthodes : identifiant, libellé, type, récupération d’une collection, récupération d’un item par ID, et mapping d’un item brut vers un format standard (id, title, description, image, labels, link, text, raw). Les interfaces `ApiCardArticleInterface`, `ApiCardVideoInterface` et `ApiCardImageInterface` SHALL étendre cette base et fixer le type à `article`, `video` et `image`.

Pour les APIs de type `article`, `video` et `image`, le contrat SHALL permettre deux modes de consommation:
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

## ADDED Requirements
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
