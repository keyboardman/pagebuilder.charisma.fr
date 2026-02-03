import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeGridType, NodeGridLayout } from "./index";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps|NodeEditProps> = () => {

  const { node, getChildren } = useNodeContext();
  const { breakpoint, mode } = useAppContext();
  const gridNode = node as NodeGridType;

  // Rétrocompatibilité : utiliser options si layout n'existe pas
  const legacyColumns = gridNode?.attributes?.options?.columns ?? 2;
  const legacyRows = gridNode?.attributes?.options?.rows ?? 2;

  const layout: NodeGridLayout = gridNode?.attributes?.layout || {
    desktop: { columns: legacyColumns, rows: legacyRows },
    tablet: { columns: legacyColumns, rows: legacyRows },
    mobile: { columns: legacyColumns, rows: legacyRows }
  };

  // Sélectionner les valeurs selon le breakpoint actuel
  const currentBreakpoint = breakpoint || "desktop";
  const currentConfig = layout[currentBreakpoint] || layout.desktop || { columns: 2, rows: 2 };
  const columns = currentConfig.columns ?? 2;
  const rows = currentConfig.rows ?? 2;

  const gap = gridNode?.attributes?.options?.gap ?? 4;

  const dataAttributes = Object.entries(gridNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => {
      if (key !== 'columns' && key !== 'rows' && key !== 'gap') {
        return {
          ...acc,
          [`data-ce-${key}`]: value,
        };
      }
      return acc;
    },
    {}
  );

  // Générer les cellules de la grille
  const isEditMode = mode === APP_MODE.EDIT;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const zone = `cell-${row}-${col}`;
      const children = getChildren(zone);
      
      cells.push(
        <div 
          key={zone} 
          className={`min-h-[100px] ${isEditMode ? 'border border-black-900 border-border rounded' : ''}`}
        >
          <NodeCollection nodes={children} parentId={node.id} zone={zone} />
        </div>
      );
    }
  }

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={node?.attributes?.className}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 0.25}rem`
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export default View;
