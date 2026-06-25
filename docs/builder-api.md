# API Page Builder (API Platform)

L’API du page builder est exposée via **API Platform** sous le préfixe **`/api/page-builder`**. Les routes sous **`/api/*`** sont accessibles **sans authentification** (phase actuelle). Le builder et le rendu public consomment ces endpoints en `fetch` ; la session Symfony peut être envoyée si l’utilisateur est connecté (`credentials: "same-origin"`), mais ce n’est pas requis pour lire les cards.

La documentation interactive OpenAPI est disponible sur **`/api`** (Swagger UI / ReDoc).

## Base URL

**`/api/page-builder`**

Injection dans le builder standalone (`templates/page/builder.html.twig`) :

```twig
{% set builder_api_base = path('_api_/page-builder/cards_get_collection')|replace({'/cards': ''}) %}
apiCardsBaseUrl: builder_api_base,
pageBuilderApiBaseUrl: builder_api_base,
```

## Endpoints — Cards (ApiCard)

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/api/page-builder/cards` | Liste des APIs card (`id`, `label`, `type`, `category`, `collectionMode`) |
| `GET` | `/api/page-builder/cards/{apiId}/items` | Collection paginée (`items`, `total`) |
| `GET` | `/api/page-builder/cards/{apiId}/items/{itemId}` | Détail d’un item mappé |
| `GET` | `/api/page-builder/cards/{apiId}/categories` | Catégories de filtrage (`[{id, label}]`) |

**Query params collection** : `page`, `limit`, `search`, `sort`, `category` (recopié vers le paramètre métier si différent, ex. `themes` pour Flashnews).

**Headers recommandés** : `Accept: application/json`

Guide d’implémentation d’une nouvelle ApiCard : [ajout-api-card.md](ajout-api-card.md).

## Endpoints — Formulaires

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/api/page-builder/forms/catalog` | Catalogue pour NodeForm (`{ items: [{ id, title, action, honeypotField }] }`) |
| `POST` | `/api/page-builder/forms/{slug}/submit` | Soumission publique d’un formulaire (`{ success, message }`) — honeypot + rate limiting |

Voir [builder-form-submissions.md](builder-form-submissions.md) pour l’admin, l’antispam et la soumission publique.

## Endpoints — Polices

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/api/page-builder/fonts` | Liste paginée (`items`, `total`) |
| `GET` | `/api/page-builder/fonts/{id}` | Détail d’une police |
| `GET` | `/api/page-builder/fonts/resolve` | Résolution par `family` (query) |

**Query params liste** : `page`, `limit`, `search`, `type`, `excludeNative`, `excludeIds`.

## Architecture backend

```
src/ApiResource/          # Ressources API Platform (opérations HTTP)
src/State/                # Providers (lecture des données)
src/PageBuilder/Api/      # Logique métier partagée (ApiCard, fonts, forms)
src/Serializer/           # Normalizers (formats JSON compatibles builder)
```

| Domaine | Provider métier | Ressources API Platform |
|---------|-----------------|-------------------------|
| Cards | `ApiCardEndpointProvider` | `BuilderApiCard`, `BuilderApiCardItemsPage`, `BuilderApiCardItem`, `BuilderApiCardCategoriesResponse` |
| Formulaires | `BuilderApiFormEndpointProvider` | `BuilderApiFormsCatalogResponse`, `BuilderApiFormSubmitResponse` |
| Polices | `BuilderApiFontEndpointProvider` | `BuilderApiFontsPage`, `BuilderApiFontItem`, `BuilderApiFontResolveResponse` |

Registre des cartes : services tagués `app.builder_api_card` → `ApiCardRegistry`.

## Frontend

| Fichier | Rôle |
|---------|------|
| `assets/editeur/ManagerApi/backendApiAdapter.ts` | Cards : liste, collection, item, catégories |
| `assets/editeur/ManagerNode/NodeForm/Settings.tsx` | Catalogue formulaires |
| `assets/editeur/ManagerFont/backendFontAdapter.ts` | Liste et résolution des polices |
| `assets/editeur/PageBuilderEmbed.tsx` | Injection `apiCardsBaseUrl` / `pageBuilderApiBaseUrl` |
