# charisma-evenement-retrospective-api-card Specification

## Purpose
TBD - created by archiving change charisma-evenement-retrospective-api-card. Update Purpose after archive.
## Requirements
### Requirement: API card retrospective disponible dans le registre builder
Le systeme SHALL exposer une API card backend identifiee `charisma_evenement_retrospective` et libellee pour les evenements retrospective, afin qu'elle soit listable et selectionnable depuis le builder comme source de type `image`.

#### Scenario: Presence de la card dans la liste des APIs
- **WHEN** le builder appelle l'endpoint de listing des API cards
- **THEN** la card `charisma_evenement_retrospective` est presente avec un type `image`

### Requirement: Recuperation de collection retrospective depuis l'API distante
La card retrospective SHALL appeler `https://api.charisma.fr/api/charisma/banniere/evenements/retrospective` pour recuperer la collection, en supportant les parametres `page`, `itemsPerPage` et un filtre de recherche sur le titre lorsqu'un terme est fourni.

#### Scenario: Appel nominal de la collection
- **WHEN** une collection est demandee pour la card retrospective avec des parametres de pagination
- **THEN** le backend interroge l'endpoint retrospective et retourne un payload `items` et `total`

#### Scenario: Recherche par titre
- **WHEN** une collection est demandee avec un parametre `search`
- **THEN** la card transmet ce filtre en requete distante sur le champ titre

### Requirement: Mapping des items retrospective au format image du builder
Chaque item provenant de l'endpoint retrospective SHALL etre mappe vers le contrat image du builder avec les champs `id`, `title`, `image`, `link` et `raw`, en utilisant les champs distants (`id`, `titre`, `source`, `link`) lorsque disponibles.

#### Scenario: Mapping d'un item complet
- **WHEN** un item distant contient `id`, `titre`, `source` et `link`
- **THEN** l'item mappe expose ces valeurs dans `id`, `title`, `image` et `link`, avec `raw` contenant l'objet d'origine

#### Scenario: Mapping tolerant aux champs manquants
- **WHEN** un item distant est partiel ou incomplet
- **THEN** le mapping retourne quand meme un objet valide du contrat image avec des valeurs par defaut non bloquantes

### Requirement: Degradation gracieuse en cas d'erreur API externe
Si l'appel a l'endpoint retrospective echoue ou retourne un format inexploitable, la card SHALL retourner une collection vide (`items: []`, `total: 0`) plutot que de propager une erreur bloquante.

#### Scenario: Timeout ou erreur HTTP de l'API distante
- **WHEN** la card subit une exception lors de l'appel externe
- **THEN** la reponse de collection est vide et le builder reste fonctionnel
