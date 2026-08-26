import { type FC, useMemo, useState } from "react";
import { Monitor, Tablet, Phone } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import type { BreakpointKey, NodeGridV2Layout } from "./index";
import {
  buildDesktopCellKeys,
  cellCount,
  clampSpan,
  cols,
  computeDisplayZones,
  getCoveredSlotIndices,
  getIndicesInSpanRect,
  getMergeRectFromIndices,
  getSpan,
  rows,
} from "./layoutHelpers";

type MergeGridPickerProps = {
  layout: NodeGridV2Layout;
  onMerge: (breakpoint: BreakpointKey, indexA: number, indexB: number) => void;
};

const BREAKPOINTS: { key: BreakpointKey; label: string; Icon: typeof Monitor }[] = [
  { key: "desktop", label: "Desktop", Icon: Monitor },
  { key: "tablet", label: "Tablet", Icon: Tablet },
  { key: "mobile", label: "Mobile", Icon: Phone },
];

const anchorIntersectsPreview = (
  anchorIndex: number,
  colSpan: number,
  rowSpan: number,
  previewIndices: Set<number>,
  columns: number,
): boolean =>
  getIndicesInSpanRect(anchorIndex, colSpan, rowSpan, columns).some((i) =>
    previewIndices.has(i),
  );

const MergeGridPicker: FC<MergeGridPickerProps> = ({ layout, onMerge }) => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>("desktop");
  const [mergeStart, setMergeStart] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const c = cols(layout, breakpoint);
  const r = rows(layout, breakpoint);
  const slotKeys = buildDesktopCellKeys(layout);
  const covered = useMemo(
    () => getCoveredSlotIndices(layout, breakpoint),
    [layout, breakpoint],
  );
  const displayZones = useMemo(
    () => computeDisplayZones(layout, breakpoint),
    [layout, breakpoint],
  );

  const zoneBySlotIndex = useMemo(() => {
    const map = new Map<number, string>();
    for (const zone of displayZones) {
      map.set(zone.slotIndex, zone.zoneId.replace("zone-", ""));
    }
    return map;
  }, [displayZones]);

  const previewIndices = useMemo(() => {
    if (mergeStart === null || hoverIndex === null) return new Set<number>();
    return new Set(getMergeRectFromIndices(mergeStart, hoverIndex, c).indices);
  }, [mergeStart, hoverIndex, c]);

  const handleCellClick = (index: number) => {
    if (mergeStart === null) {
      setMergeStart(index);
      setHoverIndex(index);
      return;
    }
    onMerge(breakpoint, mergeStart, index);
    setMergeStart(null);
    setHoverIndex(null);
  };

  const visibleAnchors = useMemo(() => {
    const anchors: {
      index: number;
      colSpan: number;
      rowSpan: number;
      zoneLabel: string;
    }[] = [];
    const count = cellCount(layout, breakpoint);
    for (let i = 0; i < count; i++) {
      if (covered.has(i)) continue;
      const slotKey = slotKeys[i];
      if (!slotKey) continue;
      const span = clampSpan(getSpan(layout, slotKey, breakpoint), layout, breakpoint);
      anchors.push({
        index: i,
        colSpan: span.col,
        rowSpan: span.row,
        zoneLabel: zoneBySlotIndex.get(i) ?? "?",
      });
    }
    return anchors;
  }, [layout, breakpoint, covered, slotKeys, zoneBySlotIndex]);

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {BREAKPOINTS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            title={label}
            onClick={() => {
              setBreakpoint(key);
              setMergeStart(null);
              setHoverIndex(null);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded border transition-colors",
              breakpoint === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        {mergeStart !== null && (
          <button
            type="button"
            onClick={() => {
              setMergeStart(null);
              setHoverIndex(null);
            }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            title="Annuler"
          >
            ×
          </button>
        )}
      </div>

      <div
        className="grid gap-1 w-full max-w-xs"
        style={{
          gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${r}, minmax(2rem, auto))`,
        }}
        onMouseLeave={() => mergeStart !== null && setHoverIndex(mergeStart)}
      >
        {visibleAnchors.map(({ index, colSpan, rowSpan, zoneLabel }) => {
          const isStart = mergeStart === index;
          const inPreview = anchorIntersectsPreview(
            index,
            colSpan,
            rowSpan,
            previewIndices,
            c,
          );
          const isMerged = colSpan > 1 || rowSpan > 1;

          return (
            <button
              key={index}
              type="button"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
              }}
              onClick={() => handleCellClick(index)}
              onMouseEnter={() => mergeStart !== null && setHoverIndex(index)}
              className={cn(
                "flex min-h-8 items-center justify-center rounded border text-xs transition-colors",
                isStart && "ring-2 ring-primary ring-offset-1",
                inPreview && "border-primary bg-primary/15",
                !inPreview && isMerged && "border-primary/40 bg-primary/5",
                !inPreview && !isMerged && "border-border bg-muted/30 hover:bg-muted/60",
              )}
            >
              {zoneLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MergeGridPicker;
