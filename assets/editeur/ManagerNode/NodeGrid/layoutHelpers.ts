export type BreakpointKey = "mobile" | "tablet" | "desktop";

export interface NodeGridLayout {
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
}

export const cols = (layout: NodeGridLayout, key: BreakpointKey) =>
  layout[key]?.columns ?? layout.desktop?.columns ?? 2;

export const rows = (layout: NodeGridLayout, key: BreakpointKey) =>
  layout[key]?.rows ?? layout.desktop?.rows ?? 2;

export const cellCount = (layout: NodeGridLayout, key: BreakpointKey): number =>
  cols(layout, key) * rows(layout, key);

/** Classes Tailwind pour masquer les cellules excédentaires selon le viewport (mode view). */
export const getCellVisibilityClassesForView = (
  index: number,
  layout: NodeGridLayout,
): string => {
  const mobileCount = cellCount(layout, "mobile");
  const tabletCount = cellCount(layout, "tablet");
  const desktopCount = cellCount(layout, "desktop");

  const classes: string[] = [];
  if (index >= mobileCount) classes.push("hidden");
  if (index >= mobileCount && index < tabletCount) classes.push("sm:block");
  if (index >= tabletCount && index < desktopCount) classes.push("lg:block");
  return classes.join(" ");
};

/** Indique si une cellule doit être visible pour un breakpoint donné (édition / prévisualisation). */
export const isCellVisibleAtBreakpoint = (
  index: number,
  layout: NodeGridLayout,
  breakpoint: BreakpointKey,
): boolean => index < cellCount(layout, breakpoint);

/** Zones `cell-{row}-{col}` dérivées de la structure desktop. */
export const buildDesktopCellZones = (layout: NodeGridLayout): string[] => {
  const cDesktop = cols(layout, "desktop");
  const rDesktop = rows(layout, "desktop");
  const zones: string[] = [];
  for (let row = 0; row < rDesktop; row++) {
    for (let col = 0; col < cDesktop; col++) {
      zones.push(`cell-${row}-${col}`);
    }
  }
  return zones;
};
