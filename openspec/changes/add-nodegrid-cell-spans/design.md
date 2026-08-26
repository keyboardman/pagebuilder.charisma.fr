## Context

`NodeGrid` organise ses enfants dans des zones de dépôt dont les IDs sont aujourd’hui générés sous la forme `cell-{row}-{col}` à partir de `rows(desktop) × cols(desktop)`. Ces chaînes ne sont **jamais parsées** pour le placement : elles servent uniquement de clé `parent.zone`. L’ordre de rendu est celui du tableau produit par Settings ; CSS Grid place ensuite les wrappers en auto-flow selon `grid-cols-*`.

Le layout stocke déjà, par breakpoint, `columns` et `rows`. La visibilité d’une zone au breakpoint `bp` est index-based : `index < columns(bp) × rows(bp)`. Au-delà, la zone est masquée (`hidden` / classes responsive en mode view) mais le contenu reste en data.

Il n’existe pas encore de `colSpan` / `rowSpan`. `NodeTwoColumns` montre le pattern de classes Tailwind explicites (`col-span-*`, `sm:col-span-*`, `lg:col-span-*`) requis par le JIT.

## Goals / Non-Goals

**Goals:**

- Permettre, pour chaque zone et chaque breakpoint, un `colSpan` et un `rowSpan` (défaut `1`).
- Appliquer ces valeurs au wrapper de zone en mode view (responsive) et en édition/preview (breakpoint toolbar).
- Garder zones = IDs opaques + ordre Settings ; span = propriété de rendu, sans masquer d’autres zones.
- Clamp des spans aux dimensions du breakpoint.
- UI Settings pour éditer les spans.
- Documenter le modèle (zones opaques, visibilité par `cellCount`) dans la spec page-builder.

**Non-Goals:**

- Renommer massivement `cell-*` → `zone-N` (migration optionnelle hors scope ; le modèle sémantique suffit).
- Placement explicite `grid-column-start` / adresse fixe avec gestion de collisions.
- Fusion de zones (merge) ou réordonnancement drag-and-drop des zones.
- Changer le modèle de dropzones / parent.zone.
- Introduire container queries.

## Decisions

### 1. Modèle de données — spans dans `layout`

Étendre `NodeGridLayout` :

```ts
type CellSpan = { col?: number; row?: number }; // défaut 1

interface NodeGridLayout {
  desktop?: { columns?: number; rows?: number };
  tablet?:  { columns?: number; rows?: number };
  mobile?:  { columns?: number; rows?: number };
  spans?: Record<string, {
    desktop?: CellSpan;
    tablet?: CellSpan;
    mobile?: CellSpan;
  }>;
}
```

- Clé = ID de zone (`cell-0-0`, etc.).
- Absence de entrée / champ = `1×1`.
- **Rationale** : rétrocompatible, colocalisé avec columns/rows, pas de nouveau nœud.
- **Alternative rejetée** : spans sur chaque enfant — les enfants sont dans une collection de zone ; le span concerne le wrapper de zone.

### 2. Zones = IDs opaques ; ordre = Settings

Conserver la génération actuelle des IDs (pas de migration forcée). Documenter qu’ils sont sémantiquement équivalents à `zone-1…N`. L’ordre de rendu reste `buildDesktopCellZones(layout)`.

- **Rationale** : aligné sur le code et sur l’intention produit ; évite une migration de `parent.zone`.

### 3. Visibilité = cellCount uniquement

```
visible(zone, bp) ⇔ index(zone) < cellCount(layout, bp)
```

Le `colSpan` / `rowSpan` d’une zone **ne masque pas** les autres zones. Toutes les zones dans le budget restent visibles ; CSS Grid auto-flow place la suite dans l’ordre (un grand span décale les items suivants).

Exemple 2×2, cellule 0 en `colSpan=2` → les 4 cellules restent visibles ; la grille reflow (A sur 2 colonnes, puis B, C, D).

- **Rationale** : le contenu ne disparaît jamais à cause d’un span ; comportement aligné sur la proposal initiale.
- **Note** : on ne simule pas une fusion tableur (masquage des cases couvertes).

### 4. Rendu CSS — tables de classes explicites

Comme `NodeTwoColumns` :

- Maps `COL_SPAN`, `SM_COL_SPAN`, `LG_COL_SPAN`, `ROW_SPAN`, `SM_ROW_SPAN`, `LG_ROW_SPAN` (1…12) en chaînes littérales pour le JIT.
- **View** : `col-span-{m} sm:col-span-{t} lg:col-span-{d}` (+ row).
- **Edit / preview** : uniquement `col-span-{bp}` / `row-span-{bp}` (viewport navigateur ≠ canevas).

Helpers dans `layoutHelpers.ts` : `getSpan(layout, zone, bp)`, `clampSpan`, `getCellSpanClassesForView`, `getCellSpanClassForBreakpoint`.

### 5. Clamp

```
effectiveCol = min(max(1, configuredCol), cols(layout, bp))
effectiveRow = min(max(1, configuredRow), rows(layout, bp))
```

Appliqué au rendu et, idéalement, à l’écriture Settings.

### 6. UI Settings

Dans l’onglet Général de `NodeGrid/Settings.tsx`, après la table colonnes/lignes :

- Liste des zones desktop (labels dérivés des IDs ou `Zone N`).
- Pour chaque zone : inputs `colSpan` / `rowSpan` par colonne Desktop / Tablet / Mobile (même pattern que C./L.).
- Valeurs bornées 1…12 et clampées aux dimensions du BP.

- **Alternative rejetée (pour v1)** : édition span au clic sur le canvas — plus riche mais hors scope.

### 7. Spec delta

Modifier l’exigence **Grille responsive NodeGrid** (pas une nouvelle capability) : zones opaques, visibilité `cellCount`, spans par zone × BP, comportements view / preview / edit.

## Risks / Trade-offs

- **[Reflow surprenant]** Un grand `colSpan` en auto-flow décale les zones suivantes → Mitigation : clamp + aperçu immédiat dans Settings / canevas ; doc courte dans Settings si besoin.
- **[rowSpan peu visible]** `rows` ne définit pas `grid-template-rows` aujourd’hui ; `row-span` crée des tracks implicites → Mitigation : supporter quand même `rowSpan` (CSS natif) ; ne pas promettre une grille à hauteur fixe.
- **[JIT manquant]** Classes dynamiques non scannées → Mitigation : tables de classes littérales (pattern TwoColumns).
- **[Dérive spec preview]** Aligner « masquer hors cellCount » peut surprendre si on s’attendait à « tout visible en preview » → Mitigation : scénarios explicites ; comportement déjà dans le code actuel.
- **[UX Settings dense]** Beaucoup d’inputs si grille 12×12 → Mitigation : n’afficher les spans que pour les zones desktop ; UI compacte type table ; v2 canvas plus tard.

## Migration Plan

1. Déployer front uniquement ; `spans` optionnel.
2. Pages existantes : pas de `spans` → rendu inchangé (`1×1`).
3. Rollback : retirer lecture de `spans` ; données orphelines inoffensives.
4. Pas de script de migration DB.

## Open Questions

- Faut-il, en v1.1, renommer les IDs générés en `zone-{n}` pour les **nouvelles** grilles uniquement (sans migrer l’existant) ?
- L’édition span sur le canvas (sélection de zone) est-elle souhaitée après la v1 Settings ?
