## Why

Le nœud `NodeListApi` ne permet aujourd'hui que de brancher une collection fixe (`ApiListArticle`) en entier. Les éditeurs ont besoin de composer une liste sur mesure : sélectionner des items individuels issus de sources différentes et définir leur ordre d'affichage.

## What Changes

- Ajout d'un mode **dynamique** pour `NodeListApi`, en complément du mode **fixe** existant (bascule dans les réglages, sur le modèle de `NodeSlideshow`)
- Stockage des items dynamiques sous forme `{ id, type }` (`id` = identifiant item, `type` = identifiant de la source API)
- Nouveau module backend `src/PageBuilder/ApiListArticleDynamique` pour résoudre une liste ordonnée de références vers des items mappés
- Nouvel endpoint `POST /api/page-builder/lists/dynamic/resolve`
- UI réglages : sélection d'items via `ApiManagerModal`, liste triable par glisser-déposer
- Le mode fixe et la pagination d'affichage existante restent inchangés (rétrocompatibilité)

## Capabilities

### New Capabilities

- `api-list-dynamic`: résolution backend et mode dynamique NodeListApi

### Modified Capabilities

- `page-builder`: mode dynamique et bascule fixe/dynamique dans NodeListApi

## Impact

- `assets/editeur/ManagerNode/NodeListApi/` (types, Settings, View, utils)
- `src/PageBuilder/ApiListArticleDynamique/` (nouveau)
- `src/ApiResource/`, `src/State/`, `src/Serializer/` (endpoint resolve)
- Tests PageBuilder et listApiUtils
