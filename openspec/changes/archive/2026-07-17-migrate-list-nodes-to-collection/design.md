## Context

Les nœuds sont stockés dans `page.content` (colonne JSON) comme une map `Record<nodeId, NodeType>` (`NodesType`), pas dans une table `nodes` séparée. Chaque entrée a `type`, `content`, `parent`, etc.

État actuel côté frontend :

- `NodeCollection` importe encore `NodeListApi` / `NodeListImage` pour :
  - types (`NodeListApiDynamicEntry`, `NodeListImageMediaEntry`) ;
  - utils (`listApiUtils.isShowEnabled`, `listImageApiUtils.mapMediaEntriesToListImageItems`, `LIST_IMAGE_MEDIA_TYPE`) ;
  - UI (`ListApiDisplayPaginationSettings`, `ListImageDynamicItemsSettings`).
- `NodeListApi` (`node-list-api`) et `NodeListImage` (`node-list-image`) restent enregistrés dans `NodeRegistry` et visibles dans la palette.

`NodeCollection` est déjà capable de remplacer ces deux nœuds (article liste + image liste) via `collectionType`, `mode`, `display=list`.

## Goals / Non-Goals

**Goals:**

- Zéro import runtime de `NodeListApi` / `NodeListImage` depuis `NodeCollection/**`.
- Migration Doctrine idempotente de tous les nœuds `node-list-api` et `node-list-image` vers `node-collection` dans `page.content`.
- Retrait (ou masquage) des deux nœuds legacy du panneau builder après migration.
- Parité fonctionnelle minimale : même source, mode, pagination, items dynamiques, toggles `show`, styles de base.

**Non-Goals:**

- Seed ApiList/ApiCard → `api_collection_definition` (change `import-apilist-apicard-to-apicollection`).
- Suppression immédiate des dossiers `NodeListApi` / `NodeListImage` (phase ultérieure possible une fois la migration validée en prod).
- Migration de `NodeSlideshow`, `NodeCardApi`, `NodeNavApi`.
- Conversion automatique vers `display=grid|slideshow` (les listes legacy restent en `display=list`).
- Régénération du HTML `page.render` (re-save / rebuild à la prochaine édition ou job séparé si nécessaire).

## Decisions

### 1. Migration PHP sur `page.content` (pas de SQL JSON pur)

**Choix :** migration Doctrine avec service / méthode PHP qui charge chaque `page`, parcourt la map de nœuds, transforme, `UPDATE` via EntityManager.

**Pourquoi :** la structure JSON est une map plate d’objets hétérogènes ; un mapping champ-à-champ fiable est plus simple et testable en PHP qu’en `jsonb_set` PostgreSQL récursif.

**Alternative écartée :** SQL pur `jsonb` — fragile pour renommer/déplacer des clés (`dynamicItems` → `dynamicArticleItems` / `dynamicImageItems`, ajout de `collectionType` / `display` / `view`).

### 2. Mapping de contenu

#### `node-list-api` → `node-collection`

| Source (ListApi) | Cible (Collection) |
|---|---|
| `type: node-list-api` | `type: node-collection` |
| — | `content.collectionType: "article"` |
| `content.listMode` | `content.mode` (`fixed` \| `dynamic`) |
| `content.apiId` | `content.apiId` |
| `content.page` / `itemsPerPage` | idem |
| `content.dynamicItems` | `content.dynamicArticleItems` |
| `content.show` | `content.show` (clés title/description/counter/like ; image/labels défaut true) |
| `content.list/item/title/description/counter/like` | mêmes clés sous `content` |
| — | `content.display: "list"`, `content.view: "article"` (vue liste riche ListApi) |
| — | `content.list.gap` défaut collection si absent |
| `id`, `parent`, `attributes`, `editorLabel`, `hidden` | inchangés |

#### `node-list-image` → `node-collection`

| Source (ListImage) | Cible (Collection) |
|---|---|
| `type: node-list-image` | `type: node-collection` |
| — | `content.collectionType: "image"` |
| `content.listMode` | `content.mode` |
| `content.apiId` | `content.apiId` |
| `content.page` / `itemsPerPage` | idem |
| `content.dynamicItems` | `content.dynamicImageItems` |
| `content.list/item/image` | idem |
| — | `content.display: "list"`, `content.view: "default"` |
| `id`, `parent`, … | inchangés |

