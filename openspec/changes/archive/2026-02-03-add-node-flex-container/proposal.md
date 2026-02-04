# Change: Ajouter le conteneur Flex (NodeFlex)

## Why

Le builder dispose déjà de conteneurs (NodeContainer, NodeGrid, NodeTwoColumns) mais aucun n’expose les propriétés CSS Flexbox pour aligner les enfants (direction, justification, alignement, gap, wrap). Un conteneur **NodeFlex** permet d’aligner les composants enfants via ces propriétés flex, sans dépendre d’une grille à cellules fixes.

## What Changes

- Ajout d’un type de nœud **NodeFlex** (`node-flex`) dans le builder :
  - Conteneur droppable (zone unique type NodeContainer) dont les enfants sont disposés en flex.
  - Propriétés flex configurables dans les paramètres du nœud : direction (row/column/row-reverse/column-reverse), justify-content, align-items, gap, flex-wrap.
- Enregistrement de NodeFlex dans le registre des nœuds et dans le panneau des composants (catégorie container).
- Rendu : le conteneur applique les options flex en style inline ou classes pour que l’alignement soit visible en édition et en preview.

## Impact

- **Specs impactées** : `page-builder`
- **Code impacté** : `assets/editeur2/ManagerNode/` (nouveau dossier NodeFlex, `NodeRegistry.ts`, éventuellement `PanelButtons` si catégorisation), sérialisation HTML du builder si elle dépend des types de nœuds
