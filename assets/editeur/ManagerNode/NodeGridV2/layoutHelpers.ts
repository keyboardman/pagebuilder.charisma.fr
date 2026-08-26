export type BreakpointKey = "mobile" | "tablet" | "desktop";

/** Span d'une cellule de grille ; défaut implicite 1×1 si absent. */
export type CellSpan = {
  col?: number;
  row?: number;
};

export type ZoneSpans = {
  desktop?: CellSpan;
  tablet?: CellSpan;
  mobile?: CellSpan;
};

export interface NodeGridV2Layout {
  desktop?: {
    columns?: number;
    rows?: number;
  };
  tablet?: {
    columns?: number;
    rows?: number;
  };
  mobile?: {
    columns?: number;
    rows?: number;
  };
  /** Spans par clé de cellule desktop (cell-{row}-{col}). */
  spans?: Record<string, ZoneSpans>;
}

/** Zone d'affichage ordonnée (zone-1, zone-2, …). */
export type DisplayZone = {
  zoneId: string;
  slotIndex: number;
  slotKey: string;
  colSpan: number;
  rowSpan: number;
};

/** Classes Tailwind littérales (JIT) — col-span */
export const COL_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

export const SM_COL_SPAN: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};

export const LG_COL_SPAN: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

/** Classes Tailwind littérales (JIT) — row-span */
export const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
};

export const SM_ROW_SPAN: Record<number, string> = {
  1: "sm:row-span-1",
  2: "sm:row-span-2",
  3: "sm:row-span-3",
  4: "sm:row-span-4",
  5: "sm:row-span-5",
  6: "sm:row-span-6",
  7: "sm:row-span-7",
  8: "sm:row-span-8",
  9: "sm:row-span-9",
  10: "sm:row-span-10",
  11: "sm:row-span-11",
  12: "sm:row-span-12",
};

export const LG_ROW_SPAN: Record<number, string> = {
  1: "lg:row-span-1",
  2: "lg:row-span-2",
  3: "lg:row-span-3",
  4: "lg:row-span-4",
  5: "lg:row-span-5",
  6: "lg:row-span-6",
  7: "lg:row-span-7",
  8: "lg:row-span-8",
  9: "lg:row-span-9",
  10: "lg:row-span-10",
  11: "lg:row-span-11",
  12: "lg:row-span-12",
};

export const cols = (layout: NodeGridV2Layout, key: BreakpointKey) =>
  layout[key]?.columns ?? layout.desktop?.columns ?? 2;

export const rows = (layout: NodeGridV2Layout, key: BreakpointKey) =>
  layout[key]?.rows ?? layout.desktop?.rows ?? 2;

export const cellCount = (layout: NodeGridV2Layout, key: BreakpointKey): number =>
  cols(layout, key) * rows(layout, key);

/** Clés `cell-{row}-{col}` dérivées de la structure desktop. */
export const buildDesktopCellKeys = (layout: NodeGridV2Layout): string[] => {
  const cDesktop = cols(layout, "desktop");
  const rDesktop = rows(layout, "desktop");
  const keys: string[] = [];
  for (let row = 0; row < rDesktop; row++) {
    for (let col = 0; col < cDesktop; col++) {
      keys.push(`cell-${row}-${col}`);
    }
  }
  return keys;
};

export const clampSpan = (
  span: CellSpan | undefined,
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): { col: number; row: number } => {
  const maxCol = cols(layout, breakpoint);
  const maxRow = rows(layout, breakpoint);
  const col = Math.min(maxCol, Math.max(1, span?.col ?? 1));
  const row = Math.min(maxRow, Math.max(1, span?.row ?? 1));
  return { col, row };
};

export const getSpan = (
  layout: NodeGridV2Layout,
  slotKey: string,
  breakpoint: BreakpointKey,
): CellSpan => layout.spans?.[slotKey]?.[breakpoint] ?? {};

/**
 * Indices des cellules couvertes par une fusion (hors cellule d'origine).
 * Parcours row-major dans les dimensions du breakpoint.
 */
