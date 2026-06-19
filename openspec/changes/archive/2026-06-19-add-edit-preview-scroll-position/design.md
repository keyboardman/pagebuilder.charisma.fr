## Context

Le builder expose deux modes dans `Builder.tsx` : **édition** (`APP_MODE.EDIT`) et **prévisualisation** (`APP_MODE.PREVIEW`). Le canevas (`Layout.Canvas` → `.admin-layout__main`) reste monté dans les deux cas ; seules les sidebars et le type de composant rendu par nœud changent.

Le défilement vertical est confiné à `.admin-layout__main` en prévisualisation (exigence existante pour le standalone). En édition, le même élément porte `overflow-y-auto` via `Canvas.tsx`.

## Goals / Non-Goals

- Goals :
  - Conserver la région de contenu visible lors d’un bascule édition ↔ prévisualisation **ou** mobile / tablette / bureau.
  - Solution légère, sans nouvelle dépendance.
  - Compatible standalone et embarqué.
- Non-Goals :
  - Synchroniser le défilement avec l’explorateur de composants au-delà du comportement actuel.
  - Modifier le rendu public (`APP_MODE.VIEW`).

## Decisions

- **Décision : ancrage sur le nœud visible au centre du canevas**  
  Avant chaque bascule (mode ou breakpoint), enregistrer l’`id` du nœud le plus proche du centre du viewport (`data-ce-id`), via `elementFromPoint` puis recherche du parent porteur d’identifiant. Après le rendu, recentrer ce nœud dans le canevas.  
  **Pourquoi :** le changement de breakpoint modifie fortement la largeur et la hauteur du contenu ; un ratio de défilement ne garantit pas la même zone visible. L’ancrage par nœud reste stable entre mobile, tablette et bureau.

- **Fallback : ratio de défilement**  
  Si aucun nœud n’est détectable (page vide), conserver le ratio comme solution de repli.

- **Décision : bidirectionnel (édition → prévisualisation et inverse)**  
  Même mécanisme dans les deux sens pour une expérience cohérente.

- **Restauration différée après repositionnement du layout**  
  Pour le breakpoint : attendre la fin de la transition de largeur (`max-width`, 500 ms), puis surveiller la stabilité du layout (largeur + hauteur du contenu via `ResizeObserver` et frames consécutives stables) avant de scroller une seule fois. Pour le mode : attendre la stabilisation du layout (sidebars, grille) de la même façon.

## Risks / Trade-offs

- Légère variation visuelle possible si le nœud ancré change de hauteur entre Edit et View (dropzones) — l’ancrage recentre le nœud, pas un pixel exact.
- Interaction avec `scrollCanvasToNode` en mode édition : la restauration post-bascule ne doit pas s’exécuter lors d’un simple changement de sélection.

## Open Questions

- Aucune pour l’instant ; valider manuellement sur une page longue avec plusieurs conteneurs et dropzones.
