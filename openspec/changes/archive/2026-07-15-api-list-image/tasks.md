## 1. Backend ApiListImage (base)

- [x] 1.1 Créer `ApiListImage`, `ApiListImageBehaviorInterface`, `ApiListImagePageResult` dans `src/PageBuilder/ApiListImage/`
- [x] 1.2 Créer `ApiListImageRegistry` avec tag `app.builder_api_list_image`
- [x] 1.3 Enregistrer le registre dans `config/services.yaml`

## 2. Endpoints API Platform

- [x] 2.1 Créer `BuilderApiListImageCatalogResponse` + `BuilderApiListImageCatalogProvider` (`GET /api/page-builder/lists-image`)
- [x] 2.2 Créer `BuilderApiListImageItemsPage` + `BuilderApiListImageItemsPageProvider` + normalizer (`GET /api/page-builder/lists-image/{apiId}/items`)
- [x] 2.3 Créer DTO `BuilderApiListImageItemData` (champs `id`, `image`, `link?`, `alt?` uniquement)

## 3. Première implémentation concrète

- [x] 3.1 Créer `CharismaEvenementHomeApiListImage` (port de la collection événements home)
- [x] 3.2 Taguer le service dans `config/services.yaml`
- [x] 3.3 Test unitaire du mapping image-only

## 4. Backend ApiListImageDynamique

- [x] 4.1 Créer `ApiListImageDynamique`, `ApiListImageDynamiqueEntry`, `ApiListImageDynamiqueResolver`, `ApiListImageDynamiqueRegistry`
- [x] 4.2 Ajouter endpoints `GET /api/page-builder/lists-image/dynamic`, `GET /api/page-builder/lists-image/dynamic/{apiId}/items`, `POST /api/page-builder/lists-image/dynamic/resolve`
- [x] 4.3 Tests unitaires du resolver

## 5. Frontend NodeSlideshow

- [x] 5.1 Créer utilitaires `listImageApiUtils.ts` (fetch catalogue, fetch items, mapping → slides)
- [x] 5.2 Adapter `slideshowApi.ts` pour consommer `/api/page-builder/lists-image/{apiId}/items`
- [x] 5.3 Adapter `Settings.tsx` : sélecteur alimenté par le catalogue lists-image (remplacer `ApiManagerModal` cards)
- [x] 5.4 Tests unitaires mapping slides depuis items image-only

## 6. Implémentations optionnelles

- [x] 6.1 Porter `CharismaEvenementRetrospectiveApiCard` vers `CharismaEvenementRetrospectiveApiListImage`
- [x] 6.2 Test d'enregistrement des services (`ApiCardServiceRegistrationTest` ou équivalent lists-image)
