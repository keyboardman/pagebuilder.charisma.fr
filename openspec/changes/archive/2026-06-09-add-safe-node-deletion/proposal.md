# Change : suppression sécurisée des nœuds et nettoyage des orphelins

## Why

Lors de la suppression d’un nœud dans le builder, aucune confirmation n’est demandée : un clic accidentel sur l’icône poubelle supprime immédiatement le bloc. Par ailleurs, des **nœuds orphelins** peuvent subsister dans le JSON persisté : enfants dont le parent a disparu, ou nœuds d’un **type retiré du registre** (`NodeRegistry`) qui ne sont plus rendus ni supprimables depuis l’interface (le composant renvoie une vue vide).

Ces données fantômes alourdissent le JSON, faussent l’explorateur de composants et peuvent provoquer des comportements incohérents en édition et en prévisualisation.

## What Changes

- Afficher une **modale de confirmation** avant toute suppression manuelle d’un nœud (menu du canevas, et tout autre point d’entrée `onDelete` / `removeNode` utilisateur).
- Indiquer dans la modale si le nœud possède des **descendants** et préciser qu’ils seront supprimés avec lui.
- Garantir (et documenter) la **suppression récursive** du nœud ciblé et de tous ses descendants dans `NodesType`.
- Au **chargement** du contenu (parse JSON → `nodes`), **épurer automatiquement** :
  - les nœuds dont le `type` n’existe plus dans `NodeRegistry`, **avec tous leurs descendants** ;
  - les nœuds **orphelins** dont `parent.id` ne référence aucun nœud existant (hors racine `node-root`).
- Réindexer les ordres des frères restants après toute suppression ou épuration.

## Impact

- Specs : `page-builder` (confirmation de suppression, suppression récursive, nettoyage au chargement).
- Code : `assets/editeur/utils/nodeHelper.ts` (utilitaire d’épuration, comptage descendants), `assets/editeur/services/providers/AppProvider.tsx` (sanitisation au parse), `assets/editeur/services/providers/NodeBuilderProvider.tsx` ou `NodeMenu.tsx` (modale de confirmation), éventuellement `assets/editeur/ManagerExplorer/` si une action de suppression y est ajoutée ultérieurement.
