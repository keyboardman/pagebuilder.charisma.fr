import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeTwoColumnsType, ColumnWidth } from "./index";
import { styleForView } from "../../utils/styleHelper";

// Classes Tailwind par largeur — noms complets + variantes responsives pour le JIT
const GRID_COLS: Record<ColumnWidth, string> = {
  "33-66": "grid-cols-3",
  "50-50": "grid-cols-2",
  "66-33": "grid-cols-3",
  "100-100": "grid-cols-1",
};
const SM_GRID_COLS: Record<ColumnWidth, string> = {
  "33-66": "sm:grid-cols-3",
  "50-50": "sm:grid-cols-2",
  "66-33": "sm:grid-cols-3",
  "100-100": "sm:grid-cols-1",
};
const LG_GRID_COLS: Record<ColumnWidth, string> = {
  "33-66": "lg:grid-cols-3",
  "50-50": "lg:grid-cols-2",
  "66-33": "lg:grid-cols-3",
  "100-100": "lg:grid-cols-1",
};

const LEFT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "col-span-1",
  "50-50": "col-span-1",
  "66-33": "col-span-2",
  "100-100": "col-span-1",
};
const SM_LEFT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "sm:col-span-1",
  "50-50": "sm:col-span-1",
  "66-33": "sm:col-span-2",
  "100-100": "sm:col-span-1",
};
const LG_LEFT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "lg:col-span-1",
  "50-50": "lg:col-span-1",
  "66-33": "lg:col-span-2",
  "100-100": "lg:col-span-1",
};

const RIGHT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "col-span-2",
  "50-50": "col-span-1",
  "66-33": "col-span-1",
  "100-100": "col-span-1",
};
const SM_RIGHT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "sm:col-span-2",
  "50-50": "sm:col-span-1",
  "66-33": "sm:col-span-1",
  "100-100": "sm:col-span-1",
};
const LG_RIGHT_SPAN: Record<ColumnWidth, string> = {
  "33-66": "lg:col-span-2",
  "50-50": "lg:col-span-1",
  "66-33": "lg:col-span-1",
  "100-100": "lg:col-span-1",
};

type BreakpointKey = "mobile" | "tablet" | "desktop";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { mode, breakpoint } = useAppContext();
  const twoColumnsNode = node as NodeTwoColumnsType;

  const left = getChildren("left");
  const right = getChildren("right");

  const layout = twoColumnsNode.attributes?.layout || {
    desktop: "50-50" as ColumnWidth,
    tablet: "50-50" as ColumnWidth,
    mobile: "50-50" as ColumnWidth,
    reverseDesktop: false,
    reverseTablet: false,
    reverseMobile: false,
  };

  const dataAttributes = Object.entries(twoColumnsNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`data-ce-${key}`]: value,
    }),
    {}
  );

  const w = (key: BreakpointKey) =>
    layout[key] || layout.desktop || "50-50";

  const isViewMode = mode === APP_MODE.VIEW;

  const currentBreakpoint: BreakpointKey = breakpoint || "desktop";
  const currentWidth: ColumnWidth = w(currentBreakpoint);
  const currentReverse =
    currentBreakpoint === "mobile"
      ? (layout.reverseMobile ?? false)
      : currentBreakpoint === "tablet"
        ? (layout.reverseTablet ?? false)
        : (layout.reverseDesktop ?? false);

  let gridClasses: string;
  let leftSpanClasses: string;
  let rightSpanClasses: string;
  let leftOrderClasses: string;
  let rightOrderClasses: string;

  if (isViewMode) {
    // Mode view : responsive Tailwind (viewport réel)
    gridClasses = [
      "grid gap-4",
      GRID_COLS[w("mobile")],
      SM_GRID_COLS[w("tablet")],
      LG_GRID_COLS[w("desktop")],
    ].join(" ");
    leftSpanClasses = [
      LEFT_SPAN[w("mobile")],
      SM_LEFT_SPAN[w("tablet")],
      LG_LEFT_SPAN[w("desktop")],
    ].join(" ");
    rightSpanClasses = [
      RIGHT_SPAN[w("mobile")],
      SM_RIGHT_SPAN[w("tablet")],
      LG_RIGHT_SPAN[w("desktop")],
    ].join(" ");
    leftOrderClasses = [
      layout.reverseMobile ? "order-2" : "order-1",
      layout.reverseTablet ? "sm:order-2" : "sm:order-1",
      layout.reverseDesktop ? "lg:order-2" : "lg:order-1",
    ].join(" ");
    rightOrderClasses = [
      layout.reverseMobile ? "order-1" : "order-2",
      layout.reverseTablet ? "sm:order-1" : "sm:order-2",
      layout.reverseDesktop ? "lg:order-1" : "lg:order-2",
    ].join(" ");
  } else {
    // Mode edit / preview : layout figé sur le breakpoint sélectionné (réactif au sélecteur)
    gridClasses = ["grid gap-4", GRID_COLS[currentWidth]].join(" ");
    leftSpanClasses = LEFT_SPAN[currentWidth];
    rightSpanClasses = RIGHT_SPAN[currentWidth];
    leftOrderClasses = currentReverse ? "order-2" : "order-1";
    rightOrderClasses = currentReverse ? "order-1" : "order-2";
  }

  const isFluid = twoColumnsNode.attributes?.options?.fluid ?? false;

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={node?.attributes?.className}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div className={`${gridClasses} ${isFluid ? "w-full" : ""}`}>
        <div key="left" className={`${leftSpanClasses} ${leftOrderClasses}`}>
          <NodeCollection nodes={left} parentId={node.id} zone="left" />
        </div>
        <div key="right" className={`${rightSpanClasses} ${rightOrderClasses}`}>
          <NodeCollection nodes={right} parentId={node.id} zone="right" />
        </div>
      </div>
    </div>
  );
};

export default View;
