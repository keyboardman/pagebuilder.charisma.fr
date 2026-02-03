# Change: Registre d’APIs « card » côté PHP pour le builder

## Why

Le builder (editeur2) expose aujourd’hui une fonction JS `CharismaPageBuilder.registerApi(adapter)` pour enregistrer des APIs (articles, vidéos, etc.) utilisées par les blocs « card API ». La définition et l’enregistrement se font entièrement en JavaScript. Pour centraliser la logique côté Symfony et permettre d’ajouter des APIs via des services PHP (tagging, DI), il faut décrire le contrat en PHP avec des interfaces (`ApiCardArticleInterface`, `ApiCardVideoInterface`), un registre Symfony qui liste toutes les implémentations, et des endpoints exposant cette liste et les données (collection, item) pour que le builder les consomme.

## What Changes

- Introduction d’interfaces PHP décrivant le contrat des APIs « card » : base commune + `ApiCardArticleInterface`, `ApiCardVideoInterface` (alignées sur le contrat actuel `ApiAdapter` en JS : id, label, type, fetchCollection, fetchItem, mapItem, fetchCategories optionnel).
- Registre Symfony (service) qui collecte toutes les implémentations taguées et expose une méthode pour lister les APIs disponibles.
- Endpoints HTTP pour le builder : liste des APIs (`GET`), collection paginée par API (`GET`), item par ID (`GET`), et optionnellement catégories.
- Adaptation du builder pour consommer ces APIs via les endpoints Symfony (liste injectée ou chargée au démarrage, appels fetch vers le backend pour collection/item) au lieu de s’appuyer uniquement sur `registerApi()` en JS.

## Impact

- Affected specs: `page-builder`, nouvelle capacité `builder-api-registry`
- Affected code: nouveau namespace (ex. `App\PageBuilder\ApiCard`), `config/services.yaml` (tags), contrôleur ou routes pour les endpoints builder API, assets (pageBuilderStandalone / formulaire) pour utiliser les APIs exposées par Symfony
