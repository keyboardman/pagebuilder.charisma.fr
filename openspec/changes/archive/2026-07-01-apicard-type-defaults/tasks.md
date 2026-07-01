## 1. Interfaces typées — implémentation par défaut de getType()

- [x] 1.1 Ajouter le corps `return 'article';` dans `ApiCardArticleInterface::getType()`
- [x] 1.2 Ajouter le corps `return 'video';` dans `ApiCardVideoInterface::getType()`
- [x] 1.3 Ajouter le corps `return 'image';` dans `ApiCardImageInterface::getType()`
- [x] 1.4 Ajouter le corps `return 'list';` dans `ApiCardListInterface::getType()`

## 2. Suppression du boilerplate dans les implémentations

- [x] 2.1 Supprimer `getType()` de `CharismaEvenementApiCard` et `CharismaEvenementHomeApiCard`
- [x] 2.2 Supprimer `getType()` de `CharismaVideosApiCard`
- [x] 2.3 Supprimer `getType()` de `CharismaArticleAuteurApiCard`, `FlashnewsApiCard`, `CharismaTemoignageApiCard` et `StubApiCard`
- [x] 2.4 Supprimer `getType()` de `FlashnewsThemeApiList` et `StubNavListApiCard`

## 3. Vérification

- [x] 3.1 Lancer les tests PHP existants liés au registre ApiCard (ou `phpunit` global) et confirmer que les types retournés sont inchangés
