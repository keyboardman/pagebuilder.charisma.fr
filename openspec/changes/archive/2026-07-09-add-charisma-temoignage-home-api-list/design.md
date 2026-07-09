## Context

Le backend du page builder expose des ApiCards via des classes `ApiCard*` taguées `app.builder_api_card`. **NodeListApi** consomme les sources de type **`list`** (`AbstractApiCardList`) via `fetchCollection` et affiche image, titre, description, compteur et labels selon le mapping.

`CharismaTemoignageApiCard` (type `article`) consomme déjà `/api/charisma/temoignages` avec un mapping riche (`titre`, `resume`, `thumbnails`, `theme`, `url`). L'endpoint home `/api/charisma/temoignages/home` retourne une collection éditoriale fixe (10 items) au format API Platform (`member`, `totalItems`), avec un filtre optionnel `titre` via IriTemplate.

## Goals / Non-Goals

**Goals:**

- Ajouter `CharismaTemoignageHomeApiList` (type `list`, mode `fixed`) consommant `/api/charisma/temoignages/home`.
- Réutiliser le mapping de `CharismaTemoignageApiCard` adapté au contrat `list` riche pour NodeListApi.
- Exposer la card dans le registre builder avec l'identifiant `charisma_temoignage_home`.
- Documenter la source dans `docs/ajout-api-card.md`.

**Non-Goals:**

- Modifier NodeListApi, le contrat global `list` ou les endpoints builder API.
- Remplacer `CharismaTemoignageApiCard` (article, collection paginée complète).
- Ajouter pagination interactive ou recherche dans NodeListApi pour cette source (collection fixe home).
- Implémenter `CharismaArticleEnactionHomeApiList` / `CharismaArticleExpressionHomeApiList` (référencées dans la doc mais hors scope).

## Decisions

- **Classe dédiée `CharismaTemoignageHomeApiList` plutôt que paramétrage de `CharismaTemoignageApiCard`**  
  Rationale : endpoint, identifiant, libellé et type (`list` vs `article`) distincts ; isolation sans régression sur la card article existante.

- **Étendre `AbstractApiCardList` avec `ApiCardBehaviorInterface` et `collectionMode: fixed`**  
  Rationale : alignement sur `FlashnewsThemeApiList` et les cards home Charisma ; la collection home est pré-sélectionnée côté API distante.

- **Mapping riche inspiré de `CharismaTemoignageApiCard::mapItem`**  
  - `id` ← `id`  
  - `title` ← `titre`  
  - `description` ← `resume`  
  - `image` ← `thumbnails.normal` (si présent)  
  - `link` ← `url`  
  - `labels` ← `[theme.nom]` si thème présent  
  - `raw` ← objet distant  
  Rationale : exploite tous les champs utiles à NodeListApi sans champ `counter` (non fourni par l'API home).

- **`fetchCollection` sans pagination distante agressive**  
  Appel GET sur `/api/charisma/temoignages/home` ; transmettre `titre` si `search` fourni (IriTemplate de l'API). Limite via `itemsPerPage` si supporté, sinon retourner tous les `member`. Fallback silencieux `items: []`, `total: 0` en cas d'erreur.

- **`fetchItem` par GET `/api/charisma/temoignages/{id}`**  
  Rationale : cohérent avec `CharismaTemoignageApiCard` pour le détail d'un témoignage si requis par les endpoints builder.

## Risks / Trade-offs

- **[Items sans vignette]** → Certains témoignages home n'ont pas `thumbnails`. Mitigation : `image` reste `null` ; NodeListApi masque l'image si absente.
- **[Indisponibilité API Charisma]** → Mitigation : capture des exceptions, collection vide, édition non bloquée.
- **[Duplication avec CharismaTemoignageApiCard]** → Mitigation : acceptable à court terme ; factorisation possible si d'autres endpoints home similaires apparaissent.

## Migration Plan

- Déploiement additif : nouvelle classe + entrée `services.yaml`.
- Aucune migration de contenu : les pages existantes ne sont pas impactées.
- Rollback : retirer la classe et l'entrée de service.

## Open Questions

- Libellé affiché dans l'éditeur : « Témoignages Home » (proposé) ou variante métier à valider.
