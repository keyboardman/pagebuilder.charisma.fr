## 1. État et layout

- [x] 1.1 Ajouter `sidebarRightCollapsed` / `setSidebarRightCollapsed` dans `BuilderProvider` et `BuilderType`.
- [x] 1.2 Étendre `builder.css` : modificateurs `admin-layout--sidebar-left-collapsed`, `admin-layout--sidebar-right-collapsed`, classe `admin-layout__right--collapsed` ; migrer l’usage de `admin-layout--sidebar-collapsed`.
- [x] 1.3 Appliquer les classes de layout combinables dans `Builder.tsx` selon l’état des deux sidebars.

## 2. Composant SidebarRight

- [x] 2.1 Ajouter les props `collapsed` et `onToggle` à `SidebarRight.tsx`, sur le modèle de `SidebarLeft.tsx` (masquage du contenu, bouton flottant, tooltip « Masquer / Afficher les réglages »).
- [x] 2.2 Brancher `SidebarRight` dans `Builder.tsx` avec l’état et le handler de bascule.

## 3. Validation

- [x] 3.1 Vérifier le repli/dépli du panneau droit seul : le canevas s’élargit, NodeSettings est masqué, le bouton toggle reste accessible.
- [x] 3.2 Vérifier les combinaisons : gauche seule, droite seule, les deux repliés ; pas de régression du panneau gauche existant.
- [x] 3.3 Vérifier qu’une sélection depuis l’Explorer ou le canevas fonctionne avec le panneau droit replié ; après dépli, NodeSettings affiche le nœud sélectionné.
- [x] 3.4 Vérifier l’absence de saut de scroll notable lors du repli/dépli sur une page longue.
