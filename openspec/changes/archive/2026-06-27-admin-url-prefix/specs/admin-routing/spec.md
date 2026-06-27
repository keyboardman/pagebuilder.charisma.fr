## ADDED Requirements

### Requirement: Préfixe /admin pour le back-office

Le système SHALL exposer toutes les routes d'administration (dashboard, CRUD pages, thèmes, polices, formulaires builder, gestion des comptes) sous le préfixe URL `/admin`. Les contrôleurs back-office SHALL utiliser `#[Route('/admin/...')]` (ou un préfixe de classe équivalent) de sorte qu'aucune route d'édition ou de gestion ne reste à la racine (`/page`, `/theme`, `/font`, `/builder-form`, `/`).

#### Scenario: Accès au dashboard admin

- **WHEN** un utilisateur authentifié accède à `/admin`
- **THEN** le dashboard s'affiche
- **AND** la route correspond au nom `app_dashboard_index` (ou équivalent conservé)

#### Scenario: Redirection de la racine

- **WHEN** un utilisateur authentifié accède à `/`
- **THEN** il est redirigé vers `/admin`

#### Scenario: Accès non authentifié au back-office

- **WHEN** un visiteur non authentifié tente d'accéder à une URL sous `/admin`
- **THEN** il est redirigé vers `/login`

### Requirement: Routes publiques explicites hors /admin

Le système SHALL conserver les routes publiques suivantes en dehors du préfixe `/admin` : `/login`, `/page/render/*` (rendu public de pages), `/api/*` (API Platform et endpoints builder), `/filemanager` (médiathèque), et les routes de service d'assets publics (`/assets/theme/{id}/css`, `/assets/font/file/{path}`). Aucune autre route SHALL être accessible sans authentification sauf celles listées explicitement dans `access_control`.

#### Scenario: Rendu public de page accessible sans auth

- **WHEN** un visiteur non authentifié accède à `/page/render/{slug}`
- **THEN** la page est rendue avec le statut 200

#### Scenario: API publique accessible sans auth

- **WHEN** un client externe appelle `GET /api/page-builder/forms/{slug}/submit`
- **THEN** la requête n'est pas bloquée par l'authentification Symfony (selon les règles existantes de l'API)

### Requirement: Règles de sécurité simplifiées

La configuration `access_control` SHALL appliquer `IS_AUTHENTICATED_FULLY` à `^/admin` et déclarer les exceptions publiques de manière explicite et limitée. Les règles larges actuelles (`^/font`, `^/theme/*/css`) SHALL être remplacées par des chemins d'assets publics dédiés.

#### Scenario: Route admin protégée

- **WHEN** un visiteur non authentifié tente d'accéder à `/admin/theme`
- **THEN** Symfony redirige vers `/login`

#### Scenario: Asset CSS de thème public

- **WHEN** un visiteur non authentifié accède à `/assets/theme/{id}/css`
- **THEN** le fichier CSS du thème est servi avec le statut 200
