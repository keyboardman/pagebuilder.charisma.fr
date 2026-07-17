## Why

`NodeCollection` remplace `NodeListApi` (liste articles) et `NodeListImage` (liste images), mais le code du nœud unifié réutilise encore leurs types, utils et composants UI. Ces nœuds legacy vont être dépréciés : il faut couper toute dépendance runtime, puis migrer automatiquement les nœuds déjà persistés dans `page.content` vers `node-collection`.

## What Changes

- **Découpler NodeCollection** de `NodeListApi` et `NodeListImage` : types locaux, utils / composants internalisés ou partagés hors des packages dépréciés ; plus aucun import depuis ces modules.
- **Migration Doctrine** sur `page.content` (arbre JSON des nœuds) : convertir chaque nœud `node-list-api` → `node-collection` (`collectionType=article`) et chaque `node-list-image` → `node-collection` (`collectionType=image`), en mappant le contenu (mode, apiId, pagination, dynamicItems, show, styles).
- **Déprécier** `NodeListApi` et `NodeListImage` dans le builder : retrait du panneau des composants (ou marquage deprecated) après migration ; le registre peut conserver un stub de lecture temporaire si besoin de compatibilité avant suppression totale.
- **BREAKING** (éditorial) : les pages existantes n’utiliseront plus les types `node-list-api` / `node-list-image` après migration ; le rendu attendu doit rester équivalent via `node-collection` en mode liste.

## Capabilities

### New Capabilities

- `node-list-to-collection-migration`: Migration automatique des nœuds `node-list-api` et `node-list-image` vers `node-collection` dans le JSON `page.content`, avec mapping de contenu documenté et idempotent.

### Modified Capabilities

- `node-collection`: Exiger l’indépendance code de `NodeListApi` / `NodeListImage` (types et helpers propres au module) ; préciser le contrat de contenu cible pour les nœuds migrés.
- `page-builder`: Déprécier / retirer du panneau les nœuds `node-list-api` et `node-list-image` au profit de `node-collection` ; documenter le comportement post-migration.

## Impact

- Frontend : `assets/editeur/ManagerNode/NodeCollection/**` (découplage), éventuellement `NodeRegistry`, labels thème (`ThemeFormComponent`).
- Backend : nouvelle migration Doctrine (PHP) transformant récursivement / itérativement les entrées de `page.content` (map `NodesType`).
- Données : toutes les pages contenant des nœuds list legacy.
- Hors scope : seed ApiList → ApiCollection (`import-apilist-apicard-to-apicollection`) ; suppression physique immédiate des dossiers `NodeListApi` / `NodeListImage` (peut rester en phase 2 après validation migration) ; `NodeSlideshow` / `NodeNavApi`.
