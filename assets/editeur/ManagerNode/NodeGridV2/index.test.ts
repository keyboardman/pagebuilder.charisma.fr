import { describe, expect, it } from "vitest";
import {
  cellCount,
  computeDisplayZones,
  displayZoneCount,
  getCoveredSlotIndices,
  getMergeRectFromIndices,
  isSlotVisibleAtBreakpoint,
  type NodeGridV2Layout,
} from "./layoutHelpers";

describe("NodeGridV2 display zones", () => {
  it("calcule 3 zones affichées pour fusion 2×2 sur grille 3×2", () => {
    const layout: NodeGridV2Layout = {
      desktop: { columns: 3, rows: 2 },
      tablet: { columns: 3, rows: 2 },
      mobile: { columns: 3, rows: 2 },
      spans: {
        "cell-0-0": { desktop: { col: 2, row: 2 } },
      },
    };

    expect(cellCount(layout, "desktop")).toBe(6);
    expect(getCoveredSlotIndices(layout, "desktop")).toEqual(new Set([1, 3, 4]));
    expect(displayZoneCount(layout, "desktop")).toBe(3);

    const zones = computeDisplayZones(layout, "desktop");
    expect(zones.map((z) => z.zoneId)).toEqual(["zone-1", "zone-2", "zone-3"]);
    expect(zones[0].slotIndex).toBe(0);
    expect(zones[0].colSpan).toBe(2);
    expect(zones[0].rowSpan).toBe(2);
    expect(zones[1].slotIndex).toBe(2);
    expect(zones[2].slotIndex).toBe(5);
  });

  it("masque les cellules couvertes par fusion", () => {
    const layout: NodeGridV2Layout = {
      desktop: { columns: 3, rows: 2 },
      spans: {
        "cell-0-0": { desktop: { col: 2, row: 2 } },
      },
    };

    expect(isSlotVisibleAtBreakpoint(0, layout, "desktop")).toBe(true);
    expect(isSlotVisibleAtBreakpoint(1, layout, "desktop")).toBe(false);
    expect(isSlotVisibleAtBreakpoint(2, layout, "desktop")).toBe(true);
    expect(isSlotVisibleAtBreakpoint(5, layout, "desktop")).toBe(true);
  });

  it("sans fusion, une zone par cellule", () => {
    const layout: NodeGridV2Layout = {
      desktop: { columns: 2, rows: 2 },
    };

    expect(displayZoneCount(layout, "desktop")).toBe(4);
    expect(computeDisplayZones(layout, "desktop").map((z) => z.zoneId)).toEqual([
      "zone-1",
      "zone-2",
      "zone-3",
      "zone-4",
    ]);
  });

  it("calcule le rectangle de fusion avec ancre haut-gauche", () => {
    const rect = getMergeRectFromIndices(5, 0, 3);
    expect(rect.anchorIndex).toBe(0);
    expect(rect.colSpan).toBe(3);
    expect(rect.rowSpan).toBe(2);
    expect(rect.indices).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
