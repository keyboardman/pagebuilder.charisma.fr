## 1. Implémentation

- [x] 1.1 Dans `NodeGrid/View.tsx`, distinguer explicitement les trois modes : `view` (responsive viewport), `preview` (toutes zones desktop + colonnes du breakpoint sélectionné), `edit` (non concerné — composant `Edit.tsx`).
- [x] 1.2 Extraire si utile une fonction utilitaire partagée (ex. `buildDesktopCellZones(layout)`) pour éviter la duplication entre branches `view` et `preview`.
- [x] 1.3 Vérifier que le changement de breakpoint en preview conserve tous les enfants visibles (grille desktop 2×2, mobile 1 colonne : 4 blocs empilés).

## 2. Validation

- [x] 2.1 Manuel : page avec `NodeGrid` desktop 2×2 et contenu dans chaque cellule → bascule édition → preview → sélection mobile : les 4 éléments restent visibles.
- [x] 2.2 Manuel : même page avec layout mobile 1×1 configuré → preview mobile : contenu des cellules `cell-0-1`, `cell-1-0`, `cell-1-1` toujours visible (empilé).
- [x] 2.3 Manuel : rendu public (`view`) inchangé sur desktop, tablette et mobile réels.
- [x] 2.4 Manuel : mode édition avec breakpoint mobile — la grille éditable reste limitée aux dimensions mobile (comportement inchangé).
