## MODIFIED Requirements

### Requirement: API de récupération du contenu render

Le système SHALL exposer une API HTTP GET permettant de récupérer le contenu du champ `render` d'une page. La route SHALL accepter l'identifiant de la page (id numérique ou slug). La réponse SHALL avoir le corps égal au document HTML stocké dans `render` dans lequel sont injectés, côté serveur, les assets Tailwind et le bundle builder (mêmes entry points que la page builder, ex. `pageBuilderStandalone` : CSS avant `</head>` et JS avant `</body>`), afin que le rendu soit identique au builder. De plus, le document renvoyé SHALL avoir la balise `<title>` du `<head>` contenant le titre de la page (`Page.title`) et une balise `<meta name="description" content="...">` contenant la description de la page (`Page.description`), le contenu étant échappé pour le HTML. Le header SHALL être `Content-Type: text/html`. Si la page n'existe pas ou si `render` est null ou vide, la réponse SHALL être 404.

#### Scenario: Récupération du rendu par id

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec l'id d'une page ayant un `render` renseigné
- **THEN** la réponse a le statut 200, le corps contient le document HTML avec les assets Tailwind et builder injectés (link/script) et `Content-Type` est `text/html`

#### Scenario: Titre et meta description dans le head

- **WHEN** un client récupère le contenu render d'une page ayant un titre et une description
- **THEN** le document HTML renvoyé contient une balise `<title>` avec le titre de la page et une balise `<meta name="description" content="...">` avec la description de la page (contenu échappé)

#### Scenario: 404 lorsque le rendu est absent

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render pour une page dont `render` est null ou vide
- **THEN** la réponse a le statut 404

#### Scenario: 404 lorsque la page n'existe pas

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec un id ou slug ne correspondant à aucune page
- **THEN** la réponse a le statut 404

## ADDED Requirements

### Requirement: CORS pour l'API de contenu render

Les réponses HTTP des routes GET exposant le contenu render (récupération du champ `render` d'une page) SHALL inclure des en-têtes CORS permettant toute origine et tout port. Le système SHALL accepter les requêtes cross-origin vers ces routes (ex. `app_page_render`, `app_page_render_by_id`) sans restreindre l'origine ni le port de l’appelant.

#### Scenario: Requête cross-origin vers l'URL render

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render depuis une origine différente (autre domaine ou port)
- **THEN** la réponse inclut les en-têtes CORS appropriés (ex. `Access-Control-Allow-Origin: *` ou reflétant l’origine) et le navigateur autorise l’accès à la réponse

#### Scenario: Toute origine et tout port acceptés

- **WHEN** la configuration CORS est appliquée aux routes GET de contenu render
- **THEN** aucune origine ni aucun port n’est exclu ; les requêtes depuis n’importe quelle origine et port sont acceptées pour ces routes
