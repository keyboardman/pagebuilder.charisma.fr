## 1. Modèle de données

- [x] 1.1 Ajouter `hidden?: boolean` à l'interface `NodeType` dans `assets/editeur/types/NodeType.ts`
- [x] 1.2 Créer `assets/editeur/utils/nodeVisibility.ts` avec `isNodeEffectivelyHidden(nodeId, nodes)` (remontée ancêtres) et tests unitaires

## 2. Navigateur Structure (Explorer)

- [x] 2.1 Ajouter le bouton icône œil (`Eye` / `EyeOff`) dans `ExplorerRow.tsx` avec `stopPropagation` et appel `updateNode`
- [x] 2.2 Masquer le bouton pour `node-root` ; appliquer `opacity-50` sur les lignes effectivement masquées
- [x] 2.3 Tests sur `ExplorerRow` : toggle `hidden`, absence d'icône sur racine, pas de sélection au clic œil

## 3. Rendu des nœuds

- [x] 3.1 Dans `NodeComponent.tsx` : retourner `null` en modes `preview`/`view` si effectivement masqué ; style atténué en mode `edit`
- [x] 3.2 Dans `NodeChild.tsx` : même logique de filtrage/atténuation
- [x] 3.3 Tests sur le rendu conditionnel (visible / masqué / parent masqué) selon le mode

## 4. Vérification manuelle

- [x] 4.1 Vérifier masquage/réactivation depuis l'onglet Structure sur un conteneur avec enfants
- [x] 4.2 Vérifier que la prévisualisation et le rendu public n'affichent pas les nœuds masqués
- [x] 4.3 Vérifier persistance après sauvegarde et rechargement de la page
