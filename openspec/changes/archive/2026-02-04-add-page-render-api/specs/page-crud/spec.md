## ADDED Requirements

### Requirement: Champ render sur l'entité Page

Le système SHALL fournir sur l'entité `Page` un champ `render` (texte long, nullable) permettant de stocker le document HTML complet de la page : balises `<head>`, `<body>` et JavaScript inclus ou référencé. Le champ SHALL être persisté en base (type text / LONGTEXT) et SHALL pouvoir être lu et écrit via les accesseurs de l'entité.

#### Scenario: Persistance du rendu HTML complet

- **WHEN** une page possède un contenu `render` renseigné (document HTML complet avec head, body et scripts)
- **THEN** ce contenu est persisté en base et peut être récupéré via `Page.getRender()` ; les pages sans rendu exporté ont `render` null

#### Scenario: Nouvelle page sans rendu

- **WHEN** une page est créée ou n'a jamais reçu d'export de rendu
- **THEN** le champ `render` reste null ; l'entité et le CRUD continuent de fonctionner sans erreur

### Requirement: API de récupération du contenu render

Le système SHALL exposer une API HTTP GET permettant de récupérer le contenu du champ `render` d'une page. La route SHALL accepter l'identifiant de la page (id numérique ou slug). La réponse SHALL avoir le corps égal au contenu brut de `render` et le header `Content-Type: text/html`. Si la page n'existe pas ou si `render` est null ou vide, la réponse SHALL être 404.

#### Scenario: Récupération du rendu par id

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec l'id d'une page ayant un `render` renseigné
- **THEN** la réponse a le statut 200, le corps contient le document HTML stocké et `Content-Type` est `text/html`

#### Scenario: 404 lorsque le rendu est absent

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render pour une page dont `render` est null ou vide
- **THEN** la réponse a le statut 404

#### Scenario: 404 lorsque la page n'existe pas

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec un id ou slug ne correspondant à aucune page
- **THEN** la réponse a le statut 404

### Requirement: API de mise à jour du contenu render

Le système SHALL exposer une API HTTP PATCH ou PUT pour mettre à jour le champ `render` d'une page. La route SHALL accepter l'id numérique de la page. Le corps de la requête SHALL être du JSON contenant `render` (chaîne, document HTML complet) et `_token` (CSRF). En cas de succès la réponse SHALL être 204 ; 403 si le token CSRF est invalide ; 400 si `render` n'est pas une chaîne.

#### Scenario: Mise à jour du rendu avec token valide

- **WHEN** un client envoie une requête PATCH ou PUT avec un JSON `{ "_token": "<csrf>", "render": "<html>...</html>" }` vers l'endpoint de mise à jour render pour une page existante
- **THEN** le champ `render` de la page est mis à jour, la réponse a le statut 204

#### Scenario: Rejet si token CSRF invalide

- **WHEN** un client envoie une requête PATCH ou PUT sans token CSRF valide
- **THEN** la réponse a le statut 403
