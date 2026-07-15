## Why

Le builder dispose aujourd'hui de `ApiListArticle` pour les collections fixes riches (titre, description, lien, compteurs…), mais les nœuds orientés **images uniquement** (slideshow, galeries) passent encore par `ApiCard` (`/page-builder/cards`). Ce couplage mélange sélection modale item-par-item et collections fixes, et impose un mapping avec des champs inutiles (`title`, `description`, `counter`…). Un sous-système dédié `ApiListImage`, calqué sur `ApiListArticle`, permettra de brancher des collections d'images sans bruit éditorial.

## What Changes

- Nouveau module backend `src/PageBuilder/ApiListImage/` : base abstraite, registre, `ApiListImagePageResult`, interface de comportement
- Nouveaux endpoints API Platform :
  - `GET /api/page-builder/lists-image` (catalogue)
  - `GET /api/page-builder/lists-image/{apiId}/items` (collection paginée)
- Contrat de mapping **image-only** : `id`, `image` (obligatoire), `link` et `alt` optionnels — **pas** de `title`, `description`, `counter`, `like`, `labels`
- Première implémentation concrète : port des collections image fixes existantes (ex. événements home Charisma)
- Tag Symfony `app.builder_api_list_image` et enregistrement dans `services.yaml`
- Module miroir `ApiListImageDynamique` pour la résolution de listes ordonnées multi-sources (même pattern que `ApiListArticleDynamique`)
- Adaptation frontend : utilitaires et consommation par les nœuds image (ex. `NodeSlideshow` en mode `api-endpoint`)

## Capabilities

### New Capabilities

- `api-list-image` : sous-système backend et endpoints pour collections fixes d'images, avec contrat de mapping minimal et registre dédié

### Modified Capabilities

- `node-list-api-apilist-base` : documenter la séparation à trois (`ApiCard` / `ApiListArticle` / `ApiListImage`) et les endpoints associés
- `page-builder` : `NodeSlideshow` en mode `api-endpoint` consomme `/api/page-builder/lists-image` au lieu de `/api/page-builder/cards`

## Impact

- `src/PageBuilder/ApiListImage/` (nouveau)
- `src/PageBuilder/ApiListImageDynamique/` (nouveau, miroir de `ApiListArticleDynamique`)
- `src/ApiResource/`, `src/State/`, `src/Serializer/` (ressources catalogue et items)
- `config/services.yaml` (tag `app.builder_api_list_image`)
- `assets/editeur/ManagerNode/NodeSlideshow/` (catalogue et fetch via lists-image)
- Tests PageBuilder (registre, mapping, endpoints)
- `ApiCard` image en mode collection fixe : les implémentations concernées peuvent être dupliquées ou migrées vers `ApiListImage` (rétrocompatibilité cards conservée)
