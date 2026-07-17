## 1. Schéma et modèle

- [x] 1.1 Ajouter sur `ApiCollectionDefinition` les champs nullable : `searchQueryParam`, `categoryQueryParam`, `categoriesUrl`, `categoriesMemberPath`, `categoriesIdPath`, `categoriesLabelPath` (+ getters/setters)
- [x] 1.2 Créer la migration Doctrine du schéma (colonnes JSON/string appropriées)
- [x] 1.3 Étendre `ApiCollectionDefinitionType` (formulaire admin) pour éditer ces champs
- [x] 1.4 Mettre à jour le seeder / templates de définition pour renseigner search/catégorie sur les `api_id` Flashnews et Charisma articles concernés

## 2. Runtime et contrat backend

- [x] 2.1 Étendre `ApiRequestParamHelper::buildDynamicListCollectionParams` pour parser `category`
- [x] 2.2 Faire appliquer `search` / `category` dans `ConfigurableApiCollection::fetchItems` via les query params configurés
- [x] 2.3 Ajouter `fetchCategories(): array` sur le contrat ApiCollection (implémentations : configurable HTTP, adapters list → `[]`, `ApiCardCollectionAdapter` → délègue à la card)
- [x] 2.4 Transmettre `category` dans `ApiCardCollectionAdapter::fetchItems`
- [x] 2.5 Exposer `GET /api/page-builder/collections/{apiId}/categories` (ApiResource + provider + normalizer)

## 3. Data migration seed

- [x] 3.1 Migration data `UPDATE` des définitions existantes prioritaires (`flashnews`, `flashnews_article`, articles Charisma dynamic, etc.) avec `searchQueryParam` / `categoryQueryParam` / `categoriesUrl` selon le design
- [x] 3.2 Vérifier manuellement ou via smoke qu’un `items?search=` et `categories` répondent pour au moins une source seedée

## 4. Frontend picker

- [x] 4.1 Étendre `collectionApiUtils` : `buildItemsUrl` + `fetchCollectionItemsPage` acceptent `category` ; ajouter `fetchCollectionCategories`
- [x] 4.2 Mettre à jour `CollectionItemPickerModal` : charger catégories, afficher le select si non vide, passer `category` + reset page
- [x] 4.3 Vérifier le debounce search et le reset page au changement de filtres

## 5. Tests

- [x] 5.1 Tests unitaires `ConfigurableApiCollection` : mapping search/category présents / absents
- [x] 5.2 Tests unitaires / fonctionnels endpoint categories (définition, adapter, source sans catégories → `[]`)
- [x] 5.3 Test helper request : `category` bien extrait
- [x] 5.4 Adapter ApiCard : `category` transmis à `fetchCollection`
