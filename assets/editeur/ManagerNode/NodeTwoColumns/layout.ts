export const PRESET_WIDTHS = [
  "33-66",
  "50-50",
  "66-33",
  "25-75",
  "75-25",
  "100-100",
] as const;

export type PresetColumnWidth = (typeof PRESET_WIDTHS)[number];
export type ColumnWidth = PresetColumnWidth | "custom";
export type BreakpointKey = "mobile" | "tablet" | "desktop";

export interface CustomDesktopPercent {
  left: number;
  right: number;
}

export interface NodeTwoColumnsLayout {
  desktop?: ColumnWidth;
  tablet?: PresetColumnWidth;
  mobile?: PresetColumnWidth;
  customDesktop?: CustomDesktopPercent;
  reverseDesktop?: boolean;
  reverseTablet?: boolean;
  reverseMobile?: boolean;
}

export const CUSTOM_DESKTOP_STEP = 5;
export const CUSTOM_DESKTOP_MIN = 5;
export const CUSTOM_DESKTOP_MAX = 95;

export const DEFAULT_LAYOUT: NodeTwoColumnsLayout = {
  desktop: "50-50",
  tablet: "50-50",
  mobile: "50-50",
  reverseDesktop: false,
  reverseTablet: false,
  reverseMobile: false,
};

export const presetWidthOptions = PRESET_WIDTHS.map((value) => ({
  label: value,
  value,
}));

export const desktopWidthOptions = [
  ...presetWidthOptions,
  { label: "Personnalisé", value: "custom" as const },
];

// Classes Tailwind explicites (requis pour le JIT — order responsive)
export const RESPONSIVE_ORDER_SCAN_CLASSES =
  "order-1 order-2 sm:order-1 sm:order-2 lg:order-1 lg:order-2";

// Classes Tailwind explicites (requis pour le JIT)
const PRESET_CLASSES: Record<
  PresetColumnWidth,
  {
    grid: string;
    smGrid: string;
    lgGrid: string;
    left: string;
    smLeft: string;
    lgLeft: string;
    right: string;
    smRight: string;
    lgRight: string;
  }
> = {
  "33-66": {
    grid: "grid-cols-3", smGrid: "sm:grid-cols-3", lgGrid: "lg:grid-cols-3",
    left: "col-span-1", smLeft: "sm:col-span-1", lgLeft: "lg:col-span-1",
    right: "col-span-2", smRight: "sm:col-span-2", lgRight: "lg:col-span-2",
  },
  "50-50": {
    grid: "grid-cols-2", smGrid: "sm:grid-cols-2", lgGrid: "lg:grid-cols-2",
    left: "col-span-1", smLeft: "sm:col-span-1", lgLeft: "lg:col-span-1",
    right: "col-span-1", smRight: "sm:col-span-1", lgRight: "lg:col-span-1",
  },
  "66-33": {
    grid: "grid-cols-3", smGrid: "sm:grid-cols-3", lgGrid: "lg:grid-cols-3",
    left: "col-span-2", smLeft: "sm:col-span-2", lgLeft: "lg:col-span-2",
    right: "col-span-1", smRight: "sm:col-span-1", lgRight: "lg:col-span-1",
  },
  "25-75": {
    grid: "grid-cols-4", smGrid: "sm:grid-cols-4", lgGrid: "lg:grid-cols-4",
    left: "col-span-1", smLeft: "sm:col-span-1", lgLeft: "lg:col-span-1",
    right: "col-span-3", smRight: "sm:col-span-3", lgRight: "lg:col-span-3",
  },
  "75-25": {
    grid: "grid-cols-4", smGrid: "sm:grid-cols-4", lgGrid: "lg:grid-cols-4",
    left: "col-span-3", smLeft: "sm:col-span-3", lgLeft: "lg:col-span-3",
    right: "col-span-1", smRight: "sm:col-span-1", lgRight: "lg:col-span-1",
  },
  "100-100": {
    grid: "grid-cols-1", smGrid: "sm:grid-cols-1", lgGrid: "lg:grid-cols-1",
    left: "col-span-1", smLeft: "sm:col-span-1", lgLeft: "lg:col-span-1",
    right: "col-span-1", smRight: "sm:col-span-1", lgRight: "lg:col-span-1",
  },
};

