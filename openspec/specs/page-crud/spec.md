# page-crud Specification

## Purpose
TBD - created by archiving change add-page-crud. Update Purpose after archive.
## Requirements
### Requirement: Entité Page (titre, slug, thème, description, content)

Le système SHALL fournir une entité `Page` avec : `title` (string, obligatoire), `slug` (string, dérivé du titre en minuscule, unique), une relation ManyToOne vers `Theme` (choix du thème pour charger le fichier CSS correspondant), `description` (string, pour le SEO), `content` (texte long). Le slug SHALL être généré à partir du titre (normalisation minuscule / Slugger) et SHALL être unique.

#### Scenario: Création d'une Page avec titre et thème

- **WHEN** une Page est créée avec un titre et un thème choisi
- **THEN** le slug est dérivé du titre en minuscule et enregistré ; la relation vers le Theme est persistée ; description et content peuvent être vides

#### Scenario: Unicité du slug

- **WHEN** une Page est créée ou mise à jour avec un slug déjà utilisé par une autre page
- **THEN** la validation échoue (contrainte unique ou message d’erreur) ; l’utilisateur peut corriger le titre ou le slug

### Requirement: CRUD Page (liste, création, édition, suppression)

Le système SHALL fournir un CRUD pour les pages, sur le même modèle que le CRUD Thème : liste des pages (`/page`), création (`/page/new`), édition (`/page/edit/{id}`), suppression (POST avec token CSRF). Les routes SHALL utiliser le préfixe `app_page_*`. La liste SHALL afficher au minimum titre, slug et thème associé, avec liens vers édition et action de suppression.

#### Scenario: Liste des pages

- **WHEN** l’utilisateur accède à la route de liste des pages
- **THEN** les pages sont affichées (titre, slug, thème) avec actions « Modifier » et « Supprimer »

#### Scenario: Création puis redirection vers l’édition

- **WHEN** l’utilisateur crée une nouvelle page via le formulaire et soumet des données valides
- **THEN** la page est persistée et l’utilisateur est redirigé vers la page d’édition de la page créée

#### Scenario: Suppression avec confirmation

- **WHEN** l’utilisateur confirme la suppression d’une page (POST avec token CSRF)
- **THEN** la page est supprimée et l’utilisateur est redirigé vers la liste des pages

### Requirement: Chargement du CSS du thème pour une page

Lors de l’affichage ou de l’édition d’une page, le système SHALL charger le fichier CSS du thème associé à la page (via `Theme.generatedCssPath`), par exemple en incluant un lien vers la route existante `app_theme_css` pour le thème de la page, afin que le rendu utilise les styles de ce thème.

#### Scenario: Édition de page avec CSS du thème

- **WHEN** l’utilisateur ouvre la page d’édition d’une page ayant un thème avec un fichier CSS généré
- **THEN** la feuille de style du thème est chargée (lien vers `app_theme_css` avec l’id du thème) et le formulaire est affiché avec les styles du thème

### Requirement: Formulaire Page en React avec shadcn/ui

Le formulaire de création et d'édition de page SHALL être implémenté en React avec des composants shadcn/ui. Il SHALL comporter les champs : titre, slug (pré-rempli à partir du titre, éditable), choix du thème (liste des thèmes disponibles), description (SEO), content (contenu de la page). Le champ content SHALL utiliser le composant builder de page (page-builder) pour l'édition riche du contenu, et non un simple textarea. La soumission SHALL envoyer les données au backend (POST ou API) pour validation et persistance ; le backend SHALL retourner les erreurs de validation si nécessaire.

#### Scenario: Affichage du formulaire avec champs titre, slug, thème, description, content

- **WHEN** l'utilisateur ouvre la création ou l'édition d'une page
- **THEN** le formulaire React (shadcn/ui) affiche les champs titre, slug, sélecteur de thème, description et content ; le champ content affiche le builder de page (pas un textarea) ; le slug peut être pré-rempli à partir du titre

#### Scenario: Sauvegarde et persistance

- **WHEN** l'utilisateur soumet le formulaire avec des données valides
- **THEN** les données sont envoyées au serveur, la page est créée ou mise à jour, et l'utilisateur est redirigé ou reçoit une confirmation de succès

### Requirement: Lien « Pages » dans la sidebar

Le système SHALL afficher un lien « Pages » dans la sidebar (`templates/base.html.twig`) pointant vers la liste des pages (`/page` ou la route équivalente), de la même manière que les liens « Thèmes » et « Médias », afin que l’utilisateur puisse accéder au CRUD des pages depuis la navigation.

#### Scenario: Accès au CRUD pages depuis le menu

- **WHEN** l’utilisateur clique sur le lien « Pages » dans la sidebar
- **THEN** la liste des pages s’affiche

#### Scenario: État actif du lien menu sur la liste des pages

- **WHEN** l’utilisateur est sur une route du CRUD pages (liste, new, edit)
- **THEN** le lien « Pages » dans la sidebar est marqué actif (même logique que pour Thèmes/Médias)

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

