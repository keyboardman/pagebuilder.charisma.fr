## Why

`NodeGrid` permet déjà de configurer indépendamment le nombre de colonnes et de lignes par breakpoint, mais chaque zone occupe toujours exactement une case CSS Grid. Les auteurs ont besoin d’exceptions **colspan** / **rowspan** par cellule et par breakpoint (ex. un bloc hero qui prend 2 colonnes en desktop et 1 en mobile), sans changer le modèle de zones (identifiants opaques + ordre dérivé des settings).

## What Changes

- Étendre le layout `NodeGrid` pour stocker, par zone et par breakpoint (**desktop**, **tablette**, **mobile**), un `colSpan` et un `rowSpan` (défaut `1×1`).
- Appliquer ces spans au rendu CSS Grid :
  - mode **view** : classes Tailwind responsive (`col-span-*`, `sm:col-span-*`, `lg:col-span-*`, équivalent `row-span`) ;
  - modes **édition** / **prévisualisation** : span du breakpoint sélectionné dans la barre d’outils (classes non responsive, comme `grid-cols` aujourd’hui).
- Exposer la configuration des spans dans le panneau Settings de `NodeGrid` (par zone, pour chaque breakpoint).
- Clarifier dans la spec que les zones sont des **identifiants opaques** (aujourd’hui `cell-{row}-{col}`, sémantiquement équivalents à `zone-N`) : l’ordre vient des settings ; une zone hors `columns × rows` du breakpoint est **masquée**, son contenu est conservé.
- Le span d’une zone **ne masque pas** les autres zones : le placement reste l’auto-flow CSS Grid.
- Clamp : `colSpan` / `rowSpan` effectifs plafonnés aux dimensions du breakpoint courant.
- Pas de **BREAKING** : les grilles existantes sans spans restent en `1×1` partout.

## Capabilities

### New Capabilities

_(aucune — comportement rattaché à la capacité page-builder existante)_

### Modified Capabilities

- `page-builder`: étendre l’exigence **Grille responsive NodeGrid** avec spans par zone × breakpoint, modèle de zones opaques, et règles de visibilité / clamp.

## Impact

- Front builder : `assets/editeur/ManagerNode/NodeGrid/` (`layoutHelpers.ts`, `View.tsx`, `Settings.tsx`, `index.ts`, tests).
- Pattern de référence : tables de classes Tailwind explicites comme `NodeTwoColumns/layout.ts` (JIT).
- Données : `attributes.layout` des nœuds `node-grid` (rétrocompatible).
- Spec : `openspec/specs/page-builder/spec.md` (exigence NodeGrid).
- Pas d’impact backend / API / médias.
