# Change: Nettoyage du code mort, déduplication et mise à jour de la documentation

## Why

La première vague de nettoyage (`cleanup-assets-dead-code-and-font-catalog`, archivée) a retiré les anciens entrypoints `themeForm`, `ApiManager` et les artefacts fonts legacy. Depuis la migration vers un **canevas WYSIWYG unifié** (`update-builder-edit-canvas-wysiwyg`, archivée) et l’édition inline dans les `View.tsx` (`update-builder-edit-inline-text-on-selection`), une **deuxième couche de dette** s’est accumulée :

- **16 fichiers `Edit.tsx`** et la propriété `edit` de `NodeConfigurationType` ne sont plus montés par `NodeComponent` / `NodeChild`.
- Des reliquats de l’ancienne médiathèque React (`fileManager.jsx`, `FileManager.tsx`, template `media/index.html.twig`) coexistent avec keyboardman alors que l’entrypoint Webpack `fileManager` a déjà été retiré.
- Des dépendances npm inutilisées (`draft-js`, `react-contenteditable`, types associés) alourdissent le bundle.
- Du PHP et de la config Symfony (`MediaStorage`, `S3ClientFactory`, bloc `media_storage.*`) ne sont plus injectés.
- Des patterns dupliqués (NodeCard / NodeCardApi, NodeIcone / NodeTextIcon, deux arbres `components/ui`) compliquent la maintenance.
- La documentation (`README.md`, `openspec/project.md`, `docs/FILEMANAGER_KEYBOARDMAN.md`, spec `page-builder` entrypoints) n’est plus alignée avec le code.

Un passage structuré réduit le risque de régression lors des prochains changements UX du builder (NodeGrid, panneau droit rétractable, NodeRoot).

## What Changes

- **Phase 1 — Audit automatisé et inventaire documenté**
  - Ajouter des scripts d’audit (`knip` ou équivalent pour `assets/`, inventaire PHP via grep + PHPStan basique).
  - Produire une liste validée de candidats à la suppression avant toute suppression massive.
- **Phase 2 — Suppression du code mort confirmé**
  - Retirer la couche `Edit.tsx` / propriété `edit` des configurations de nœuds.
  - Supprimer les reliquats médiathèque legacy (`fileManager.jsx`, `FileManager.tsx`, `templates/media/index.html.twig`).
  - Retirer les dépendances npm mortes (Draft.js, `react-contenteditable`, meta-paquets non utilisés).
  - Retirer `MediaStorage`, `S3ClientFactory` et la config `media_storage.*` si keyboardman/Flysystem couvrent tous les cas.
  - Retirer les scaffolds Stimulus/React inutilisés (`hello_controller.js`, `Hello.jsx`).
- **Phase 3 — Déduplication ciblée**
  - Factoriser les vues partagées NodeCard / NodeCardApi (`ViewTitle`, `HasLink`, utilitaires).
  - Factoriser les settings icône NodeIcone / NodeTextIcon.
  - Harmoniser l’identifiant unique (`nanoid` vs `shortid`) là où le changement est sans impact fonctionnel.
- **Phase 4 — Documentation**
  - Compléter `openspec/project.md` (stack, architecture builder, commandes dev).
  - Mettre à jour `README.md` avec une vue d’ensemble et les commandes essentielles.
  - Archiver ou corriger `docs/FILEMANAGER_KEYBOARDMAN.md` et les commentaires obsolètes (`services.yaml`, `AGENTS.md`).
  - Corriger la spec `page-builder` (entrypoints Webpack actifs, périmètre PHP).

## Impact

- Affected specs: `page-builder`
- Affected code (indicatif) :
  - `assets/editeur/ManagerNode/**/Edit.tsx`, `NodeConfigurationType.ts`, `**/index.ts` des nœuds
  - `assets/fileManager.jsx`, `assets/components/FileManager.tsx`, `templates/media/index.html.twig`
  - `package.json`, `webpack.config.js`
  - `src/Service/MediaStorage.php`, `src/Service/S3ClientFactory.php`, `config/services.yaml`
  - `assets/editeur/ManagerNode/NodeCard*`, `NodeIcone`, `NodeTextIcon`
  - `README.md`, `openspec/project.md`, `docs/`, `AGENTS.md`
- **Dépendances** : à exécuter après validation des changes actifs `update-builder-edit-inline-text-on-selection` et `update-nodegrid-edit-canvas-ux` (les `Edit.tsx` peuvent encore servir de référence pendant la migration inline).
