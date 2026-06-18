# Change : conserver la position de défilement entre édition et prévisualisation

## Why

Lors du basculement du mode **édition** vers le mode **prévisualisation**, le canevas remonte en haut de page. L’utilisateur perd le contexte visuel de la section qu’il était en train de travailler ou de vérifier, ce qui l’oblige à redéfiler manuellement sur les pages longues.

Les deux modes partagent déjà le même conteneur de défilement (`.admin-layout__main`), mais le changement de layout (grille avec sidebars → colonne sans sidebars) et le passage des composants `Edit` aux composants `View` (disparition des dropzones et du chrome d’édition) modifient la hauteur du contenu et peuvent réinitialiser ou décaler la position de lecture.

## What Changes

- Mémoriser la position de lecture du canevas **avant** chaque bascule entre édition et prévisualisation.
- Restaurer cette position **après** le rendu du nouveau mode, de façon à ce que la même région de contenu reste visible.
- Utiliser une stratégie robuste à la variation de hauteur du contenu (ratio de défilement ou ancrage sur un nœud visible) plutôt qu’un simple `scrollTop` brut si nécessaire.
- Couvrir les contextes **standalone** (`pageBuilderStandalone.jsx`) et **embarqué** (formulaire d’édition de page).
- Ne pas modifier le comportement existant de `scrollCanvasToNode` lors de la sélection d’un nœud en mode édition.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/app/builder/Builder.tsx` (capture / restauration au changement de mode)
  - `assets/editeur/ManagerExplorer/utils/scrollCanvasToNode.ts` ou nouvel utilitaire dédié sous `ManagerExplorer/utils/` (lecture / restauration de la position du canevas)
  - Éventuellement `assets/editeur/app/layout/Canvas.tsx` (ref du conteneur de défilement)
