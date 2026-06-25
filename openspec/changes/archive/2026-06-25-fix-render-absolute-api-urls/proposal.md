# Change: URLs API absolues sur le rendu public

## Why

La page de rendu public (`/page/render/{slug}`) et la preview admin chargent les nœuds dynamiques (CardApi, NavApi, Slideshow en mode API, etc.) via `pagePreview` et `registerBackendApis`. L’URL de base injectée dans `data-api-cards-base-url` est aujourd’hui **relative** (`/api/page-builder`), générée avec `path()` dans les templates Twig.

Lorsque la page est consommée depuis un autre site (iframe cross-origin, reverse proxy, intégration sur un domaine tiers), les appels `fetch` vers `/api/page-builder/cards` et les endpoints associés sont résolus contre l’**origine du site hôte** et échouent. Le contrôleur applique déjà une post-traitement pour absolutiser `href` et `src`, mais pas l’attribut `data-api-cards-base-url`.

## What Changes

- Injecter une **URL absolue** pour la base API page-builder (`https://…/api/page-builder`) dans `render_view.html.twig` et `preview.html.twig` (via `absolute_url()` ou `schemeAndHttpHost` + `path()`).
- Aligner l’injection côté builder (`builder.html.twig`) sur la même convention pour cohérence.
- Étendre la post-traitement serveur du rendu public (`PageController::renderPageContent`) pour absolutiser les attributs `data-*` contenant des chemins relatifs (au minimum `data-api-cards-base-url`), sur le même modèle que `href`/`src`.
- Ajouter un test fonctionnel vérifiant que la réponse HTML du rendu public contient une URL API absolue.

## Impact

- Affected specs: `page-builder`
- Affected code: `templates/page/render_view.html.twig`, `templates/page/preview.html.twig`, `templates/page/builder.html.twig`, `src/Controller/PageController.php`, tests fonctionnels render
