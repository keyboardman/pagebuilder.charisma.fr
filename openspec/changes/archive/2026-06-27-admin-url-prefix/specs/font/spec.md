## ADDED Requirements

### Requirement: Administration des polices sous /admin/font

Le système SHALL exposer le CRUD des polices (liste, création, édition, suppression) sous le préfixe `/admin/font` : liste (`/admin/font`), création (`/admin/font/new`), édition (`/admin/font/{id}/edit`), suppression (`POST /admin/font/{id}`). Les routes SHALL utiliser le préfixe de nom `app_font_*` pour les actions d'administration. L'accès SHALL requérir une authentification via la règle `^/admin`.

#### Scenario: Liste des polices admin

- **WHEN** un utilisateur authentifié accède à `/admin/font`
- **THEN** la liste des polices du catalogue s'affiche

#### Scenario: Accès refusé sans authentification

- **WHEN** un visiteur non authentifié tente d'accéder à `/admin/font`
- **THEN** il est redirigé vers `/login`

### Requirement: Service public des fichiers de polices custom

Le système SHALL exposer une route publique `GET /assets/font/file/{path}` (nom de route `app_font_file` ou équivalent) pour servir les fichiers de polices custom stockés via Flysystem. Cette route SHALL rester accessible sans authentification afin que les pages publiques et le builder puissent charger les `@font-face`.

#### Scenario: Téléchargement d'un fichier de police sans auth

- **WHEN** un client accède à `/assets/font/file/{path}` pour un fichier existant
- **THEN** le fichier est servi avec le type MIME approprié et le statut 200

#### Scenario: Fichier de police introuvable

- **WHEN** un client accède à `/assets/font/file/{path}` pour un chemin inexistant
- **THEN** la réponse est 404

## MODIFIED Requirements

### Requirement: API builder pour lister et résoudre les polices

Le système SHALL exposer des endpoints HTTP dédiés au builder pour consommer le catalogue `Font` sans charger toutes les entités au démarrage. L'endpoint de liste SHALL supporter la pagination (`page`, `limit`), la recherche textuelle (`search` sur le nom) et un filtre optionnel par type (`native`, `google`, `custom`). L'endpoint de détail SHALL retourner pour une police donnée un payload compatible avec `registerFont` : `id`, `name`, `fontFamily` (nom + fallback), `href` (URL stylesheet Google, URL fichier custom via `/assets/font/file/{path}`, ou identifiant builtin pour native), et `type`. Un endpoint de résolution SHALL permettre de retrouver une police à partir d'une valeur CSS `fontFamily` (nom primaire de la famille).

#### Scenario: Liste paginée avec recherche

- **WHEN** le builder appelle `GET /api/builder/fonts?search=roboto&page=1&limit=20`
- **THEN** la réponse contient au most 20 polices dont le nom correspond à la recherche, avec `total` pour la pagination ; chaque item inclut `id`, `name`, `type` et les champs nécessaires au chargement

#### Scenario: Détail d'une police custom

- **WHEN** le builder appelle `GET /api/builder/fonts/{id}` pour une Font custom ayant au moins une variante
- **THEN** la réponse inclut `href` pointant vers le fichier servi via `/assets/font/file/{path}` et `fontFamily` au format `"{name}, {fallback}"`

#### Scenario: Résolution par fontFamily

- **WHEN** le scanner de nodes du builder appelle l'endpoint de résolution avec `fontFamily=Ma Police, sans-serif`
- **THEN** si une Font avec le nom `Ma Police` existe, la réponse retourne son `id` et le payload de chargement ; sinon une réponse vide ou 404 indique qu'aucune police catalogue n'est associée
