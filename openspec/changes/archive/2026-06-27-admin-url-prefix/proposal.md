## Why

Les routes d'administration (pages, thèmes, polices, formulaires, dashboard) sont exposées à la racine (`/page`, `/theme`, `/font`, `/builder-form`, `/`) alors que seules quelques exceptions sont déclarées publiques dans `security.yaml`. Cette organisation mélange back-office et endpoints publics, rend la configuration de sécurité fragile (ex. `^/theme/*/css` en `PUBLIC_ACCESS` alors que la gestion des thèmes exige une authentification) et complique la compréhension de la surface d'attaque. Un préfixe `/admin` unifié clarifie la frontière entre interface d'administration et routes publiques (rendu de pages, API, assets).

## What Changes

- **BREAKING** : Déplacer toutes les routes back-office sous le préfixe `/admin` (dashboard, CRUD pages, thèmes, polices, formulaires builder, gestion des comptes déjà partiellement sous `/admin`).
- Regrouper la règle d'accès Symfony : tout ce qui est sous `^/admin` requiert `IS_AUTHENTICATED_FULLY`, avec des exceptions publiques explicites et limitées en dehors de ce préfixe.
- Séparer les **assets publics** nécessaires au rendu des pages (CSS de thème, fichiers de polices) des routes d'administration : les conserver accessibles sans authentification via des chemins dédiés (`/assets/theme/{id}/css`, `/assets/font/file/{path}`) distincts du back-office `/admin/theme/*`.
- Mettre à jour les templates Twig, redirections Symfony, liens sidebar et références hardcodées dans les tests pour utiliser les nouvelles routes.
- Rediriger `/` vers `/admin` (ou `/login` si non authentifié) pour les utilisateurs du back-office.
- Conserver publiques sans préfixe `/admin` : `/login`, `/page/render/*`, `/api/*`, `/filemanager` (médiathèque), routes de service des assets publics.

## Capabilities

### New Capabilities

- `admin-routing` : convention de routage unifiée pour le back-office sous `/admin` et séparation explicite des routes publiques vs administration.

### Modified Capabilities

- `page-crud` : chemins CRUD pages (`/page` → `/admin/page`) ; rendu public inchangé sous `/page/render/*`.
- `theme-generator` : chemins d'administration thèmes (`/theme` → `/admin/theme`) ; route de service CSS déplacée vers `/assets/theme/{id}/css`.
- `font` : chemins CRUD polices sous `/admin/font` ; route de service de fichiers déplacée vers `/assets/font/file/{path}`.
- `media-filemanager` : lien sidebar et accès médiathèque cohérents avec le contexte `/admin` (URL `/filemanager` inchangée, protégée par auth globale hors exceptions).

## Impact

- **Contrôleurs** : `DashboardController`, `PageController`, `ThemeController`, `FontController`, `BuilderFormConfigController`, `AdminController` — regroupement sous `/admin`.
- **Sécurité** : `config/packages/security.yaml` — simplification des règles `access_control`.
- **Templates** : `base.html.twig`, `admin.html.twig`, templates page/theme/font/builder_form_config — liens `path()`.
- **Tests** : PHPUnit (URLs hardcodées dans `ThemeCssGeneratorTest`, etc.), éventuels tests fonctionnels de routes.
- **Frontend builder** : URLs injectées dans `builder.html.twig` (`saveUrl`, `backUrl`, `themeCssUrl`).
- **API publique** : `/api/*` et `/page/render/*` non impactées.
