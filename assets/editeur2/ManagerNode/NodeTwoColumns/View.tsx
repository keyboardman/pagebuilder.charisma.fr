import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeTwoColumnsType, ColumnWidth } from "./index";

const View: FC<NodeViewProps|NodeEditProps> = () => {
  
  const { node, getChildren } = useNodeContext();
  const { breakpoint } = useAppContext();
  const twoColumnsNode = node as NodeTwoColumnsType;

  const left = getChildren("left");
  const right = getChildren("right");

  const layout = twoColumnsNode.attributes?.layout || {
    desktop: "50-50" as ColumnWidth,
    tablet: "50-50" as ColumnWidth,
    mobile: "50-50" as ColumnWidth,
    reverseDesktop: false,
    reverseTablet: false,
    reverseMobile: false
  };

  const dataAttributes = Object.entries(twoColumnsNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`data-ce-${key}`]: value,
    }),
    {}
  );

  // Sélectionner la largeur et le reverse selon le breakpoint actuel
  const currentBreakpoint = breakpoint || "desktop";
  const currentWidth: ColumnWidth = layout[currentBreakpoint] || layout.desktop || "50-50";
  const currentReverse = currentBreakpoint === "mobile" 
    ? (layout.reverseMobile ?? false)
    : currentBreakpoint === "tablet"
    ? (layout.reverseTablet ?? false)
    : (layout.reverseDesktop ?? false);

  // Fonction helper pour générer les classes selon la largeur
  const getWidthClass = (width: ColumnWidth): string => {
    switch (width) {
      case "33-66":
        return "grid-cols-3";
      case "50-50":
        return "grid-cols-2";
      case "66-33":
        return "grid-cols-3";
      case "100-100":
        return "grid-cols-1";
      default:
        return "grid-cols-2";
    }
  };

  const getLeftSpanClass = (width: ColumnWidth): string => {
    switch (width) {
      case "33-66":
        return "col-span-1";
      case "50-50":
        return "col-span-1";
      case "66-33":
        return "col-span-2";
      case "100-100":
        return "col-span-1";
      default:
        return "col-span-1";
    }
  };

  const getRightSpanClass = (width: ColumnWidth): string => {
    switch (width) {
      case "33-66":
        return "col-span-2";
      case "50-50":
        return "col-span-1";
      case "66-33":
        return "col-span-1";
      case "100-100":
        return "col-span-1";
      default:
        return "col-span-1";
    }
  };

  const isFluid = twoColumnsNode.attributes?.options?.fluid ?? false;

  const leftColumn = (
    <div key="left" className={getLeftSpanClass(currentWidth)}>
      <NodeCollection nodes={left} parentId={node.id} zone="left" />
    </div>
  );

  const rightColumn = (
    <div key="right" className={getRightSpanClass(currentWidth)}>
      <NodeCollection nodes={right} parentId={node.id} zone="right" />
    </div>
  );

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={node?.attributes?.className}
      style={node?.attributes?.style}
      {...dataAttributes}
    >
      <div className={`grid ${getWidthClass(currentWidth)} gap-4 ${isFluid ? 'w-full' : ''}`}>
        {currentReverse ? [rightColumn, leftColumn] : [leftColumn, rightColumn]}
      </div>
    </div>
  );
}

export default View;
