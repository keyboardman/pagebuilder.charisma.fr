## Context

Le builder expose deux modes dans `Builder.tsx` : **édition** (`APP_MODE.EDIT`) et **prévisualisation** (`APP_MODE.PREVIEW`). Le canevas (`Layout.Canvas` → `.admin-layout__main`) reste monté dans les deux cas ; seules les sidebars et le type de composant rendu par nœud changent.

Le défilement vertical est confiné à `.admin-layout__main` en prévisualisation (exigence existante pour le standalone). En édition, le même élément porte `overflow-y-auto` via `Canvas.tsx`.

## Goals / Non-Goals

- Goals :
  - Conserver la région de contenu visible lors d’un bascule édition ↔ prévisualisation.
  - Solution légère, sans nouvelle dépendance.
  - Compatible standalone et embarqué.
- Non-Goals :
  - Conserver la position lors d’un changement de **breakpoint** (mobile / tablette / bureau).
  - Synchroniser le défilement avec l’explorateur de composants au-delà du comportement actuel.
  - Modifier le rendu public (`APP_MODE.VIEW`).

## Decisions

- **Décision : restaurer via le ratio de défilement du canevas**  
  Avant le basculement, enregistrer `scrollTop / max(1, scrollHeight - clientHeight)`. Après le rendu du nouveau mode (`useLayoutEffect` sur `mode`), réappliquer ce ratio sur `.admin-layout__main`.  
  **Pourquoi :** la disparition des dropzones et du chrome d’édition en prévisualisation change la hauteur totale du contenu ; un `scrollTop` absolu ne garantit pas la même zone visible, alors qu’un ratio reste stable dans la majorité des cas.

- **Alternative considérée : ancrage sur un nœud (`data-ce-id`) au centre du viewport**  
  Plus précis lorsque la structure DOM change fortement, mais plus coûteux et fragile si le nœud ancré n’est pas rendu de la même façon entre Edit et View. Retenu en secours si le ratio s’avère insuffisant en tests manuels.

- **Décision : bidirectionnel (édition → prévisualisation et inverse)**  
  Même mécanisme dans les deux sens pour une expérience cohérente.

## Risks / Trade-offs

- Légère variation visuelle possible si la hauteur du contenu diffère beaucoup entre Edit et View (ex. dropzones nombreuses) → le ratio minimise l’écart ; affiner avec ancrage si besoin.
- Interaction avec `scrollCanvasToNode` en mode édition : la restauration post-bascule ne doit pas s’exécuter lors d’un simple changement de sélection ; limiter l’effet de restauration au changement de `mode` uniquement.

## Open Questions

- Aucune pour l’instant ; valider manuellement sur une page longue avec plusieurs conteneurs et dropzones.
