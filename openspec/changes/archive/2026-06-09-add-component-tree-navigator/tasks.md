## 1. Arbre et données

- [x] 1.1 Implémenter un utilitaire (ou logique dans `Explorer.tsx`) qui construit l’arbre à partir de `nodes` : racine `node-root`, enfants par `parent.id`, tri par `zone` puis `order`, regroupement par zone lorsque plusieurs zones existent pour un même parent.
- [x] 1.2 Résoudre le libellé affiché via `NodeRegistry` (`button.label`) avec repli sur le type (`node-flex` → `flex`).

## 2. Composant navigateur

- [x] 2.1 Refactoriser `assets/editeur/app/layout/Explorer.tsx` : composant récursif `ExplorerNode`, état replié/déplié par nœud, styles d’indentation type arbre DOM.
- [x] 2.2 Au clic sur une entrée, appeler `setSelected(node.id)` via `useBuilderContext`.
- [x] 2.3 Mettre en surbrillance l’entrée dont `node.id === selected`.
- [x] 2.4 Lorsque `selected` change (depuis le canevas), déplier les ancêtres du nœud actif et faire défiler la liste vers l’entrée active.

## 3. Intégration layout

- [x] 3.1 Dans `Builder.tsx`, ajouter des onglets **Blocs** / **Structure** dans `Layout.SidebarLeft` (composant `Tabs` existant) : onglet Blocs = `PanelButtons` actuel ; onglet Structure = `Explorer`.
- [x] 3.2 Vérifier le comportement avec la sidebar gauche repliée (onglets masqués avec le contenu, pas de régression du bouton collapse).

## 4. Validation

- [x] 4.1 Page avec imbrication (ex. `NodeRoot` → `NodeFlex` → `NodeText`) : clic arbre → settings visibles ; clic canevas → entrée arbre active.
- [x] 4.2 Page avec `NodeGrid` multi-cellules : enfants visibles sous la zone correcte dans l’arbre.
- [x] 4.3 Aucune régression sur la bibliothèque de blocs, le DnD et la sauvegarde du JSON.
