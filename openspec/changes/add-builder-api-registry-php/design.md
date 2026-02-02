# Design: Registre d’APIs card en PHP

## Context

- Le dépôt `editeur2.charisma.fr` définit en JS une interface `ApiAdapter` (id, label, type, fetchCollection, fetchItem, mapItem, fetchCategories?, categoryQueryParam?) et un registre in-memory alimenté par `CharismaPageBuilder.registerApi(adapter)`.
- Le builder (NodeCardApi, ApiManagerModal) utilise ce registre pour afficher la liste des APIs et pour appeler fetchCollection / fetchItem côté client.
- Objectif : déplacer la source de vérité côté Symfony (PHP), garder le builder compatible en lui fournissant les mêmes données via HTTP.

## Goals / Non-Goals

- **Goals** : (1) Contrat décrit en PHP (interfaces ApiCard*). (2) Symfony liste toutes les APIs enregistrées. (3) Ces APIs sont disponibles dans le builder via des appels HTTP au backend. (4) Ajout d’une nouvelle API = nouveau service PHP tagué, sans toucher au JS.
- **Non-Goals** : Ne pas supprimer la possibilité d’enregistrer des adapters en JS si besoin (rétrocompatibilité optionnelle) ; pas de migration de données (pas de schéma BDD pour les APIs).

## Decisions

- **Interfaces PHP** : Une interface de base (ex. `ApiCardInterface`) avec `getId()`, `getLabel()`, `getType()`, `fetchCollection()`, `fetchItem()`, `mapItem()`. Types spécialisés `ApiCardArticleInterface` et `ApiCardVideoInterface` étendent la base et fixent `getType()` à `article` / `video`. Alignement des signatures avec le contrat JS (pagination page/limit, retour `{ items, total }`, mapItem vers structure commune id/title/description/image/labels/link/text/raw).
- **Registre** : Service `ApiCardRegistry` (ou équivalent) injectant un `iterable` de `ApiCardInterface` (tag `app.builder_api_card`). Méthode `list()` retournant les métadonnées (id, label, type, category) pour exposition JSON.
- **Endpoints** : Préfixe dédié (ex. `/page-builder/api/`) : `GET /page-builder/api/cards` (liste), `GET /page-builder/api/cards/{id}/items` (collection, query: page, limit, search, sort, category), `GET /page-builder/api/cards/{id}/items/{itemId}` (item), et optionnellement `GET /page-builder/api/cards/{id}/categories`. Réponses JSON ; contrôleur délègue au registre puis à l’implémentation correspondante.
- **Frontend** : Au chargement du builder (standalone ou formulaire), récupération de la liste des APIs soit injectée dans `page-builder-data`, soit via `GET /page-builder/api/cards`. Un adapteur JS unique « backend » utilise ces endpoints (liste + collection + item) pour chaque API ; le builder enregistre cet adapteur ou utilise une liste d’adapteurs générés à partir de la réponse, de sorte que les blocs card API fonctionnent sans appeler `registerApi()` manuellement pour chaque API PHP.

## Risks / Trade-offs

- **Latence** : Les appels collection/item passent par le serveur ; acceptable pour un usage admin/édition. Si besoin, cache HTTP ou cache applicatif côté PHP pour les listes lourdes.
- **Sécurité** : Les endpoints builder API doivent être protégés (même règle d’accès que l’édition de pages) et ne pas exposer de données sensibles ; les implémentations PHP doivent valider/sanitiser les paramètres.

## Migration Plan

- Aucune migration de données. Déploiement : ajout des interfaces, du registre, des routes et du contrôleur ; mise à jour du frontend pour consommer les nouveaux endpoints. Les pages existantes et le contenu déjà sauvegardé restent inchangés.

## Open Questions

- Préfixe exact des routes (ex. `app_page_builder_api_*`) et nom du contrôleur à valider avec les conventions du projet.
- Faut-il conserver `CharismaPageBuilder.registerApi()` pour des APIs purement front (ex. démo) ou tout centraliser côté PHP ?
