## 1. Audit et découplage NodeCollection

- [x] 1.1 Lister tous les imports `NodeListApi` / `NodeListImage` sous `NodeCollection/**` et les remplacer par des types/helpers locaux
- [x] 1.2 Définir dans NodeCollection les types `CollectionArticleDynamicEntry` et `CollectionImageMediaEntry` (remplacer les types legacy dans `index.ts` et settings)
- [x] 1.3 Internaliser `isShowEnabled` (et helpers show utilisés) hors de `NodeListApi/listApiUtils`
- [x] 1.4 Internaliser `LIST_IMAGE_MEDIA_TYPE` + `mapMediaEntriesToListImageItems` (ou équivalent) hors de `NodeListImage/listImageApiUtils`
- [x] 1.5 Remplacer `ListApiDisplayPaginationSettings` et `ListImageDynamicItemsSettings` par des composants NodeCollection (copie adaptée ou extraction hors NodeList*)
- [x] 1.6 Mettre à jour README NodeCollection et tests (`collectionUtils.test.ts`) pour ne plus importer NodeList*
- [x] 1.7 Vérifier qu’un grep sur `NodeCollection/**` ne retourne plus `NodeListApi` ni `NodeListImage`

## 2. Service de transformation des nœuds

- [x] 2.1 Créer un service PHP (ex. `ListNodeToCollectionMigrator`) qui transforme une map de nœuds selon le mapping design.md
- [x] 2.2 Couvrir le mapping `node-list-api` → `node-collection` (article, mode, dynamicArticleItems, view=article, display=list)
- [x] 2.3 Couvrir le mapping `node-list-image` → `node-collection` (image, dynamicImageItems, view=default)
- [x] 2.4 Ajouter `_migratedFrom` et garantir l’idempotence (skip si déjà `node-collection`)
- [x] 2.5 Tests unitaires PHP du migrator (fixtures JSON list-api, list-image, déjà migré, page vide)

## 3. Migration Doctrine sur page.content

- [x] 3.1 Créer une migration Doctrine qui charge les pages, applique le migrator, persiste `content` modifié
- [x] 3.2 Logger le nombre de nœuds convertis (par type source) pour le suivi
- [x] 3.3 Documenter le rollback (restore dump ; `down()` no-op ou reverse best-effort via `_migratedFrom`)
- [x] 3.4 Exécuter la migration en local et vérifier quelques pages en SQL / admin

## 4. Dépréciation builder

- [x] 4.1 Retirer `NodeListApi` et `NodeListImage` de `NodeRegistry` (plus visibles dans la palette)
- [x] 4.2 Vérifier que les pages migrées s’ouvrent sans erreur de type inconnu
- [x] 4.3 (Optionnel) Mettre à jour `ThemeFormComponent` / docs pour indiquer la dépréciation — sans supprimer les clés CSS tant que Slideshow dépend de ListImage utils

## 5. Validation

- [x] 5.1 Smoke édition : page avec ancien list-api migré (fixed + dynamic article)
- [x] 5.2 Smoke édition : page avec ancien list-image migré (fixed + dynamic image)
- [x] 5.3 Smoke preview / rendu public (noter si `page.render` est obsolète jusqu’à re-save)
- [x] 5.4 Confirmer absence des boutons « Liste Articles » / « Liste Image » dans la palette API
