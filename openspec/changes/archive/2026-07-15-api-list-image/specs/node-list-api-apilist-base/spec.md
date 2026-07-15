## MODIFIED Requirements

### Requirement: Séparation ApiCard vs ApiListArticle

Le système SHALL distinguer trois sous-systèmes backend :

- **ApiCard** (`/api/page-builder/cards/*`) : sources pour la **sélection d'un item** dans la modale backend (articles, images, vidéos, etc.) avec pagination, recherche et `total`.
- **ApiListArticle** (`/api/page-builder/lists/*`) : **collections fixes** consommées telles quelles par `NodeListApi` et `NodeNavApi`, sans ouvrir la modale backend.
- **ApiListImage** (`/api/page-builder/lists-image/*`) : **collections fixes d'images** consommées par les nœuds orientés visuel (ex. `NodeSlideshow`), sans ouvrir la modale backend et sans champs riches (`title`, `description`, etc.).

Les implémentations `ApiListArticle` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface` ni `ApiCardBehaviorInterface`.
Les implémentations `ApiListImage` SHALL NOT dépendre de `AbstractApiCardList`, `ApiCardInterface`, `ApiListArticle` ni leurs interfaces associées.

#### Scenario: Sélection article via modale cards
- **WHEN** l'éditeur ouvre la modale de sélection pour un nœud card (article, image, vidéo)
- **THEN** le frontend appelle `/api/page-builder/cards/{apiId}/items` avec `page`, `limit` et éventuellement `search`

#### Scenario: Liste fixe via ApiListArticle
- **WHEN** un nœud `NodeListApi` ou `NodeNavApi` charge sa source
- **THEN** le frontend appelle `/api/page-builder/lists/{apiId}/items` avec `page` et `itemsPerPage`

#### Scenario: Collection image via ApiListImage
- **WHEN** un nœud image (ex. `NodeSlideshow` en mode `api-endpoint`) charge sa source
- **THEN** le frontend appelle `/api/page-builder/lists-image/{apiId}/items` avec `page` et `itemsPerPage`
- **AND** les items retournés ne contiennent que les champs image-only (`id`, `image`, `link?`, `alt?`)
