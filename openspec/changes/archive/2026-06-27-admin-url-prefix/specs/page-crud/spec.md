## MODIFIED Requirements

### Requirement: CRUD Page (liste, création, édition, suppression)

Le système SHALL fournir un CRUD pour les pages, sur le même modèle que le CRUD Thème : liste des pages (`/admin/page`), création (`/admin/page/new`), édition (`/admin/page/edit/{id}`), suppression (POST avec token CSRF) et duplication (`/admin/page/duplicate/{id}` ou route équivalente). Les routes SHALL utiliser le préfixe de nom `app_page_*`. La liste SHALL afficher au minimum titre, slug et thème associé, avec liens vers édition, action de duplication et action de suppression. Les routes de rendu public (`/page/render/*`) SHALL rester hors du préfixe `/admin`.

#### Scenario: Liste des pages

- **WHEN** l'utilisateur accède à la route de liste des pages
- **THEN** les pages sont affichées (titre, slug, thème) avec actions « Modifier », « Dupliquer » et « Supprimer »

#### Scenario: Création puis redirection vers l'édition

- **WHEN** l'utilisateur crée une nouvelle page via le formulaire et soumet des données valides
- **THEN** la page est persistée et l'utilisateur est redirigé vers la page d'édition de la page créée

#### Scenario: Duplication depuis la liste

- **WHEN** l'utilisateur déclenche l'action « Dupliquer » sur une page existante
- **THEN** une nouvelle page est créée à partir des données de la page source, avec une identité propre (id et slug uniques), puis l'utilisateur est redirigé vers l'édition de la page dupliquée

#### Scenario: Suppression avec confirmation

- **WHEN** l'utilisateur confirme la suppression d'une page (POST avec token CSRF)
- **THEN** la page est supprimée et l'utilisateur est redirigé vers la liste des pages

### Requirement: Lien « Pages » dans la sidebar

Le système SHALL afficher un lien « Pages » dans la sidebar (`templates/base.html.twig`) pointant vers la liste des pages (`/admin/page` ou la route équivalente), de la même manière que les liens « Thèmes » et « Médias », afin que l'utilisateur puisse accéder au CRUD des pages depuis la navigation.

#### Scenario: Accès au CRUD pages depuis le menu

- **WHEN** l'utilisateur clique sur le lien « Pages » dans la sidebar
- **THEN** la liste des pages s'affiche

#### Scenario: État actif du lien menu sur la liste des pages

- **WHEN** l'utilisateur est sur une route du CRUD pages (liste, new, edit)
- **THEN** le lien « Pages » dans la sidebar est marqué actif (même logique que pour Thèmes/Médias)

### Requirement: Chargement du CSS du thème pour une page

Lors de l'affichage ou de l'édition d'une page, le système SHALL charger le fichier CSS du thème associé à la page via la route publique d'assets `app_theme_css` (URL `/assets/theme/{id}/css`), afin que le rendu utilise les styles de ce thème en back-office comme en rendu public.

#### Scenario: Édition de page avec CSS du thème

- **WHEN** l'utilisateur ouvre la page d'édition d'une page ayant un thème avec un fichier CSS généré
- **THEN** la feuille de style du thème est chargée (lien vers `/assets/theme/{id}/css`) et le formulaire est affiché avec les styles du thème