export function snapCustomDesktopLeft(value: number): number {
  const rounded = Math.round(value / CUSTOM_DESKTOP_STEP) * CUSTOM_DESKTOP_STEP;
  return Math.min(CUSTOM_DESKTOP_MAX, Math.max(CUSTOM_DESKTOP_MIN, rounded));
}

export function normalizeCustomDesktop(
  value: CustomDesktopPercent | undefined
): CustomDesktopPercent {
  const left = snapCustomDesktopLeft(value?.left ?? 50);
  return { left, right: 100 - left };
}

export function toPreset(
  width: ColumnWidth | PresetColumnWidth | undefined,
  fallback: PresetColumnWidth = "50-50"
): PresetColumnWidth {
  if (!width || width === "custom") return fallback;
  return width;
}

export function layoutWidth(
  layout: NodeTwoColumnsLayout,
  key: BreakpointKey
): ColumnWidth | PresetColumnWidth {
  return layout[key] || layout.desktop || "50-50";
}

export function customGridTemplate(left: number, right: number): string {
  return `minmax(0, ${left}fr) minmax(0, ${right}fr)`;
}

export function isReversed(
  layout: NodeTwoColumnsLayout,
  key: BreakpointKey
): boolean {
  if (key === "mobile") return layout.reverseMobile ?? false;
  if (key === "tablet") return layout.reverseTablet ?? false;
  return layout.reverseDesktop ?? false;
}

function orderClasses(reverse: boolean, prefix = ""): [string, string] {
  const p = prefix ? `${prefix}:` : "";
  return reverse
    ? [`${p}order-2`, `${p}order-1`]
    : [`${p}order-1`, `${p}order-2`];
}

export function buildPresetGridClasses(preset: PresetColumnWidth): string {
  return `grid gap-4 ${PRESET_CLASSES[preset].grid}`;
}

export function buildResponsiveGridClasses(
  mobile: PresetColumnWidth,
  tablet: PresetColumnWidth,
  desktop: PresetColumnWidth,
  desktopIsCustom: boolean
): string {
  const m = PRESET_CLASSES[mobile];
  const t = PRESET_CLASSES[tablet];
  const d = PRESET_CLASSES[desktop];
  return [
    "grid gap-4",
    m.grid,
    t.smGrid,
    desktopIsCustom ? "ce-two_columns-grid-custom-lg" : d.lgGrid,
  ].join(" ");
}

export function buildResponsiveSpanClasses(
  mobile: PresetColumnWidth,
  tablet: PresetColumnWidth,
  desktop: PresetColumnWidth,
  desktopIsCustom: boolean,
  side: "left" | "right"
): string {
  const m = PRESET_CLASSES[mobile];
  const t = PRESET_CLASSES[tablet];
  const d = PRESET_CLASSES[desktop];
  const spans =
    side === "left"
      ? [m.left, t.smLeft, desktopIsCustom ? "lg:col-span-1" : d.lgLeft]
      : [m.right, t.smRight, desktopIsCustom ? "lg:col-span-1" : d.lgRight];
  return spans.join(" ");
}

export function buildResponsiveOrderClasses(layout: NodeTwoColumnsLayout): {
  left: string;
  right: string;
} {
  const [mobileLeft, mobileRight] = orderClasses(isReversed(layout, "mobile"));
  const [tabletLeft, tabletRight] = orderClasses(isReversed(layout, "tablet"), "sm");
  const [desktopLeft, desktopRight] = orderClasses(isReversed(layout, "desktop"), "lg");
  return {
    left: [mobileLeft, tabletLeft, desktopLeft].join(" "),
    right: [mobileRight, tabletRight, desktopRight].join(" "),
  };
}

export function buildPresetSpanClasses(
  preset: PresetColumnWidth
): { left: string; right: string } {
  const c = PRESET_CLASSES[preset];
  return { left: c.left, right: c.right };
}

export function buildEditOrderClasses(reverse: boolean): {
  left: string;
  right: string;
} {
  const [left, right] = orderClasses(reverse);
  return { left, right };
}
