## Why

En mode édition, le menu de bloc (`NodeMenu`) est rendu **au-dessus** du contenu du nœud dans le flux normal du document. Il occupe une hauteur minimale fixe (`--node-menu-height: 2.25rem`) et pousse le contenu vers le bas. Ce décalage crée un écart visuel entre l'édition et la prévisualisation, et provoque des débordements notamment pour les **enfants de `NodeFlex`** (alignement flex, wrap, hauteurs contraintes) qui ne se produisent pas en prévisualisation où le menu est absent.

## What Changes

- Repositionner le `NodeMenu` en **overlay flottant** en haut à gauche du conteneur du nœud sélectionné, sans occuper d'espace dans le flux de mise en page.
- Le menu reste **visible uniquement** lorsque le nœud est sélectionné (comportement inchangé sur ce point).
- Le menu SHALL rester **toujours visible** au-dessus du contenu du bloc (z-index, fond opaque) même dans des conteneurs flex compacts ou à hauteur contrainte.
- Le **drag-and-drop** des nœuds (poignée grip via `handleRef` de `@dnd-kit`) SHALL rester fonctionnel et fluide : le menu flottant ne doit pas bloquer les dropzones ni perturber le déplacement.
- Ajuster les styles du wrapper d'édition (`NodeBuilderComponent`) pour que le contenu occupe la même emprise qu'en prévisualisation (pas de réserve de hauteur pour le menu).
- Retirer ou adapter la variable CSS `--node-menu-height` si elle n'est plus nécessaire au layout.

## Capabilities

### New Capabilities

_Aucune nouvelle capacité — changement limité à l'UX d'édition du builder existant._

### Modified Capabilities

- `page-builder` : mise à jour du requirement « Menu de bloc visible à la sélection uniquement » pour préciser le positionnement flottant (overlay top-left, hors flux) et l'absence d'impact sur la mise en page du contenu ; ajout de scénarios couvrant `NodeFlex` et le drag-and-drop.

## Impact

- **Frontend** : `assets/editeur/ManagerNode/components/NodeComponent.tsx`, `NodeMenu.tsx`, éventuellement `NodeChild.tsx` si le menu est aussi concerné pour les enfants flex.
- **CSS** : `assets/editeur/assets/css/builder.css` (variable `--node-menu-height`, styles du wrapper d'édition).
- **Specs** : delta `openspec/changes/floating-node-menu/specs/page-builder/spec.md`.
- **Hors scope** : prévisualisation, export HTML, API backend — aucun changement fonctionnel attendu.
