# Change : visibilité des cellules NodeGrid en prévisualisation mobile/tablette

## Why

Lors du basculement du mode **édition** vers le mode **prévisualisation** avec un breakpoint **mobile** ou **tablette** actif, certains éléments déposés dans une grille `NodeGrid` disparaissent.

La cause est que le composant `View` de `NodeGrid` applique en prévisualisation la même logique qu'en édition : il ne rend que `colonnes × lignes` cellules correspondant au breakpoint sélectionné. Or le contenu est stocké dans des zones `cell-{row}-{col}` indexées sur la structure **desktop**. Lorsque le nombre de cellules diffère entre breakpoints (ex. desktop 2×2, mobile 1×1), les zones hors grille mobile/tablette ne sont pas montées et leur contenu devient invisible.

En mode **view** (page publique), le rendu utilise déjà la structure desktop complète avec une grille responsive — comportement attendu pour la prévisualisation WYSIWYG.

## What Changes

- Aligner le rendu **prévisualisation** de `NodeGrid` sur le principe du rendu public : toutes les zones desktop sont rendues ; seul le **nombre de colonnes** du breakpoint sélectionné pilote la disposition.
- Conserver le rendu **édition** actuel (grille figée sur les dimensions du breakpoint) pour faciliter le dépôt dans les cellules du breakpoint courant.
- Documenter le comportement attendu dans la spec `page-builder` (nouvelle exigence NodeGrid).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeGrid/View.tsx` (branche preview)
  - Éventuellement factorisation partagée avec la logique view déjà présente dans le même fichier
