## Why

Le builder dispose déjà de **NodeListApi** et d'une ApiCard article `FlashnewsApiCard` (collection paginée `/api/articles`), mais pas d'une source **list** dédiée aux articles récents pour la page d'accueil Flashnews. Les éditeurs ont besoin d'afficher les derniers articles publiés (tri par `publication` décroissant) sans reconfigurer manuellement une collection article complète avec filtres et tri.

## What Changes

- Ajouter une nouvelle ApiCard backend **`FlashnewsArticleHomeApiList`** de type **`list`** (`AbstractApiCardList`), consommable par **NodeListApi**.
- Consommer l'endpoint `https://www.flashnews.fr/api/articles` avec les paramètres par défaut `order[publication]=desc`, pagination (`page`, `itemsPerPage`) et filtres optionnels (`titre`, `themes`) selon l'IriTemplate de l'API.
- Mapper chaque article vers le contrat `list` riche du builder : `id`, `title`, `link`, `description` (depuis `viewResume`), `image` (URL absolue depuis `image`), `labels` (depuis `themes` ou `tags`), `raw`.
- Enregistrer la card dans `config/services.yaml` (tag `app.builder_api_card`).
- Documenter la nouvelle source dans `docs/ajout-api-card.md`.

## Capabilities

### New Capabilities

- `flashnews-article-home-api-list` : fournir une ApiCard `list` en collection fixe pour les articles home Flashnews (derniers articles publiés), exploitable par NodeListApi.

### Modified Capabilities

- Aucun (le contrat `list` et NodeListApi existent déjà ; seule une implémentation concrète est ajoutée).

## Impact

- Code backend : `src/PageBuilder/ApiCard/FlashnewsArticleHomeApiList.php` (nouvelle classe) et `config/services.yaml`.
- API externe consommée : `https://www.flashnews.fr/api/articles?page=1&itemsPerPage=10&order[publication]=desc`.
- Documentation : `docs/ajout-api-card.md`.
- Impacts frontend indirects : la nouvelle source apparaît dans le sélecteur d'API de NodeListApi via les endpoints builder existants.
