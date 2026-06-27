## 1. Contrôleurs assets publics

- [x] 1.1 Créer `ThemeAssetController` avec route `GET /assets/theme/{id}/css` (nom `app_theme_css`) — extraire la logique de `ThemeController::css`
- [x] 1.2 Créer `FontAssetController` avec route `GET /assets/font/file/{path}` (nom `app_font_file`) — extraire la logique de `FontController::serveFile`
- [x] 1.3 Supprimer les actions `css` et `serveFile` des contrôleurs admin respectifs

## 2. Préfixe /admin sur les contrôleurs back-office

- [x] 2.1 Mettre à jour `DashboardController` : route index → `/admin`, ajouter redirect `/` → `/admin`
- [x] 2.2 Mettre à jour `PageController` : préfixer les routes admin (`index`, `new`, `edit`, `delete`, `duplicate`, `builder`, `preview`, `api_content`, `api_render`) avec `/admin/page` ; conserver `/page/render/*` public
- [x] 2.3 Mettre à jour `ThemeController` : préfixe `/admin/theme` sur toutes les routes sauf css (déplacée en 1.1)
- [x] 2.4 Mettre à jour `FontController` : préfixe `/admin/font` sur les routes CRUD (index, new, edit, delete)
- [x] 2.5 Mettre à jour `BuilderFormConfigController` : préfixe `/admin/builder-form`
- [x] 2.6 Vérifier que `AdminController` reste cohérent sous `/admin` (comptes)

## 3. Sécurité

- [x] 3.1 Mettre à jour `config/packages/security.yaml` : supprimer `^/font` et `^/theme/*/css` en PUBLIC_ACCESS, ajouter `^/assets/` en PUBLIC_ACCESS, protéger `^/admin` et `^/filemanager`
- [x] 3.2 Vérifier que `/page/render/*` et `/api/*` restent publics

## 4. Références et templates

- [x] 4.1 Vérifier les templates Twig (`base.html.twig`, `admin.html.twig`, builder, preview, render) — les appels `path('app_*')` doivent résoudre vers les nouvelles URLs automatiquement
- [x] 4.2 Mettre à jour les services/DTO qui génèrent des URLs absolues hardcodées (ex. `ThemeCssGenerator` si applicable)
- [x] 4.3 Mettre à jour les payloads API builder (`href` polices custom) si l'URL est construite manuellement

## 5. Tests

- [x] 5.1 Mettre à jour `ThemeCssGeneratorTest` et autres tests avec URLs hardcodées (`/theme/1/css` → `/assets/theme/1/css`)
- [x] 5.2 Ajouter ou adapter des tests fonctionnels vérifiant l'accès public à `/assets/theme/{id}/css` et `/page/render/{slug}`
- [x] 5.3 Ajouter ou adapter des tests vérifiant le refus d'accès non authentifié à `/admin/page`, `/admin/theme`, `/admin/font`
- [x] 5.4 Exécuter `composer test` et corriger les échecs liés aux routes

## 6. Validation manuelle

- [x] 6.1 Tester le parcours complet : login → dashboard `/admin` → CRUD pages/thèmes/polices
- [x] 6.2 Tester le builder et la preview admin (chargement CSS thème via `/assets/theme/{id}/css`)
- [x] 6.3 Tester le rendu public `/page/render/{slug}` sans authentification (CSS + polices chargés)
