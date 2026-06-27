## Context

Le back-office Symfony expose aujourd'hui ses routes à la racine :

| Contrôleur | Préfixe actuel | Exemple |
|---|---|---|
| `DashboardController` | `/` | `/` |
| `PageController` | `/page` | `/page/edit/1`, `/page/render/slug` |
| `ThemeController` | `/theme` | `/theme/edit/1`, `/theme/2/css` |
| `FontController` | `/font` | `/font`, `/font/file/...` |
| `BuilderFormConfigController` | `/builder-form` | `/builder-form` |
| `AdminController` | `/admin` | `/admin/comptes` |

La sécurité repose sur `access_control` avec des exceptions larges (`^/font`, `^/theme/*/css`) pour permettre le rendu public, ce qui expose des chemins d'administration au même namespace que les assets publics.

`AdminController` utilise déjà `/admin` pour la gestion des comptes ; le reste du back-office n'est pas aligné.

## Goals / Non-Goals

**Goals:**

- Unifier toutes les routes d'administration sous `/admin/*`
- Séparer clairement les **assets publics** (CSS thème, fichiers polices) sous `/assets/*`
- Simplifier `security.yaml` : auth par défaut sur `^/admin`, liste blanche explicite ailleurs
- Conserver les noms de routes Symfony (`app_page_*`, `app_theme_*`, etc.) pour limiter les changements dans les templates (usage de `path()`)

**Non-Goals:**

- Changer les URLs de l'API Platform (`/api/*`)
- Déplacer `/filemanager` (bundle externe keyboardman)
- Ajouter des redirections 301 permanentes pour les anciennes URLs (environnement interne ; redirections temporaires optionnelles)
- Modifier le stockage disque (`storage/themes/`, `storage/fonts/`)

## Decisions

### 1. Préfixe `/admin` via attributs de route Symfony

**Décision** : Ajouter `#[Route('/admin/...')]` sur chaque contrôleur back-office plutôt qu'un import global dans `routes.yaml`.

**Alternatives** :
- *Préfixe global `routes.yaml`* : plus DRY mais mélange les routes publiques de `PageController` (render) avec les routes admin du même fichier → rejeté.
- *Sous-domaine admin* : surdimensionné pour ce projet.

**Mapping cible** :

```
/admin                          → DashboardController
/admin/page/*                   → PageController (sans render)
/admin/theme/*                  → ThemeController (sans css)
/admin/font/*                   → FontController (sans file)
/admin/builder-form/*           → BuilderFormConfigController
/admin/comptes/*                → AdminController (inchangé)
/page/render/*                  → PageController (public)
/assets/theme/{id}/css          → nouveau ThemeAssetController
/assets/font/file/{path}          → nouveau FontAssetController (extrait de FontController)
/                               → redirect 302 → /admin
/login                          → SecurityController (inchangé)
```

### 2. Extraction des assets publics dans des contrôleurs dédiés

**Décision** : Créer `ThemeAssetController` et déplacer `serveFile` vers `FontAssetController` (ou méthodes dans un `AssetsController` unique).

**Rationale** : Sépare la surface publique (`/assets/*`) de l'administration (`/admin/*`). Les noms de routes `app_theme_css` et `app_font_file` sont conservés pour compatibilité avec les templates et l'API builder.

**Alternative rejetée** : Garder `/theme/{id}/css` public — continue de mélanger admin et assets dans le même contrôleur thème.

### 3. Configuration security.yaml simplifiée

**Décision** : Remplacer la règle catch-all `^/` par une liste blanche explicite :

```yaml
access_control:
    - { path: ^/login, roles: PUBLIC_ACCESS }
    - { path: ^/page/render, roles: PUBLIC_ACCESS }
    - { path: ^/assets/, roles: PUBLIC_ACCESS }
    - { path: ^/api/, roles: PUBLIC_ACCESS }
    - { path: ^/admin, roles: IS_AUTHENTICATED_FULLY }
    - { path: ^/filemanager, roles: IS_AUTHENTICATED_FULLY }
    - { path: ^/, roles: IS_AUTHENTICATED_FULLY }  # fallback conservateur
```

`/filemanager` reste protégé (auth requise) ; les assets nécessaires au rendu public passent par `/assets/*`.

### 4. Conservation des noms de routes

**Décision** : Ne pas renommer les routes (`app_page_index`, `app_theme_css`, etc.) — seuls les chemins URL changent via les attributs `#[Route]`.

**Rationale** : Les templates Twig et le builder utilisent `path('app_*')` ; seuls les tests avec URLs hardcodées devront être mis à jour.

### 5. PageController : split logique, pas de split fichier

**Décision** : Garder un seul `PageController` avec deux préfixes de méthode :
- Méthodes admin : routes avec chemin `/admin/page/...`
- Méthodes render : routes avec chemin `/page/render/...`

Symfony 8 permet des préfixes différents par action sans préfixe de classe, en utilisant des chemins absolus dans chaque `#[Route]`.

**Alternative** : Deux contrôleurs `AdminPageController` + `PublicPageController` — plus verbeux, pas nécessaire.

## Risks / Trade-offs

- **[URLs bookmarkées]** → Les anciennes URLs (`/page`, `/theme`) ne fonctionneront plus. Mitigation : redirections 302 optionnelles dans un listener ou routes legacy (hors scope initial, documenté).
- **[Tests hardcodés]** → `ThemeCssGeneratorTest` référence `http://localhost/myapp/theme/1/css`. Mitigation : mettre à jour vers `/assets/theme/1/css`.
- **[CORS / cache]** → Changement d'URL CSS peut invalider le cache navigateur. Mitigation : acceptable (cache-busting déjà en place via versioning fichier).
- **[Bundle filemanager]** → `/filemanager` hors `/admin` mais protégé par auth. Mitigation : règle explicite dans security.yaml.

## Migration Plan

1. Créer les contrôleurs assets et déplacer les actions de service de fichiers
2. Mettre à jour les préfixes de route sur les contrôleurs admin
3. Mettre à jour `security.yaml`
4. Vérifier les templates (usage de `path()` → automatique)
5. Mettre à jour les tests PHPUnit avec les nouvelles URLs
6. Ajouter redirect `/` → `/admin` dans `DashboardController` ou route dédiée
7. Tester manuellement : login, CRUD, builder, preview, rendu public `/page/render/{slug}`

**Rollback** : Revert git — pas de migration base de données.

## Open Questions

- Faut-il ajouter des redirections 302 depuis les anciennes URLs admin (`/page` → `/admin/page`) ? Recommandation : oui en phase de transition, optionnel pour v1.
- Le showcase thème (`/admin/theme/showcase`) reste-t-il sous admin ? Oui — c'est une preview interne.
