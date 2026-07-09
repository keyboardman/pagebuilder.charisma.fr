# charisma-temoignage-home-api-list Specification

## Purpose

Exposer une ApiCard backend `charisma_temoignage_home` pour lister les témoignages de la page d'accueil Charisma dans **NodeListApi**, avec mapping riche et dégradation gracieuse en cas d'erreur API distante.

## Requirements

### Requirement: ApiCard témoignages home disponible dans le registre builder

Le système SHALL exposer une ApiCard backend identifiée `charisma_temoignage_home` et libellée pour les témoignages de la page d'accueil, de type `list`, afin qu'elle soit listable et sélectionnable depuis **NodeListApi**.

#### Scenario: Présence de la card dans la liste des APIs

- **WHEN** le builder appelle l'endpoint de listing des ApiCards
- **THEN** la card `charisma_temoignage_home` est présente avec le type `list`

### Requirement: Récupération de la collection home depuis l'API distante

La card SHALL appeler `https://api.charisma.fr/api/charisma/temoignages/home` pour récupérer la collection, en mode `fixed`, et SHALL supporter un filtre de recherche sur le titre (`titre`) lorsqu'un terme `search` est fourni.

#### Scenario: Appel nominal de la collection home

- **WHEN** une collection est demandée pour la card `charisma_temoignage_home`
- **THEN** le backend interroge l'endpoint home et retourne un payload `items` et `total` dérivés de `member` et `totalItems`

#### Scenario: Recherche par titre

- **WHEN** une collection est demandée avec un paramètre `search`
- **THEN** la card transmet ce filtre en requête distante sur le champ `titre`

### Requirement: Mapping des témoignages home au format list riche du builder

Chaque item provenant de l'endpoint home SHALL être mappé vers le contrat `list` du builder avec au minimum `id`, `title` et `link`, et SHALL exposer `description`, `image` et `labels` lorsque les champs distants sont disponibles (`resume`, `thumbnails.normal`, `theme.nom`).

Le mapping SHALL également exposer les champs optionnels `counter` et `like` si l'API distante fournit des valeurs compatibles (ex. vues/likes).

#### Scenario: Mapping d'un témoignage complet

- **WHEN** un item distant contient `id`, `titre`, `resume`, `thumbnails.normal`, `theme.nom` et `url`
- **THEN** l'item mappé expose `id`, `title`, `description`, `image`, `labels` et `link`, avec `raw` contenant l'objet d'origine

#### Scenario: Mapping tolérant aux champs manquants

- **WHEN** un item distant n'a pas de vignette ou de thème
- **THEN** le mapping retourne un objet valide du contrat `list` avec `image` et `labels` omis ou nuls, sans bloquer le rendu

#### Scenario: Counter/like absents

- **WHEN** un item distant ne fournit pas de compteur ou de likes
- **THEN** le mapping retourne un objet valide du contrat `list` sans `counter`/`like`, sans bloquer le rendu

### Requirement: Dégradation gracieuse en cas d'erreur API externe

Si l'appel à l'endpoint home échoue ou retourne un format inexploitable, la card SHALL retourner une collection vide (`items: []`, `total: 0`) plutôt que de propager une erreur bloquante.

#### Scenario: Timeout ou erreur HTTP de l'API distante

- **WHEN** la card subit une exception lors de l'appel externe
- **THEN** la réponse de collection est vide et le builder reste fonctionnel