export const getCoveredSlotIndices = (
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): Set<number> => {
  const c = cols(layout, breakpoint);
  const r = rows(layout, breakpoint);
  const count = cellCount(layout, breakpoint);
  const slotKeys = buildDesktopCellKeys(layout);
  const covered = new Set<number>();

  for (let i = 0; i < count; i++) {
    if (covered.has(i)) continue;
    const slotKey = slotKeys[i];
    if (!slotKey) continue;

    const { col: spanCol, row: spanRow } = clampSpan(
      getSpan(layout, slotKey, breakpoint),
      layout,
      breakpoint,
    );
    if (spanCol <= 1 && spanRow <= 1) continue;

    const r0 = Math.floor(i / c);
    const c0 = i % c;
    for (let dr = 0; dr < spanRow; dr++) {
      for (let dc = 0; dc < spanCol; dc++) {
        if (dr === 0 && dc === 0) continue;
        const rr = r0 + dr;
        const cc = c0 + dc;
        if (rr < r && cc < c) {
          covered.add(rr * c + cc);
        }
      }
    }
  }
  return covered;
};

export const isSlotCoveredAtBreakpoint = (
  index: number,
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): boolean => getCoveredSlotIndices(layout, breakpoint).has(index);

/** Cellule de grille visible (dans le budget et non couverte par fusion). */
export const isSlotVisibleAtBreakpoint = (
  index: number,
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): boolean =>
  index < cellCount(layout, breakpoint) &&
  !isSlotCoveredAtBreakpoint(index, layout, breakpoint);

/**
 * Zones d'affichage ordonnées (zone-1, zone-2, …) pour un breakpoint.
 * Chaque zone correspond à une cellule non fusionnée, de gauche à droite.
 */
export const computeDisplayZones = (
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): DisplayZone[] => {
  const count = cellCount(layout, breakpoint);
  const covered = getCoveredSlotIndices(layout, breakpoint);
  const slotKeys = buildDesktopCellKeys(layout);
  const zones: DisplayZone[] = [];
  let zoneNum = 1;

  for (let i = 0; i < count; i++) {
    if (covered.has(i)) continue;
    const slotKey = slotKeys[i];
    if (!slotKey) continue;
    const span = clampSpan(getSpan(layout, slotKey, breakpoint), layout, breakpoint);
    zones.push({
      zoneId: `zone-${zoneNum}`,
      slotIndex: i,
      slotKey,
      colSpan: span.col,
      rowSpan: span.row,
    });
    zoneNum++;
  }
  return zones;
};

/** Nombre de zones affichées = cellules totales − cellules couvertes. */
export const displayZoneCount = (
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): number => computeDisplayZones(layout, breakpoint).length;

export const maxDisplayZoneCount = (layout: NodeGridV2Layout): number =>
  Math.max(
    displayZoneCount(layout, "mobile"),
    displayZoneCount(layout, "tablet"),
    displayZoneCount(layout, "desktop"),
  );

export const getDisplayZoneAt = (
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
  zoneNumber: number,
): DisplayZone | undefined => computeDisplayZones(layout, breakpoint)[zoneNumber - 1];

export const getZoneSpanClassForBreakpoint = (
  layout: NodeGridV2Layout,
  zoneNumber: number,
  breakpoint: BreakpointKey,
): string => {
  const zone = getDisplayZoneAt(layout, breakpoint, zoneNumber);
  if (!zone) return "";
  const parts: string[] = [];
  if (zone.colSpan > 1) parts.push(COL_SPAN[zone.colSpan] ?? "col-span-1");
  if (zone.rowSpan > 1) parts.push(ROW_SPAN[zone.rowSpan] ?? "row-span-1");
  return parts.join(" ");
};

export const getZoneSpanClassesForView = (
  layout: NodeGridV2Layout,
  zoneNumber: number,
): string => {
  const mobile = getDisplayZoneAt(layout, "mobile", zoneNumber);
  const tablet = getDisplayZoneAt(layout, "tablet", zoneNumber);
  const desktop = getDisplayZoneAt(layout, "desktop", zoneNumber);

  const parts: string[] = [];
  const mCol = mobile?.colSpan ?? 1;
  const tCol = tablet?.colSpan ?? 1;
  const dCol = desktop?.colSpan ?? 1;
  if (mCol > 1 || tCol > 1 || dCol > 1) {
    parts.push(COL_SPAN[mCol] ?? "col-span-1");
    parts.push(SM_COL_SPAN[tCol] ?? "sm:col-span-1");
    parts.push(LG_COL_SPAN[dCol] ?? "lg:col-span-1");
  }

  const mRow = mobile?.rowSpan ?? 1;
  const tRow = tablet?.rowSpan ?? 1;
  const dRow = desktop?.rowSpan ?? 1;
  if (mRow > 1 || tRow > 1 || dRow > 1) {
    parts.push(ROW_SPAN[mRow] ?? "row-span-1");
    parts.push(SM_ROW_SPAN[tRow] ?? "sm:row-span-1");
    parts.push(LG_ROW_SPAN[dRow] ?? "lg:row-span-1");
  }
  return parts.join(" ");
};

