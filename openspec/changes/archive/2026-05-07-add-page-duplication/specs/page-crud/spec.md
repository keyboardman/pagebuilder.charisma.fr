## MODIFIED Requirements
### Requirement: CRUD Page (liste, création, édition, suppression)

Le système SHALL fournir un CRUD pour les pages, sur le même modèle que le CRUD Thème : liste des pages (`/page`), création (`/page/new`), édition (`/page/edit/{id}`), suppression (POST avec token CSRF) et duplication (`/page/duplicate/{id}` ou route équivalente). Les routes SHALL utiliser le préfixe `app_page_*`. La liste SHALL afficher au minimum titre, slug et thème associé, avec liens vers édition, action de duplication et action de suppression.

#### Scenario: Liste des pages

- **WHEN** l’utilisateur accède à la route de liste des pages
- **THEN** les pages sont affichées (titre, slug, thème) avec actions « Modifier », « Dupliquer » et « Supprimer »

#### Scenario: Création puis redirection vers l’édition

- **WHEN** l’utilisateur crée une nouvelle page via le formulaire et soumet des données valides
- **THEN** la page est persistée et l’utilisateur est redirigé vers la page d’édition de la page créée

#### Scenario: Duplication depuis la liste

- **WHEN** l’utilisateur déclenche l’action « Dupliquer » sur une page existante
- **THEN** une nouvelle page est créée à partir des données de la page source, avec une identité propre (id et slug uniques), puis l’utilisateur est redirigé vers l’édition de la page dupliquée

#### Scenario: Suppression avec confirmation

- **WHEN** l’utilisateur confirme la suppression d’une page (POST avec token CSRF)
- **THEN** la page est supprimée et l’utilisateur est redirigé vers la liste des pages
