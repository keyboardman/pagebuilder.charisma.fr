## Context

Le changement `update-builder-edit-canvas-wysiwyg` a unifié le rendu édition/prévisualisation en utilisant les composants `View` sur le canevas. Les composants `Edit` (`NodeText/Edit.tsx`, `NodeButton/Edit.tsx`, etc.) implémentaient l'édition inline via `contentEditable` lorsque le nœud était sélectionné, mais ne sont plus montés sur le canevas.

## Goals / Non-Goals

- Goals:
  - Restaurer l'édition inline à la sélection pour les nœuds texte courts.
  - Conserver le rendu WYSIWYG hors sélection et entre édition/prévisualisation.
  - Réutiliser `InputEditor` et `TagNameEditable` déjà éprouvés.
- Non-Goals:
  - Réintroduire les composants `Edit` complets sur le canevas (bordures, layouts divergents).
  - Modifier le flux `NodeRichText` (modale).
  - Édition inline sur les nœuds non sélectionnés ou en mode prévisualisation.

## Decisions

- **Édition conditionnelle dans `View`** : lorsque `mode === edit` et `isSelected()`, le composant `View` bascule vers l'éditeur inline (`InputEditor` / `TagNameEditable`) en conservant les mêmes classes, balises et styles que le rendu final. Hors sélection, le rendu reste identique à la prévisualisation.
- **Accès au contexte builder** : les `View` concernés consomment `useNodeBuilderContext()` (déjà disponible via `NodeBuilderProvider` en mode édition) pour `isSelected`, `onChange`.
- **Interaction avec la sélection** : un clic dans la zone `contentEditable` ne SHALL pas désélectionner le nœud ; la propagation est stoppée sur la zone éditable.
- **NodeSettings conservé** : le panneau droit reste une alternative ; les deux canaux modifient le même champ de contenu.

## Risks / Trade-offs

- **Focus vs sélection** → stopper la propagation des clics sur la zone éditable ; conserver le blur comme déclencheur de persistance.
- **Liens en mode édition** → conserver la neutralisation de navigation (`preventDefault`) sur les liens/boutons éditables, conformément à l'exigence « Liens inactifs en mode édition du canevas ».

## Migration Plan

- Implémenter la bascule sélection → inline dans les `View` texte.
- Les composants `Edit` peuvent rester pour compatibilité registre mais ne sont plus montés sur le canevas.
- Rollback : retirer la branche inline des `View` ; le comportement revient à l'édition exclusive via NodeSettings.
