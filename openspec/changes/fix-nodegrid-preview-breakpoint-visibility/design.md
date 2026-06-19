## Context

`NodeGrid` expose un layout par breakpoint (`desktop`, `tablet`, `mobile`) avec un nombre de colonnes et de lignes configurable indépendamment. Les enfants sont rangés dans des zones nommées `cell-{row}-{col}`.

Le composant `NodeComponent` utilise :
- `Edit` en mode **édition**
- `View` en modes **prévisualisation** et **view**

Dans `View.tsx`, la condition `mode === APP_MODE.VIEW` active un rendu « public » (toutes les zones desktop + classes Tailwind responsive `grid-cols-*`, `sm:grid-cols-*`, `lg:grid-cols-*`). Tous les autres modes — dont **preview** — tombent dans la branche « grille figée » qui limite le nombre de cellules au produit `colonnes × lignes` du breakpoint sélectionné.

Le panneau de réglages affiche déjà un avertissement lorsque le nombre de cellules diffère entre breakpoints, mais la prévisualisation ne reflète pas le rendu final.

## Goals / Non-Goals

- Goals :
  - En prévisualisation, aucun enfant d'une zone desktop existante ne doit disparaître lors d'un changement de breakpoint.
  - La prévisualisation doit refléter la refonte en colonnes du breakpoint sélectionné (cohérent avec le sélecteur du builder et le canevas contraint `max-w-sm` / `max-w-lg`).
  - Le rendu public (`view`) reste inchangé.
- Non-Goals :
  - Repenser le modèle de zones multiples par breakpoint (migration de contenu entre grilles de tailles différentes).
  - Modifier le comportement d'édition (grille réduite au breakpoint courant).
  - Introduire des container queries ou une refonte CSS globale du builder.

## Decisions

- **Décision** : En mode `preview`, `NodeGrid` SHALL rendre toutes les zones de la structure desktop (`rows(desktop) × cols(desktop)`) et appliquer uniquement `GRID_COLS[cols(layout, breakpoint)]` pour le nombre de colonnes — sans tronquer par `rows(breakpoint)`.
- **Alternatives considérées** :
  - Réutiliser les classes responsive `sm:` / `lg:` en preview → rejeté : le viewport du navigateur reste large alors que le canevas est contraint ; les media queries Tailwind ne correspondent pas au breakpoint sélectionné (problème déjà contourné par `NodeVideoHome` via des classes explicites par breakpoint).
  - Unifier édition et preview sur la structure desktop → rejeté : complique le dépôt ciblé par breakpoint en édition.
- **Décision** : Les identifiants de zone restent ancrés sur la grille desktop ; les dimensions `rows` des breakpoints tablette/mobile n'affectent que l'édition, pas la preview ni le view.

## Risks / Trade-offs

- **Reflow visuel** : avec moins de colonnes en mobile, les cellules desktop s'empilent ; l'ordre suit l'ordre DOM (row-major), ce qui est cohérent avec le rendu public.
- **Cellules vides** : si l'utilisateur a configuré plus de lignes en mobile qu'en desktop en édition, ces cellules supplémentaires n'existent pas en preview — comportement existant, hors scope.

## Migration Plan

Correction front-end uniquement, sans migration de données. Les pages existantes avec contenu dans des zones desktop retrouveront leur contenu en preview mobile/tablette.

## Open Questions

- Faut-il, à terme, harmoniser `NodeTwoColumns` / `NodeVideoHome` pour que la preview utilise aussi la structure complète là où des zones pourraient être masquées ? (hors scope de ce change)
