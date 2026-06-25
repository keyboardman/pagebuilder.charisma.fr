## Context

Le rendu public utilise l’entrypoint Encore `pagePreview` qui lit `data-api-cards-base-url` et appelle `registerBackendApis` (`assets/pagePreview.jsx` → `assets/editeur/ManagerApi/backendApiAdapter.ts`). Les requêtes ciblent `${base}/cards`, `${base}/cards/{apiId}/items`, etc.

Le builder standalone injecte déjà `baseUrl` absolu (`app.request.schemeAndHttpHost`) pour l’export HTML et absolutise `href`/`src` via `makeLinksAbsolute`. Le rendu live (`render_view`) n’applique pas la même rigueur sur l’URL API.

`PageController::renderPageContent` post-traite déjà le HTML :

```php
$html = preg_replace('#(href|src)="/(?!\/)#', '$1="' . $baseUrl . '/', $html) ?? $html;
```

## Goals / Non-Goals

- Goals : garantir que le rendu public et la preview admin résolvent les appels API vers l’hôte du page builder, y compris en intégration cross-site.
- Non-Goals : étendre CORS aux routes `/api/*` (hors scope de ce change ; le rendu en iframe reste same-origin).

## Decisions

- **Décision** : utiliser `absolute_url()` côté Twig pour `data-api-cards-base-url`, en factorisant la construction de la base (`path('_api_/page-builder/cards_get_collection')|replace({'/cards': ''})`) dans une variable Twig réutilisable entre `render_view`, `preview` et `builder`.
- **Décision** : compléter la post-traitement PHP pour couvrir `data-api-cards-base-url="/…"` afin de couvrir les pages déjà en cache ou des chemins alternatifs.
- **Alternative écartée** : résolution côté JS uniquement (`new URL(path, document.baseURI)`) — insuffisant si le document est servi sous un autre domaine sans `<base>` correct.

## Risks / Trade-offs

- **API publique** : les routes `/api/*` sont sans authentification pour l’instant ; l’URL absolue suffit pour le rendu cross-site en iframe.
- **Multi-environnement** : l’URL absolue reflète l’hôte de la requête (`Request`), ce qui est le comportement attendu derrière un reverse proxy si les headers `X-Forwarded-*` sont configurés.

## Open Questions

- Faut-il restreindre l’accès public aux seuls verbes/ressources nécessaires au rendu (GET cards/items) à terme ?
