## 1. Réglages Source — édition du lien

- [x] 1.1 Dans `CollectionImageDynamicItemsSettings.tsx`, ajouter un champ texte « Lien (optionnel) » par entrée de la liste (placeholder `https://...`, style compact aligné NodeSlideshow)
- [x] 1.2 Brancher `onChange` pour mettre à jour `dynamicItems[index].link` sans perdre `id` / `src` / `alt` / ordre
- [x] 1.3 Vérifier que l’ajout médiathèque continue d’initialiser `link: ""` et que les entrées sans `link` affichent un champ vide

## 2. Rendu et mapping

- [x] 2.1 Confirmer que `mapMediaEntriesToCollectionImageItems` propage bien `link` (déjà en place ; ajuster si trim/edge cases manquent)
- [x] 2.2 Confirmer que `ImageDefaultItem` enveloppe l’image dans `<a href>` quand `link` est non vide (list / grid / slideshow via le même renderer)

## 3. Tests

- [x] 3.1 Étendre les tests de `collectionUtils` (ou équivalent) pour une entrée média avec `link` renseigné
- [x] 3.2 Ajouter ou étendre un test de rendu image (ex. `View.test.tsx`) vérifiant la présence d’une ancre quand `link` est défini, et son absence quand il est vide
