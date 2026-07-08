## 1. ApiCard backend témoignages home

- [x] 1.1 Créer `CharismaTemoignageHomeApiList` dans `src/PageBuilder/ApiCard/` (`extends AbstractApiCardList`, `implements ApiCardBehaviorInterface`).
- [x] 1.2 Configurer l'identifiant `charisma_temoignage_home`, le libellé « Témoignages Home » et `getCollectionMode(): fixed`.
- [x] 1.3 Enregistrer la classe dans `config/services.yaml` avec le tag `app.builder_api_card`.

## 2. fetchCollection et fetchItem

- [x] 2.1 Implémenter `fetchCollection` avec appel HTTP GET sur `/api/charisma/temoignages/home`, extraction de `member` / `totalItems`, filtre `titre` si `search` fourni.
- [x] 2.2 Implémenter `fetchItem` via GET `/api/charisma/temoignages/{id}` (réutiliser le pattern de `CharismaTemoignageApiCard`).
- [x] 2.3 Gérer les erreurs distantes avec fallback `items: []`, `total: 0`.

## 3. Mapping list riche pour NodeListApi

- [x] 3.1 Implémenter `mapItem` : `id`, `title` ← `titre`, `description` ← `resume`, `image` ← `thumbnails.normal`, `link` ← `url`, `labels` ← `theme.nom`, `raw`.
- [x] 3.2 Vérifier le mapping sur un item sans vignette ni thème (champs optionnels absents).

## 4. Documentation et vérification

- [x] 4.1 Ajouter `CharismaTemoignageHomeApiList` dans la section exemples `list` de `docs/ajout-api-card.md`.
- [x] 4.2 Ajouter/mettre à jour les tests unitaires (cas nominal, recherche, erreur API, mapping partiel).
- [x] 4.3 Vérifier que la card apparaît dans `GET /api/page-builder/cards` et est sélectionnable dans NodeListApi.
