## 1. ApiCard backend articles home Flashnews

- [x] 1.1 Créer `FlashnewsArticleHomeApiList` dans `src/PageBuilder/ApiCard/` (`extends AbstractApiCardList`, `implements ApiCardBehaviorInterface`).
- [x] 1.2 Configurer l'identifiant `flashnews_article_home`, le libellé « Articles (home) » et `getCollectionMode(): fixed`.
- [x] 1.3 Enregistrer la classe dans `config/services.yaml` avec le tag `app.builder_api_card`.

## 2. fetchCollection et fetchItem

- [x] 2.1 Implémenter `fetchCollection` avec appel HTTP GET sur `/api/articles`, tri `order[publication]=desc`, extraction de `member` / `totalItems`, filtres `titre` (search) et `themes` (category).
- [x] 2.2 Implémenter `fetchItem` via GET `/api/articles/{id}` (réutiliser le pattern de `FlashnewsApiCard`).
- [x] 2.3 Gérer les erreurs distantes avec fallback `items: []`, `total: 0`.

## 3. Mapping list riche pour NodeListApi

- [x] 3.1 Implémenter `mapItem` : `id`, `title` ← `titre`, `description` ← `viewResume`, `image` ← URL absolue depuis `image`, `link` ← `link` ou `viewUrl`, `labels` ← `themes` ou `tags`, `raw`.
- [x] 3.2 Vérifier le mapping sur un item sans image ni thèmes (champs optionnels absents).

## 4. Documentation et vérification

- [x] 4.1 Ajouter `FlashnewsArticleHomeApiList` dans la section exemples `list` de `docs/ajout-api-card.md`.
- [x] 4.2 Ajouter/mettre à jour les tests unitaires (cas nominal, recherche, filtre thème, erreur API, mapping partiel).
- [x] 4.3 Vérifier que la card apparaît dans `GET /api/page-builder/cards` et est sélectionnable dans NodeListApi.
