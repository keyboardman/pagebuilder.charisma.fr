## 1. Utilitaire de découpage

- [x] 1.1 Ajouter `paginateItems(items, page, itemsPerPage?)` dans `listApiUtils.ts` avec normalisation (page ≥ 1, itemsPerPage ∈ {10, 20, 30}, absent = tout afficher)

## 2. Types et defaults

- [x] 2.1 Étendre `NodeListApiType` avec `content.page?: number` et `content.itemsPerPage?: 10 | 20 | 30`
- [x] 2.2 Étendre `NodeNavApiType` avec les mêmes champs optionnels

## 3. Réglages éditeur

- [x] 3.1 Ajouter les contrôles Page et Éléments par page (10/20/30 + option « Tous ») dans `NodeListApi/Settings.tsx`
- [x] 3.2 Ajouter les mêmes contrôles dans `NodeNavApi/Settings.tsx`

## 4. Rendu

- [x] 4.1 Adapter `NodeListApi/View.tsx` : charger la collection complète, appliquer `paginateItems()` avant le rendu
- [x] 4.2 Adapter `NodeNavApi/View.tsx` de la même manière
- [x] 4.3 Mettre à jour le rendu quand `page` ou `itemsPerPage` change (sans re-fetch)

## 5. Validation

- [x] 5.1 Tester un NodeListApi avec 50 items, page 2 et 10/page → affiche items 11-20
- [x] 5.2 Vérifier qu'un nœud existant sans `itemsPerPage` affiche toujours tous les items
- [x] 5.3 Vérifier que le fetch backend reste inchangé (une seule requête par apiId)
