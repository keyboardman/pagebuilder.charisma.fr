## ADDED Requirements

### Requirement: ApiCard articles home Flashnews disponible dans le registre builder

Le système SHALL exposer une ApiCard backend identifiée `flashnews_article_home` et libellée pour les articles de la page d'accueil Flashnews, de type `list`, afin qu'elle soit listable et sélectionnable depuis **NodeListApi**.

#### Scenario: Présence de la card dans la liste des APIs

- **WHEN** le builder appelle l'endpoint de listing des ApiCards
- **THEN** la card `flashnews_article_home` est présente avec le type `list`

### Requirement: Récupération de la collection home depuis l'API distante

La card SHALL appeler `https://www.flashnews.fr/api/articles` avec tri `order[publication]=desc` par défaut, en mode `fixed`, et SHALL supporter la pagination (`page`, `itemsPerPage`), un filtre de recherche sur le titre (`titre`) et un filtre thème (`themes`) lorsque les paramètres `search` ou `category` sont fournis.

#### Scenario: Appel nominal de la collection home

- **WHEN** une collection est demandée pour la card `flashnews_article_home`
- **THEN** le backend interroge `/api/articles` avec `order[publication]=desc` et retourne un payload `items` et `total` dérivés de `member` et `totalItems`

#### Scenario: Recherche par titre

- **WHEN** une collection est demandée avec un paramètre `search`
- **THEN** la card transmet ce filtre en requête distante sur le champ `titre`

#### Scenario: Filtre par thème

- **WHEN** une collection est demandée avec un paramètre `category`
- **THEN** la card transmet ce filtre en requête distante sur le champ `themes`

### Requirement: Mapping des articles home au format list riche du builder
Chaque item provenant de l'endpoint articles SHALL être mappé vers le contrat `list` du builder avec au minimum `id`, `title` et `link`, et SHALL exposer `description`, `image` et `labels` lorsque les champs distants sont disponibles (`viewResume`, `image`, `themes` ou `tags`).

Le mapping SHALL en outre exposer les champs optionnels `counter` et `like` lorsque l’API distante fournit des valeurs de vues/likes compatibles (ex. `vues`/`views` et `likes`/`favoris`/`favori`/`like`).

#### Scenario: Mapping d'un article complet

- **WHEN** un item distant contient `id`, `titre`, `viewResume`, `image`, `themes` et `link`
- **THEN** l'item mappé expose `id`, `title`, `description`, `image` (URL absolue), `labels` et `link`, avec `raw` contenant l'objet d'origine

#### Scenario: Mapping counter/like optionnels

- **WHEN** un item distant contient `vues`/`views` et `likes`/`favoris`/`favori`/`like`
- **THEN** l'item mappé expose `counter` et `like` (conversion en string ou en int selon source distante) en plus du contrat list

#### Scenario: Counter/like absents

- **WHEN** un item distant ne fournit pas de vues/likes
- **THEN** le mapping retourne un objet valide du contrat `list` sans `counter` ni `like` (ou avec null), sans bloquer le rendu

#### Scenario: Mapping tolérant aux champs manquants

- **WHEN** un item distant n'a pas d'image ou de thèmes
- **THEN** le mapping retourne un objet valide du contrat `list` avec `image` et `labels` omis ou nuls, sans bloquer le rendu

### Requirement: Dégradation gracieuse en cas d'erreur API externe

Si l'appel à l'endpoint articles échoue ou retourne un format inexploitable, la card SHALL retourner une collection vide (`items: []`, `total: 0`) plutôt que de propager une erreur bloquante.

#### Scenario: Timeout ou erreur HTTP de l'API distante

- **WHEN** la card subit une exception lors de l'appel externe
- **THEN** la réponse de collection est vide et le builder reste fonctionnel
