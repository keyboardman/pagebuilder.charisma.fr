## 1. Utilitaire de position de défilement

- [x] 1.1 Ajouter sous `assets/editeur/ManagerExplorer/utils/` (ou `assets/editeur/utils/`) des fonctions `getCanvasScrollRatio()` et `restoreCanvasScrollRatio(ratio)` ciblant `.admin-layout__main`.
- [x] 1.2 Exposer ces fonctions via le point d’entrée public du module (`ManagerExplorer/index.ts`) si le builder en est le consommateur.

## 2. Intégration au basculement de mode

- [x] 2.1 Dans `Builder.tsx`, capturer le ratio de défilement dans `handleModeChange` avant `setMode`.
- [x] 2.2 Ajouter un `useLayoutEffect` déclenché par le changement de `mode` pour restaurer le ratio après le rendu du nouveau mode (édition ou prévisualisation).
- [x] 2.3 S’assurer que la restauration ne perturbe pas le `scrollCanvasToNode` existant lors de la sélection d’un nœud en mode édition.

## 3. Validation

- [x] 3.1 Page longue en standalone : défiler au milieu en édition → basculer en prévisualisation → la même section reste visible.
- [x] 3.2 Depuis la prévisualisation en bas de page → revenir en édition → la position est conservée.
- [x] 3.3 Bascule sans défilement préalable : le canevas reste en haut.
- [x] 3.4 Vérifier le comportement dans le builder embarqué (formulaire d’édition de page).
