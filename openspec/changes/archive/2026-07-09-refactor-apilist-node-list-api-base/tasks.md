# Tasks

## 1. Implémentation de la base `ApiList`

- [x] 1.1 Créer `src/PageBuilder/ApiList/ApiList.php` avec `fetchCollection()` (appel GET, parsing `member` / `totalItems`, fallback erreur).
- [x] 1.2 Encapsuler le mapping via une méthode privée qui délègue au mapping fourni par la classe fille.
- [x] 1.3 Exposer `collectionMode = fixed` pour la compatibilité “home lists”.

## 2. Refactor des cards NodeListApi (home lists)

- [x] 2.1 Refactorer `CharismaTemoignageHomeApiList` pour étendre `ApiList` (mapping list riche : id/title/description/image/labels/link/raw).
- [x] 2.2 Refactorer `FlashnewsArticleHomeApiList` pour étendre `ApiList` (mapping list riche + `counter`/`like` optionnels).

## 3. Tests & validation

- [x] 3.1 Mettre à jour les tests Flashnews pour vérifier la sérialisation de `counter` et `like`.
- [x] 3.2 Vérifier la syntaxe PHP et l’absence d’erreurs de compilation/lint sur les fichiers impactés.
