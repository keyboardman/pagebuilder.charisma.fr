## Why

NodeCollection a besoin d’une source de données unique pour `image`, `video` et `article`, mais le backend expose aujourd’hui des registres et contrats séparés (`ApiListArticle`, `ApiListImage`, `ApiListArticleDynamique`, ApiCard video) avec des mappings et endpoints hétérogènes. Chaque nouvelle source exige une classe PHP dédiée, sans UI admin pour la déclarer. Unifier le contrat côté collection et permettre de déclarer les APIs depuis l’admin débloque NodeCollection et accélère l’ajout de sources éditoriales.

## What Changes

- Introduction d’**ApiCollection** : contrat unifié de collection pour NodeCollection, aligné sur ses axes `type` / `mode`.
  - **`type`** : `image` | `video` | `article`.
  - **`mode`** :
    - `fixed` — collection paginée (`page`, `itemsPerPage`) ;
    - `dynamic` — parcours + résolution d’items pour le picking éditorial (références persistées côté nœud).
- **Mapping item standard** unique (champs optionnels selon le type) : `id`, `image`, `title`, `description`, `label` / `labels`, `counter`, `like`, `link`, plus métadonnées utiles (`alt` pour image, etc.).
- **Endpoints unifiés** sous `/page-builder/collections` (catalogue, items paginés en fixed, browse + resolve en dynamic), consommés par NodeCollection à la place des chemins fragmentés `lists` / `lists-image` / cards video pour ce nœud.
- **UI admin** pour déclarer / éditer / activer-désactiver des APIs collection : URL source, type, mode(s), paramètres de requête, et **mapping de champs** (chemins JSON → champs standard) sans écrire une classe PHP.
- Conservations des implémentations PHP existantes en **adapters de compatibilité** (ou migration progressive) vers le registre ApiCollection ; NodeListApi / NodeListImage / ApiCard restent opérationnels pendant la transition.
- Brancher NodeCollection sur le catalogue et les endpoints ApiCollection (filtre par `type` + `mode`).

## Capabilities

### New Capabilities

- `api-collection` : contrat backend unifié (type, mode fixed/dynamic, mapping item, endpoints catalogue/items/resolve) pour alimenter NodeCollection.
- `admin-api-collection` : CRUD admin pour déclarer et gérer les APIs collection (métadonnées, endpoint distant, mapping de champs, activation).

### Modified Capabilities

- `node-collection` : consommation du catalogue / endpoints ApiCollection (au lieu des registres fragmentés) pour les sources `fixed` et `dynamic` des types image, video et article.
- `page-builder` : exposition des endpoints collections et injection éventuelle du catalogue côté builder ; lien menu admin.

## Impact

- Affected specs: **api-collection** (nouveau), **admin-api-collection** (nouveau), **node-collection** (delta), **page-builder** (delta)
- Affected code (prévision) :
  - Backend : `src/PageBuilder/ApiCollection/` (interfaces, registry, runtime config-driven, adapters), ApiResources/State providers `/page-builder/collections*`, Entity + Repository pour les déclarations admin
  - Admin : controller/templates (ou écran Symfony) CRUD APIs collection, entrée menu
  - Frontend builder : `ManagerApi` / adaptateurs NodeCollection (`useCollectionData`, settings source) pour cibler les nouveaux endpoints
  - Tests : contrat mapping, fixed pagination, dynamic resolve, CRUD admin
- **Non-Goals** : supprimer immédiatement ApiListArticle / ApiListImage / ApiListArticleDynamique / ApiCard ; pagination avancée (filtres/recherche libre hors browse dynamic) ; mapping conditionnel complexe (transformations multi-étapes).
