import { type FC, type ReactNode } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeGridV2Type, NodeGridV2Layout } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import {
  GRID_COLS,
  SM_GRID_COLS,
  LG_GRID_COLS,
  GAP_CLASS,
  type BreakpointKey,
} from "./index";
import {
  cols,
  computeDisplayZones,
  displayZoneCount,
  getZoneSpanClassesForView,
  getZoneSpanClassForBreakpoint,
  getZoneVisibilityClassesForView,
} from "./layoutHelpers";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { breakpoint, mode } = useAppContext();
  const gridNode = node as NodeGridV2Type;

  const legacyColumns = gridNode?.attributes?.options?.columns ?? 2;
  const legacyRows = gridNode?.attributes?.options?.rows ?? 2;

  const layout: NodeGridV2Layout = gridNode?.attributes?.layout || {
    desktop: { columns: legacyColumns, rows: legacyRows },
    tablet: { columns: legacyColumns, rows: legacyRows },
    mobile: { columns: legacyColumns, rows: legacyRows },
  };

  const gap = Math.min(12, Math.max(1, gridNode?.attributes?.options?.gap ?? 4));
  const gapClass = GAP_CLASS[gap] ?? "gap-4";

  const dataAttributes = Object.entries(gridNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => {
      if (key !== "columns" && key !== "rows" && key !== "gap") {
        return { ...acc, [`data-ce-${key}`]: value };
      }
      return acc;
    },
    {}
  );

  const isViewMode = mode === APP_MODE.VIEW;
  const currentBreakpoint: BreakpointKey = breakpoint || "desktop";

  let gridClasses: string;
  let cells: ReactNode[];

  if (isViewMode) {
    const cMobile = cols(layout, "mobile");
    const cTablet = cols(layout, "tablet");
    const cDesktop = cols(layout, "desktop");
    const zoneCount = Math.max(
      displayZoneCount(layout, "mobile"),
      displayZoneCount(layout, "tablet"),
      displayZoneCount(layout, "desktop"),
    );

    gridClasses = [
      "grid",
      GRID_COLS[cMobile] ?? "grid-cols-1",
      SM_GRID_COLS[cTablet] ?? "sm:grid-cols-2",
      LG_GRID_COLS[cDesktop] ?? "lg:grid-cols-2",
      gapClass,
    ].join(" ");

    cells = Array.from({ length: zoneCount }, (_, i) => {
      const zoneNumber = i + 1;
      const zoneId = `zone-${zoneNumber}`;
      const visibility = getZoneVisibilityClassesForView(zoneNumber, layout);
      const span = getZoneSpanClassesForView(layout, zoneNumber);
      return (
        <div key={zoneId} className={cn(visibility || undefined, span || undefined)}>
          <NodeCollection nodes={getChildren(zoneId)} parentId={node.id} zone={zoneId} />
        </div>
      );
    });
  } else {
    const previewColumns = cols(layout, currentBreakpoint);
    const displayZones = computeDisplayZones(layout, currentBreakpoint);

    gridClasses = ["grid", GRID_COLS[previewColumns] ?? "grid-cols-2", gapClass].join(" ");

    cells = displayZones.map((zone) => {
      const span = getZoneSpanClassForBreakpoint(
        layout,
        parseInt(zone.zoneId.replace("zone-", ""), 10),
        currentBreakpoint,
      );
      return (
        <div key={zone.zoneId} className={cn(span || undefined)}>
          <NodeCollection
            nodes={getChildren(zone.zoneId)}
            parentId={node.id}
            zone={zone.zoneId}
          />
        </div>
      );
    });
  }

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn("ce-grid-v2", node?.attributes?.className)}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div className={gridClasses}>{cells}</div>
    </div>
  );
};

export default View;
