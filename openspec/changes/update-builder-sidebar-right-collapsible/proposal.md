# Change : panneau droit rétractable dans le builder

## Why

Le builder dispose déjà d’un panneau gauche rétractable (bibliothèque de blocs / structure), mais le panneau droit (**NodeSettings**) reste toujours visible en mode édition. Cela réduit l’espace du canevas et accentue l’écart visuel avec le mode **prévisualisation**, où aucun panneau latéral n’est affiché.

Pour rapprocher l’expérience d’édition du mode preview tout en conservant l’accès aux réglages, le panneau droit SHALL être rétractable de la même manière que le panneau gauche.

## What Changes

- Le panneau droit (**NodeSettings**) SHALL être **repliable / dépliable** via un bouton de bascule, sur le même modèle que `SidebarLeft` (transition CSS, bouton flottant, tooltip).
- L’état replié SHALL libérer la colonne droite de la grille du layout (`admin-layout`) afin d’agrandir le canevas.
- Les deux panneaux (gauche et droit) SHALL pouvoir être repliés **indépendamment** ; lorsque les deux sont repliés, le canevas SHALL occuper toute la largeur disponible entre le header et le footer.
- La sélection d’un nœud (canevas ou Explorer) SHALL rester fonctionnelle lorsque le panneau droit est replié ; l’utilisateur peut le rouvrir pour éditer les réglages.
- La conservation de la position de défilement lors du repli/dépli (layout) SHALL rester stable, conformément au mécanisme existant d’ancrage de lecture.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/app/layout/SidebarRight.tsx`
  - `assets/editeur/app/builder/Builder.tsx`
  - `assets/editeur/assets/css/builder.css`
  - `assets/editeur/services/providers/BuilderProvider.tsx`
  - `assets/editeur/types/BuilderType.ts`
