# Change : renommage inline dans l’explorateur

## Why

Sur des pages avec de nombreux blocs du même type (ex. plusieurs `NodeFlex`, `NodeText`), repérer un composant précis dans l’onglet **Structure** repose aujourd’hui sur le libellé de type seul. Le champ `editorLabel` (« Nom dans l’éditeur ») existe déjà dans **NodeSettings**, mais l’utilisateur doit sélectionner le nœud puis ouvrir le panneau de réglages pour le renommer. Un **double-clic** sur une entrée de l’explorateur pour éditer le nom sur place accélère l’organisation de la structure sans quitter l’arbre.

## What Changes

- Dans le navigateur de composants (onglet **Structure**), un **double-clic** sur le libellé d’une entrée ouvre une édition **inline** du nom du nœud.
- La valeur éditée correspond au champ `editorLabel` déjà persisté dans le JSON de la page (même sémantique que **NodeSettings** → « Nom dans l’éditeur »).
- **Entrée** ou perte de focus (**blur**) valide le nom ; **Échap** annule sans modifier.
- Une valeur vide supprime `editorLabel` : l’entrée retrouve le libellé par défaut (type de nœud ou libellé de contenu le cas échéant).
- Lorsqu’un nom personnalisé est défini, l’explorateur affiche ce nom en priorité et conserve l’indication du type entre parenthèses (comportement déjà en place dans `ExplorerRow`).
- Un simple **clic** conserve le comportement actuel : sélection du nœud (pas d’ouverture de l’édition).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerExplorer/components/ExplorerRow.tsx` (double-clic, champ inline)
  - `assets/editeur/ManagerExplorer/Explorer.tsx` ou `ExplorerTreeNode.tsx` (propagation de `updateNode` si nécessaire)
  - Réutilisation de `updateNode` (`BuilderContext`) et des utilitaires `getNodeDisplayLabel` / `getNodeTypeLabel` (`utils/nodeLabel.ts`)
  - Aucun changement de schéma JSON : `editorLabel` est déjà supporté sur `NodeType`
