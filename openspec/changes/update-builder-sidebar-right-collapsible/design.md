## Context

Le layout d’édition (`admin-layout[data-mode=edit]`) utilise une grille CSS à trois colonnes : sidebar gauche, canevas, sidebar droite. La sidebar gauche est déjà rétractable via `sidebarLeftCollapsed` et la classe `admin-layout--sidebar-collapsed`, qui force la première colonne à `0`.

La sidebar droite (`SidebarRight.tsx`) n’a pas encore de mécanisme équivalent.

## Goals / Non-Goals

- Goals :
  - Reproduire le comportement UX de la sidebar gauche (bouton toggle, animation 700 ms, contenu masqué quand replié).
  - Permettre de maximiser le canevas en repliant un ou les deux panneaux.
  - Conserver la sélection de nœud et l’accès aux réglages via dépli manuel.
- Non-Goals :
  - Persistance de l’état replié entre sessions (la sidebar gauche ne le fait pas non plus).
  - Ouverture automatique du panneau droit à chaque sélection de nœud.
  - Modification du mode prévisualisation (les sidebars restent masquées en preview).

## Decisions

- **Symétrie avec `SidebarLeft`** : étendre `SidebarRight` avec les props `collapsed` et `onToggle`, bouton flottant positionné sur le bord intérieur (à gauche du panneau), chevrons inversés (`ChevronRight` pour masquer, `ChevronLeft` pour afficher).
- **État React** : ajouter `sidebarRightCollapsed` / `setSidebarRightCollapsed` dans `BuilderProvider`, exposé via `BuilderContext`.
- **Grille CSS** : remplacer la classe unique `admin-layout--sidebar-collapsed` par des modificateurs combinables :
  - `admin-layout--sidebar-left-collapsed` → `grid-template-columns: 0 1fr var(--sizes-sidebarRightWidth)`
  - `admin-layout--sidebar-right-collapsed` → `grid-template-columns: var(--sizes-sidebarWidth) 1fr 0`
  - Les deux classes simultanément → `0 1fr 0`
  - Renommer ou conserver l’alias existant `admin-layout--sidebar-collapsed` pour la compatibilité gauche (migration vers le nouveau nom dans la même PR).
- **Classe CSS repliée** : ajouter `admin-layout__right--collapsed` (padding 0, largeur 0) miroir de `admin-layout__left--collapsed`.
- **Scroll** : le repli/dépli modifie la largeur du canevas ; le mécanisme d’ancrage existant (`captureCanvasScrollAnchor` / `scheduleCanvasScrollAnchorRestore`) couvre déjà la stabilisation du layout. Aucun changement fonctionnel requis, mais vérifier manuellement l’absence de saut visuel.

## Risks / Trade-offs

- **Réglages moins visibles** → l’utilisateur doit rouvrir le panneau ; mitigé par le bouton toggle toujours accessible et la sélection conservée.
- **Combinaison des deux classes CSS** → préférer des modificateurs explicites plutôt qu’une matrice de 4 classes ad hoc, pour la lisibilité.

## Open Questions

- _(aucune pour l’instant)_
