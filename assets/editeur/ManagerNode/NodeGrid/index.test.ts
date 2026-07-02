import { describe, expect, it } from "vitest";
import {
  cellCount,
  getCellVisibilityClassesForView,
  isCellVisibleAtBreakpoint,
  type NodeGridLayout,
} from "./layoutHelpers";

const layout4x2Desktop1x4Mobile: NodeGridLayout = {
  desktop: { columns: 4, rows: 2 },
  tablet: { columns: 4, rows: 2 },
  mobile: { columns: 1, rows: 4 },
};

describe("NodeGrid cell visibility", () => {
  it("calcule le nombre de cellules par breakpoint", () => {
    expect(cellCount(layout4x2Desktop1x4Mobile, "desktop")).toBe(8);
    expect(cellCount(layout4x2Desktop1x4Mobile, "mobile")).toBe(4);
  });

  it("masque les cellules au-delà du layout mobile en vue publique", () => {
    expect(getCellVisibilityClassesForView(3, layout4x2Desktop1x4Mobile)).toBe("");
    expect(getCellVisibilityClassesForView(4, layout4x2Desktop1x4Mobile)).toBe("hidden sm:block");
    expect(getCellVisibilityClassesForView(7, layout4x2Desktop1x4Mobile)).toBe("hidden sm:block");
  });

  it("n'affiche les cellules excédentaires qu'à partir du desktop si tablette = mobile", () => {
    const layout = {
      desktop: { columns: 4, rows: 2 },
      tablet: { columns: 1, rows: 4 },
      mobile: { columns: 1, rows: 4 },
    };
    expect(getCellVisibilityClassesForView(4, layout)).toBe("hidden lg:block");
  });

  it("limite les cellules visibles en prévisualisation mobile", () => {
    expect(isCellVisibleAtBreakpoint(3, layout4x2Desktop1x4Mobile, "mobile")).toBe(true);
    expect(isCellVisibleAtBreakpoint(4, layout4x2Desktop1x4Mobile, "mobile")).toBe(false);
    expect(isCellVisibleAtBreakpoint(7, layout4x2Desktop1x4Mobile, "desktop")).toBe(true);
  });
});
