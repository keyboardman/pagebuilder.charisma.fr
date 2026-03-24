# Design: Menu NodeNav / NodeNavItem

## Context

Le builder dispose déjà de conteneurs (NodeFlex, NodeContainer, NodeGrid) et de nœuds de contenu (NodeButton, NodeImage, etc.). Aucun conteneur n’impose aujourd’hui une restriction sur le type des enfants. Le besoin est un **menu de navigation** en deux blocs : un conteneur (NodeNav) et des items (NodeNavItem) avec types lien, image, bouton.

## Goals / Non-Goals

- **Goals** : Conteneur NodeNav avec options direction (horizontal/vertical) et icône burger ; NodeNavItem avec types lien, image, bouton ; restriction stricte « NodeNav n’accepte que NodeNavItem ».
- **Non-Goals** : Sous-menus imbriqués (niveau 2), méga-menu, gestion de rôles/permissions dans le menu.

## Decisions

- **Restriction des enfants** : NodeNav est le seul parent autorisé pour NodeNavItem au sens « le builder n’accepte le drop d’un NodeNavItem que dans un NodeNav ». Inversement, dans un NodeNav on n’accepte que le drop de NodeNavItem (pas d’autres types). Implémentation : soit via `accept` / `data` dans useDroppable/useDraggable (ex. accepter uniquement `add-block` avec `type: "node-nav-item"` quand la cible est un NodeNav), soit en filtrant les blocs proposés dans le panneau lorsqu’un NodeNav est sélectionné (ou les deux).
- **Icône burger** : Option booléenne sur NodeNav. Quand activée, afficher une icône « burger » qui, au clic (ou au tap), recense / affiche tous les NodeNavItem (ex. liste verticale ou overlay). En mode édition, le comportement peut être simulé (toggle ouvert/fermé) ; en prévisualisation/rendu, comportement responsive classique (burger visible sur petit écran, items visibles selon état ouvert/fermé).
- **NodeNavItem types** : Trois types explicites — **link** (href, target), **image** (src, alt, optionnel href pour lien autour de l’image), **button** (label, type button ou submit). Pas de type « separator » ou « dropdown » dans cette première version.
- **Catégories** : NodeNav en catégorie « container » ; NodeNavItem peut être en « content » ou dans une catégorie « nav » si le panneau est adapté pour afficher « Nav » et éviter de mélanger avec les autres contenus. Alternative : NodeNavItem n’apparaît que lorsqu’on ajoute depuis l’intérieur d’un NodeNav (bouton « Ajouter un item » dans le conteneur).

## Risks / Trade-offs

- **Restriction stricte** : Nécessite d’étendre la logique DnD ou le panneau pour gérer « parent autorisé ». Risque : complexité plus élevée si le builder ne gère pas aujourd’hui de restriction par type de parent. Mitigation : implémenter d’abord la restriction au drop (refuser le drop si parent est NodeNav et type déposé ≠ NodeNavItem, et inversement).
- **Burger** : Comportement JS (ouvert/fermé) à implémenter en View/Edit et en rendu final. Mitigation : garder une API d’options simple (showBurger: boolean, breakpoint optionnel plus tard).

## Migration Plan

- Aucune migration de données : nouveaux types de nœuds uniquement. Les pages existantes restent inchangées.

## Open Questions

- Préférer une catégorie dédiée « Nav » dans le panneau pour NodeNav + NodeNavItem, ou afficher NodeNavItem uniquement lorsqu’on édite un NodeNav ?
