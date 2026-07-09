## Context

Le builder expose deux familles d’API backend distinctes :

| Famille | Endpoint | Usage éditeur | Pagination |
|---------|----------|---------------|------------|
| **ApiCard** | `/api/page-builder/cards/{id}/items` | Modale de sélection (article, image, vidéo, item list…) | Oui (`page`, `limit`, `search`, `total`) |
| **ApiList** | `/api/page-builder/lists/{id}/items` | `NodeListApi`, `NodeNavApi` — collection figée telle quelle | Non |

**ApiCard** sert à choisir **un** élément dans le backend (ex. une card article pour un `NodeCardApi`).

**ApiList** sert à brancher **toute** une collection pré-définie sur un nœud, sans ouvrir la modale ni parcourir les pages.

## Goals / Non-Goals

**Goals:**

- Séparer clairement `ApiCard` (sélection backend) et `ApiList` (collection fixe).
- Factoriser les home lists dans `App\PageBuilder\ApiList\ApiList`.
- Exposer un catalogue et un endpoint items dédiés (`/page-builder/lists`).
- Retourner uniquement `items` (pas de `total`, pas de query `page`/`limit`).

**Non-Goals:**

- Modifier le comportement des ApiCards article/image/vidéo.
- Remplacer `StubNavListApiCard` (démo) dans `ApiCard` — il reste pour la modale cards si besoin.

## Decisions

- **`ApiList` autonome** : n’étend pas `AbstractApiCardList`, n’implémente pas `ApiCardBehaviorInterface`.
- **`fetchItems(): array`** : retourne directement la liste mappée (pas de wrapper `['items' => ..., 'total' => ...]`).
- **Registre séparé** : tag Symfony `app.builder_api_list` → `ApiListRegistry`.
- **Frontend** : `NodeListApi` / `NodeNavApi` appellent `/api/page-builder/lists` ; `backendApiAdapter` reste pour les cards classiques.

## Open Questions

- Faut-il migrer `StubNavListApiCard` vers `ApiList` ou le retirer du catalogue lists ?
