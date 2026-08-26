## 1. Modèle de données et helpers

- [x] 1.1 Étendre `NodeGridLayout` dans `layoutHelpers.ts` avec `spans?: Record<zoneId, { desktop?: CellSpan; tablet?: CellSpan; mobile?: CellSpan }>` et type `CellSpan`
- [x] 1.2 Ajouter helpers : `getSpan`, `clampSpan`, `getCellSpanClassesForView`, `getCellSpanClassForBreakpoint`
- [x] 1.3 Ajouter les maps de classes Tailwind littérales `col-span` / `row-span` (+ `sm:` / `lg:`) pour le JIT (pattern `NodeTwoColumns`)
- [x] 1.4 Exporter les nouveaux types/helpers depuis `NodeGrid/index.ts` si nécessaire

## 2. Rendu View

- [x] 2.1 Dans `View.tsx` (branche view), appliquer les classes de span responsive sur chaque wrapper de zone visible
- [x] 2.2 Dans `View.tsx` (branche edit/preview), appliquer le span du breakpoint toolbar uniquement
- [x] 2.3 Vérifier que la visibilité reste index-based (`cellCount`) et indépendante des spans

## 3. Settings UI

- [x] 3.1 Ajouter dans `Settings.tsx` une section pour éditer `colSpan` / `rowSpan` par zone desktop et par breakpoint
- [x] 3.2 Brancher `onChange` pour écrire `layout.spans` avec clamp 1…dimensions du BP
- [x] 3.3 Gérer l’absence de `spans` (défaut implicite `1×1`)

## 4. Tests

- [x] 4.1 Étendre `layoutHelpers` / `index.test.ts` : clamp, classes view vs breakpoint, défaut sans spans
- [x] 4.2 Couvrir le cas « zone hors cellCount masquée » + span sur une zone visible n’affecte pas la visibilité des autres

## 5. Vérification manuelle

- [x] 5.1 Grille existante sans spans : rendu inchangé en edit / preview / view
- [x] 5.2 Desktop colSpan=2, mobile colSpan=1 : bascule breakpoint OK
- [x] 5.3 Réduction mobile `cellCount` : zones excédentaires masquées, contenu conservé
- [x] 5.4 colSpan configuré > columns(bp) : clamp effectif au rendu
