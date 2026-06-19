# Change : canevas d’édition WYSIWYG pour tout le builder

## Why

En mode **édition**, le builder affiche des composants `Edit` distincts des composants `View` utilisés en **prévisualisation** : bordures de blocs, grilles tronquées (`NodeGrid`), `flex-wrap` forcé (`NodeFlex`), édition inline (`NodeText`, `NodeButton`), etc. Cela crée un **saut visuel** au basculement édition ↔ prévisualisation et complique la mise en page.

Le **navigateur de composants** (Explorer) permet désormais de sélectionner n’importe quel nœud. L’objectif est un canevas **WYSIWYG** : en mode édition, tous les nœuds SHALL se rendre comme en prévisualisation, avec un chrome d’édition discret (menu à la sélection, bordure au survol, dropzones et drag-and-drop conservés).

## What Changes

- En mode **édition**, le canevas SHALL utiliser les composants **`view`** de chaque type de nœud (même rendu qu’en prévisualisation), au lieu des composants `edit`.
- Le **menu de bloc** (`NodeMenu`) SHALL n’être affiché que lorsque le nœud est **sélectionné** (via l’Explorer ou clic sur le conteneur).
- Le conteneur d’un bloc éditable SHALL afficher une **bordure de couleur différente au survol** pour signaler la zone interactive.
- Les **zones de dépôt** et le **glisser-déposer** restent actifs en édition (sans altérer le rendu visuel des nœuds).
- **BREAKING** : l’édition inline sur le canevas (`NodeText`, `NodeButton`, `NodeTextIcon`, etc.) est remplacée par l’édition via **NodeSettings** (panneau droit) ou modale existante (`NodeRichText`).
- Le toggle global **Édition / Prévisualisation** est conservé : la prévisualisation masque le chrome d’édition (menus, dropzones, bordures de survol).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/components/NodeComponent.tsx`
  - `assets/editeur/ManagerNode/components/NodeChild.tsx`
  - `assets/editeur/ManagerNode/components/NodeMenu.tsx`
  - Composants `View.tsx` des nœuds conteneurs (logique dropzone en mode édition : `NodeFlex`, `NodeNav`, `NodeGrid`, etc.)
  - `NodeText/Settings.tsx`, `NodeButton/Settings.tsx`, `NodeTextIcon/Settings.tsx` (champs de contenu)
  - Composants `Edit.tsx` (devenus obsolètes sur le canevas ou supprimés)