export const getZoneVisibilityClassesForView = (
  zoneNumber: number,
  layout: NodeGridV2Layout,
): string => {
  const existsMobile = zoneNumber <= displayZoneCount(layout, "mobile");
  const existsTablet = zoneNumber <= displayZoneCount(layout, "tablet");
  const existsDesktop = zoneNumber <= displayZoneCount(layout, "desktop");

  const classes: string[] = [];
  if (!existsMobile) classes.push("hidden");
  if (existsMobile !== existsTablet) {
    classes.push(existsTablet ? "sm:block" : "sm:hidden");
  }
  if (existsTablet !== existsDesktop) {
    classes.push(existsDesktop ? "lg:block" : "lg:hidden");
  }
  return classes.join(" ");
};

export const isZoneVisibleAtBreakpoint = (
  zoneNumber: number,
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
): boolean => zoneNumber <= displayZoneCount(layout, breakpoint);

/** Index row-major → (row, col) pour un nombre de colonnes donné. */
export const indexToRowCol = (
  index: number,
  columns: number,
): { row: number; col: number } => ({
  row: Math.floor(index / columns),
  col: index % columns,
});

/** Rectangle de fusion entre deux cellules ; ancre = coin haut-gauche. */
export const getMergeRectFromIndices = (
  indexA: number,
  indexB: number,
  columns: number,
): {
  anchorIndex: number;
  colSpan: number;
  rowSpan: number;
  indices: number[];
} => {
  const a = indexToRowCol(indexA, columns);
  const b = indexToRowCol(indexB, columns);
  const minRow = Math.min(a.row, b.row);
  const maxRow = Math.max(a.row, b.row);
  const minCol = Math.min(a.col, b.col);
  const maxCol = Math.max(a.col, b.col);
  const anchorIndex = minRow * columns + minCol;
  const colSpan = maxCol - minCol + 1;
  const rowSpan = maxRow - minRow + 1;
  const indices: number[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      indices.push(row * columns + col);
    }
  }
  return { anchorIndex, colSpan, rowSpan, indices };
};

/** Indices du rectangle défini par une ancre et un span. */
export const getIndicesInSpanRect = (
  anchorIndex: number,
  colSpan: number,
  rowSpan: number,
  columns: number,
): number[] => {
  const { row: r0, col: c0 } = indexToRowCol(anchorIndex, columns);
  const indices: number[] = [];
  for (let dr = 0; dr < rowSpan; dr++) {
    for (let dc = 0; dc < colSpan; dc++) {
      indices.push((r0 + dr) * columns + (c0 + dc));
    }
  }
  return indices;
};

/**
 * Applique une fusion (ou défusions si 1×1) pour un breakpoint.
 * Réinitialise les spans des cellules du rectangle puis fixe l'ancre haut-gauche.
 */
export const buildSpansAfterMergeSelection = (
  layout: NodeGridV2Layout,
  breakpoint: BreakpointKey,
  indexA: number,
  indexB: number,
): Record<string, ZoneSpans> | null => {
  const c = cols(layout, breakpoint);
  const count = cellCount(layout, breakpoint);
  const { anchorIndex, colSpan, rowSpan, indices } = getMergeRectFromIndices(
    indexA,
    indexB,
    c,
  );
  if (indices.some((i) => i >= count)) return null;

  const slotKeys = buildDesktopCellKeys(layout);
  const newSpans: Record<string, ZoneSpans> = { ...layout.spans };

  for (const i of indices) {
    const key = slotKeys[i];
    if (!key || !newSpans[key]?.[breakpoint]) continue;
    const { [breakpoint]: _removed, ...restBp } = newSpans[key];
    if (Object.keys(restBp).length === 0) {
      delete newSpans[key];
    } else {
      newSpans[key] = restBp;
    }
  }

  if (colSpan === 1 && rowSpan === 1) {
    return newSpans;
  }

  const anchorKey = slotKeys[anchorIndex];
  if (!anchorKey) return null;

  newSpans[anchorKey] = {
    ...newSpans[anchorKey],
    [breakpoint]: { col: colSpan, row: rowSpan },
  };
  return newSpans;
};
