## Context

Le backend du page builder expose des ApiCards via des classes `ApiCard*` taguées `app.builder_api_card`. **NodeListApi** consomme les sources de type **`list`** (`AbstractApiCardList`) via `fetchCollection` et affiche image, titre, description, compteur et labels selon le mapping.

`FlashnewsApiCard` (type `article`) consomme déjà `/api/articles` avec pagination, recherche (`titre`), tri (`order[...]`) et filtre thème (`themes`). L'endpoint home cible retourne une collection API Platform (`member`, `totalItems`) triée par publication décroissante, avec des champs plats (`titre`, `viewResume`, `image`, `themes`, `tags`, `link`, `viewUrl`).

`FlashnewsThemeApiList` fournit déjà un exemple de card `list` Flashnews en mode `fixed`.

## Goals / Non-Goals

**Goals:**

- Ajouter `FlashnewsArticleHomeApiList` (type `list`, mode `fixed`) consommant `/api/articles` avec `order[publication]=desc` par défaut.
- Réutiliser le mapping de `FlashnewsApiCard` adapté au contrat `list` riche pour NodeListApi.
- Exposer la card dans le registre builder avec l'identifiant `flashnews_article_home`.
- Documenter la source dans `docs/ajout-api-card.md`.

**Non-Goals:**

- Modifier NodeListApi, le contrat global `list` ou les endpoints builder API.
- Remplacer `FlashnewsApiCard` (article, collection paginée complète avec filtres avancés).
- Ajouter de nouveaux filtres ou tri interactifs spécifiques à NodeListApi pour cette source.
- Modifier `FlashnewsThemeApiList`.

## Decisions

- **Classe dédiée `FlashnewsArticleHomeApiList` plutôt que paramétrage de `FlashnewsApiCard`**  
  Rationale : endpoint, identifiant, libellé et type (`list` vs `article`) distincts ; isolation sans régression sur la card article existante.

- **Étendre `AbstractApiCardList` avec `ApiCardBehaviorInterface` et `collectionMode: fixed`**  
  Rationale : alignement sur `FlashnewsThemeApiList` et `CharismaTemoignageHomeApiList` ; la sélection « home » est portée par le tri `order[publication]=desc` côté API distante.

- **Mapping riche inspiré de `FlashnewsApiCard::mapItem`**  
  - `id` ← `id`  
  - `title` ← `titre`  
  - `description` ← `viewResume` (texte brut, sans HTML)  
  - `image` ← URL absolue `BASE_URL + image`  
  - `link` ← `link` (URL absolue fournie par l'API) ou `BASE_URL + viewUrl` en repli  
  - `labels` ← `themes` (tableau de chaînes) ou `tags` en repli  
  - `raw` ← objet distant  
  Rationale : exploite tous les champs utiles à NodeListApi ; `viewResume` est plus adapté que `resume` (HTML) pour la description.

- **`fetchCollection` avec tri publication desc par défaut**  
  Appel GET sur `/api/articles` avec `page`, `itemsPerPage`, `order[publication]=desc`. Transmettre `titre` si `search` fourni, `themes` si `category` fourni. Fallback silencieux `items: []`, `total: 0` en cas d'erreur.

- **`fetchItem` par GET `/api/articles/{id}`**  
  Rationale : cohérent avec `FlashnewsApiCard` pour le détail d'un article si requis par les endpoints builder.

## Risks / Trade-offs

- **[Images en chemin relatif]** → L'API retourne `/upload/flashnews/...`. Mitigation : préfixer avec `BASE_URL` comme dans `FlashnewsApiCard`.
- **[Indisponibilité API Flashnews]** → Mitigation : capture des exceptions, collection vide, édition non bloquée.
- **[Duplication avec FlashnewsApiCard]** → Mitigation : acceptable à court terme ; factorisation possible si d'autres variantes home apparaissent.

## Migration Plan

- Déploiement additif : nouvelle classe + entrée `services.yaml`.
- Aucune migration de contenu : les pages existantes ne sont pas impactées.
- Rollback : retirer la classe et l'entrée de service.

## Open Questions

- Libellé affiché dans l'éditeur : « Articles (home) » (proposé) ou variante métier à valider.
- Limite par défaut : 10 items (comme l'URL fournie) ou 50 (comme `FlashnewsApiCard`) — proposé : 10 pour coller au besoin home.
