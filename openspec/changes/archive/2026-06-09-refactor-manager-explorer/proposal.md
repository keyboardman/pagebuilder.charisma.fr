# Change : regrouper l’Explorer dans ManagerExplorer

## Why

Le navigateur de composants (Explorer) a été introduit sous `app/layout/` avec des utilitaires éparpillés dans `utils/`. Cette dispersion complique la maintenance et rompt la cohérence avec `ManagerNode`, qui regroupe déjà toute la logique liée aux nœuds (composants, panneau de blocs, settings).

Centraliser l’Explorer dans un module dédié `ManagerExplorer` clarifie les frontières du code et facilite les évolutions (DnD dans l’arbre, extraction de sous-composants, tests).

## What Changes

- Créer le module `assets/editeur/ManagerExplorer/` sur le modèle de `ManagerNode`.
- Déplacer `Explorer.tsx` et `ExplorerDropZone.tsx` depuis `app/layout/` vers `ManagerExplorer/`.
- Déplacer `utils/explorerTree.ts` et `utils/scrollCanvasToNode.ts` vers `ManagerExplorer/utils/` (utilitaires propres au navigateur et à la synchro canevas ↔ arbre).
- Extraire si pertinent les sous-composants internes (`ExplorerRow`, `ExplorerTreeNode`) dans `ManagerExplorer/components/`.
- Mettre à jour les imports (`Builder.tsx`, etc.) ; supprimer les anciens chemins.
- Conserver `utils/nodeLabel.ts` à l’emplacement actuel : partagé avec `ManagerNode` (`NodeMenu`, `NodeEditorLabelField`).
- Aucun changement de comportement utilisateur (refactoring structurel uniquement).

## Impact

- Affected specs : `page-builder` (exigence d’organisation du module).
- Affected code :
  - `assets/editeur/app/layout/Explorer.tsx` → `assets/editeur/ManagerExplorer/`
  - `assets/editeur/app/layout/ExplorerDropZone.tsx` → `assets/editeur/ManagerExplorer/components/`
  - `assets/editeur/utils/explorerTree.ts` → `assets/editeur/ManagerExplorer/utils/`
  - `assets/editeur/utils/scrollCanvasToNode.ts` → `assets/editeur/ManagerExplorer/utils/`
  - `assets/editeur/app/builder/Builder.tsx` (import du point d’entrée public)
