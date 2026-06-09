# Change : navigateur de composants en arbre

## Why

Sur des pages riches en blocs imbriqués (grilles, flex, formulaires, menus), repérer et sélectionner un nœud précis dans le canevas est difficile. Le builder dispose déjà d’un panneau de réglages (`NodeSettings`) et d’un état de sélection (`selected` / `setSelected`), mais aucun moyen structuré de parcourir la hiérarchie des nœuds comme dans un arbre DOM.

Un brouillon `Explorer.tsx` existe dans le dépôt mais n’est pas intégré au layout et utilise un identifiant de nœud racine codé en dur.

## What Changes

- Ajouter un **navigateur de composants** (arbre hiérarchique des nœuds) visible en mode édition, intégré à la sidebar gauche via des onglets **Blocs** / **Structure**.
- Afficher l’arbre à partir du nœud racine (`node-root`) et de la structure parent/enfant des `NodesType`, y compris les enfants répartis dans plusieurs zones de dépôt (ex. cellules `NodeGrid`).
- Chaque entrée affiche le **libellé** du type de nœud (registre `NodeRegistry`, ex. « Flex », « Text ») et permet de **plier/déplier** les conteneurs.
- Un **clic** sur une entrée de l’arbre appelle `setSelected(nodeId)` : le nœud est activé dans le canevas et le panneau **NodeSettings** (sidebar droite) affiche ses réglages.
- La sélection effectuée **depuis le canevas** est reflétée dans l’arbre (surbrillance de l’entrée active, ancêtres dépliés, défilement vers l’entrée si nécessaire).
- Finaliser / remplacer le stub `assets/editeur/app/layout/Explorer.tsx` (suppression du `console.log`, de l’ID racine codé en dur).

## Impact

- Specs : `page-builder` (nouvelle exigence **Navigateur de composants en arbre**).
- Code : `assets/editeur/app/layout/Explorer.tsx`, `assets/editeur/app/builder/Builder.tsx` (intégration onglets sidebar gauche), réutilisation de `BuilderContext` (`selected`, `setSelected`, `nodeSelected`) et de `AppContext` (`nodes`, `getChildren` / filtrage multi-zones).
