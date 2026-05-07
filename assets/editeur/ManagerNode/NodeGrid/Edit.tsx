import { type FC, type ReactNode } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeGridType, NodeGridLayout } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { GRID_COLS, SM_GRID_COLS, LG_GRID_COLS, GAP_CLASS, type BreakpointKey, cols, rows } from "./index";

const Edit: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { breakpoint, mode } = useAppContext();
  const gridNode = node as NodeGridType;

  const legacyColumns = gridNode?.attributes?.options?.columns ?? 2;
  const legacyRows = gridNode?.attributes?.options?.rows ?? 2;

  const layout: NodeGridLayout = gridNode?.attributes?.layout || {
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
  const isEditMode = mode === APP_MODE.EDIT;

  const currentBreakpoint: BreakpointKey = breakpoint || "desktop";
  const currentConfig =
    layout[currentBreakpoint] || layout.desktop || { columns: 2, rows: 2 };
  const currentColumns = currentConfig.columns ?? 2;
  const currentRows = currentConfig.rows ?? 2;

  let gridClasses: string;
  let cells: ReactNode[];

  if (isViewMode) {
    // Mode view : grille responsive (viewport réel), zones = structure desktop pour le contenu
    const cMobile = cols(layout, "mobile");
    const cTablet = cols(layout, "tablet");
    const cDesktop = cols(layout, "desktop");
    const rDesktop = rows(layout, "desktop");

    const cellList: { zone: string }[] = [];
    for (let row = 0; row < rDesktop; row++) {
      for (let col = 0; col < cDesktop; col++) {
        cellList.push({ zone: `cell-${row}-${col}` });
      }
    }

    gridClasses = [
      "grid",
      GRID_COLS[cMobile] ?? "grid-cols-1",
      SM_GRID_COLS[cTablet] ?? "sm:grid-cols-2",
      LG_GRID_COLS[cDesktop] ?? "lg:grid-cols-2",
      gapClass,
    ].join(" ");

    cells = cellList.map(({ zone }) => (
      <div
        key={zone}
        className="min-h-[100px] border border-black-900 border-border rounded"
      >
        <NodeCollection nodes={getChildren(zone)} parentId={node.id} zone={zone} />
      </div>
    ));
  } else {
    // Mode edit / preview : grille figée sur le breakpoint sélectionné (réactif au sélecteur)
    const columns = currentColumns;
    const rowsCount = currentRows;

    gridClasses = ["grid", GRID_COLS[columns] ?? "grid-cols-2", gapClass].join(" ");

    cells = [];
    for (let row = 0; row < rowsCount; row++) {
      for (let col = 0; col < columns; col++) {
        const zone = `cell-${row}-${col}`;
        const children = getChildren(zone);
        cells.push(
          <div
            key={zone}
            className={`min-h-[100px] ${isEditMode ? "border border-black-900 border-border rounded" : ""}`}
          >
            <NodeCollection nodes={children} parentId={node.id} zone={zone} />
          </div>
        );
      }
    }
  }

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn("ce-grid", node?.attributes?.className)}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div className={gridClasses}>{cells}</div>
    </div>
  );
};

export default Edit;
