## Why

Les nœuds `NodeListApi` et `NodeNavApi` chargent une collection fixe via ApiList et affichent **tous** les items retournés. L'utilisateur ne peut pas limiter combien d'éléments sont visibles sur la page (ex. afficher seulement les 10 premiers, ou les items 11 à 20). Il manque des réglages d'affichage inspirés du format API Platform (`page`, `itemsPerPage`) pour contrôler la fenêtre d'items rendus, **sans modifier les appels backend ni les endpoints distants**.

## What Changes

- Ajouter dans les réglages `NodeListApi` (et `NodeNavApi`) deux paramètres d'**affichage** :
  - **Page** : numéro de page à afficher (1, 2, 3…)
  - **Éléments par page** : choix parmi 10, 20, 30
- Après chargement de la collection complète via `/api/page-builder/lists/{apiId}/items`, le nœud **découpe localement** les items à afficher : `slice((page - 1) * itemsPerPage, page * itemsPerPage)`
- Persister `content.page` et `content.itemsPerPage` dans le nœud
- Conserver le comportement actuel par défaut (page 1, 10 éléments affichés) pour les nœuds existants
- **Aucun changement** sur `ApiList`, le provider backend ni les URLs distantes

## Capabilities

### New Capabilities

_Aucune nouvelle capability._

### Modified Capabilities

- `page-builder` : `NodeListApi` et `NodeNavApi` exposent `page` et `itemsPerPage` dans les réglages et n'affichent qu'une fenêtre d'items de la collection chargée

## Impact

- **Frontend uniquement** : `NodeListApi/Settings.tsx`, `NodeListApi/View.tsx`, `NodeListApi/index.ts`, `listApiUtils.ts` (utilitaire de découpage) ; équivalents `NodeNavApi`
- **Backend** : inchangé
- **Specs** : delta sur `page-builder` uniquement