Idempotence : si `type` est déjà `node-collection`, ne pas retraiter. Si un nœud legacy a déjà été migré (absent), no-op.

### 3. Découplage frontend

**Choix :** internaliser dans `NodeCollection` (ou un module `shared/collection/` si réutilisé ailleurs) :

- types `CollectionArticleDynamicEntry` / `CollectionImageMediaEntry` (remplacent les types List*) ;
- helpers `isShowEnabled`, constantes média, mapping media entries ;
- composants settings de pagination et picker image dynamiques (copie ou extraction hors `NodeList*`).

**Pourquoi :** éviter une dépendance circulaire pendant la dépréciation ; les packages List* ne sont plus la source de vérité.

**Alternative écartée :** extraire immédiatement un package partagé `ManagerNode/shared/list*` utilisé par List et Collection — utile plus tard, mais hors scope si on déprécie List rapidement.

### 4. Dépréciation builder

**Choix :** retirer `NodeListApi` et `NodeListImage` du registre / panneau (`NodeRegistry`) après migration. Optionnel : garder les modules sur disque jusqu’à validation prod, sans les exposer.

**Pourquoi :** empêche de créer de nouveaux nœuds legacy ; les pages migrées n’en ont plus besoin.

### 5. `page.render`

**Choix :** ne pas régénérer `render` dans la migration. Le HTML pré-rendu peut encore contenir des classes `.ce-list-api` / `.ce-list-image` jusqu’à la prochaine sauvegarde builder.

**Mitigation :** documenter ; si le rendu public est critique, ajouter un job de re-render post-migration (hors v1) ou forcer un rebuild via commande console.

## Risks / Trade-offs

- **[Différences de CSS / markup]** ListApi utilise `.ce-list-api`, Collection utilise `.ce-collection` (+ vue article). → Mitigation : `view=article` pour les ListApi migrés ; smoke test visuel sur pages représentatives ; ajuster CSS si écarts.
- **[Champs non mappés / custom]** Contenu étendu hors schéma connu. → Mitigation : conserver les clés inconnues dans `content` ; logger les nœuds transformés (count par page).
- **[render obsolète]** HTML public figé. → Mitigation : documenter re-save ; commande optionnelle de re-render.
- **[Dépendances hors NodeCollection]** `NodeSlideshow` importe encore `listImageApiUtils`. → Mitigation : hors scope ; ne pas supprimer le dossier `NodeListImage` tant que Slideshow en dépend.
- **[Collision avec seed ApiCollection]** Les `apiId` restent inchangés. → Compatible avec `import-apilist-apicard-to-apicollection` tant que les ids canonicaux sont préservés.

## Migration Plan

1. Découpler le code `NodeCollection` (PR / tâches frontend) — deployable avant la data migration.
2. Déployer la migration Doctrine : transformer `page.content`.
3. Retirer les nœuds legacy du `NodeRegistry` / palette.
4. Smoke : ouvrir pages migrées en édition + preview ; vérifier catalogue API et items.
5. Rollback : restauration DB (backup) ; la migration down peut re-mapper si on stocke un marqueur (`content._migratedFrom`) — **décision** : ajouter `_migratedFrom: "node-list-api" | "node-list-image"` pour permettre un down approximatif, ou documenter rollback = restore dump (préféré si volume faible).

**Recommandation rollback :** snapshot DB avant migrate ; `down()` no-op ou reverse best-effort via `_migratedFrom`.

## Open Questions

- Faut-il régénérer `page.render` dans la même livraison ? (défaut : non)
- Masquer seulement la palette ou supprimer aussi les entrées thème (`ThemeFormComponent` keys `node-list-api` / `node-list-image`) ? (défaut : masquer palette ; conserver keys thème jusqu’à phase 2)
- Conserver `_migratedFrom` en prod ou le retirer après validation ? (défaut : conserver jusqu’à phase suppression List*)
