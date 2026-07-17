## 1. Contrat et registre ApiCollection

- [x] 1.1 Créer `src/PageBuilder/ApiCollection/` : interface `ApiCollectionInterface`, `ApiCollectionPageResult`, DTO/mapping item standard (`id`, `image`, `title`, `description`, `label`/`labels`, `counter`, `like`, `link`, `alt`)
- [x] 1.2 Implémenter `ApiCollectionRegistry` (enregistrement, get, list avec filtres `type` / `mode`)
- [x] 1.3 Ajouter les adapters PHP : `ApiListArticle` → fixed article, `ApiListImage` → fixed image, `ApiListArticleDynamique` → dynamic article, ApiCard video (fetchCollection / fetchItem) → video fixed/dynamic selon capacités
- [x] 1.4 Enregistrer les adapters dans le container Symfony (tags / compiler pass aligné sur les registres existants)
- [x] 1.5 Tests unitaires / d’intégration : shape mapping, filtres catalogue, présence des ids legacy



## 2. Endpoints API Platform

- [x] 2.1 Exposer `GET /api/page-builder/collections` (catalogue, query `type`, `mode`)
- [x] 2.2 Exposer `GET /api/page-builder/collections/{apiId}/items` (`page`, `itemsPerPage`)
- [x] 2.3 Exposer `POST /api/page-builder/collections/resolve` (entries `{ apiId, itemId }`, ordre préservé, refs invalides omises)
- [x] 2.4 Brancher factory / DTOs de réponse (réutiliser patterns `BuilderApiCardItemData` / pages lists)
- [x] 2.5 Tests providers : 404 apiId inconnu, pagination, resolve partiel



## 3. Déclarations admin (persistance + runtime)

- [x] 3.1 Créer l’entité `ApiCollectionDefinition` (+ migration) : id, label, type, supportedModes, endpointUrl, itemUrlTemplate, queryParams, paginationStyle, memberPath, fieldMapping, headers, enabled
- [x] 3.2 Implémenter le runtime HTTP générique + résolution de chemins pointés pour le fieldMapping
- [x] 3.3 Brancher les définitions `enabled` dans `ApiCollectionRegistry` (collision d’id avec adapters → rejet)
- [x] 3.4 Tests runtime : mapping title/image/counter/like, pagination hydra / none, fetchItem via template



## 4. CRUD admin UI

- [x] 4.1 Controller + routes `/admin/api-collection` (index, new, edit, delete CSRF)
- [x] 4.2 Formulaires Twig : métadonnées, modes, URL, pagination, mapping des champs standard
- [x] 4.3 Action « Tester » : fetch 1–3 items mappés ou message d’erreur
- [x] 4.4 Lien sidebar « APIs collection » dans `templates/base.html.twig`
- [x] 4.5 Validation : id unique, collision adapters, au moins un mode, type enum



## 5. Intégration NodeCollection (frontend)

- [x] 5.1 Adapter le catalogue Source settings pour `GET …/collections?type=&mode=`
- [x] 5.2 Brancher le chargement mode fixed sur `…/collections/{apiId}/items` (tous types)
- [x] 5.3 Brancher dynamic article/video sur browse + `POST …/collections/resolve` ; conserver file manager pour image dynamic
- [x] 5.4 Aligner la consommation des champs mappés (`image`, `title`, `description`, `label`/`labels`, `counter`, `like`) avec `content.show.*`
- [x] 5.5 Tests frontend / utils existants mis à jour pour les nouveaux endpoints



## 6. Vérifications finales

- [x] 6.1 Vérifier la parité catalogue : ids legacy article/image visibles via `/collections`
- [x] 6.2 Smoke manuel : déclarer une API admin, tester le mapping, l’utiliser dans un NodeCollection fixed
- [x] 6.3 Smoke manuel : NodeCollection dynamic article/video resolve
- [x] 6.4 S’assurer que NodeListApi / NodeListImage / ApiCard continuent de fonctionner via leurs endpoints legacy