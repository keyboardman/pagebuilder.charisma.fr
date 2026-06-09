## 1. Structure du module

- [x] 1.1 Créer `assets/editeur/ManagerExplorer/` avec `index.ts` (export public du composant `Explorer`).
- [x] 1.2 Déplacer `app/layout/Explorer.tsx` vers `ManagerExplorer/Explorer.tsx` et ajuster les imports internes.
- [x] 1.3 Déplacer `app/layout/ExplorerDropZone.tsx` vers `ManagerExplorer/components/ExplorerDropZone.tsx`.
- [x] 1.4 Extraire `ExplorerRow` et `ExplorerTreeNode` dans `ManagerExplorer/components/` si le fichier principal dépasse ~150 lignes ou si la lisibilité s’en trouve améliorée.

## 2. Utilitaires

- [x] 2.1 Déplacer `utils/explorerTree.ts` vers `ManagerExplorer/utils/explorerTree.ts` ; conserver l’import de `nodeLabel` depuis `utils/nodeLabel.ts`.
- [x] 2.2 Déplacer `utils/scrollCanvasToNode.ts` vers `ManagerExplorer/utils/scrollCanvasToNode.ts`.

## 3. Intégration

- [x] 3.1 Mettre à jour `Builder.tsx` : importer `Explorer` depuis `ManagerExplorer` et `scrollCanvasToNode` depuis le nouveau chemin.
- [x] 3.2 Rechercher et corriger toute référence résiduelle aux anciens chemins (`app/layout/Explorer`, `utils/explorerTree`, `utils/scrollCanvasToNode`).
- [x] 3.3 Supprimer les fichiers obsolètes sous `app/layout/` une fois les imports validés.

## 4. Validation

- [x] 4.1 Build frontend sans erreur (`npm run build` ou équivalent Encore).
- [x] 4.2 Test manuel : onglet Structure affiche l’arbre ; clic arbre → settings ; clic canevas → surbrillance arbre ; DnD move-node dans l’arbre fonctionne.
