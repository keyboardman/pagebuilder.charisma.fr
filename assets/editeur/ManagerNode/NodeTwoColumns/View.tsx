import { type FC, type CSSProperties } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeTwoColumnsType } from "./index";
import {
  DEFAULT_LAYOUT,
  buildEditOrderClasses,
  buildPresetGridClasses,
  buildPresetSpanClasses,
  buildResponsiveGridClasses,
  buildResponsiveOrderClasses,
  buildResponsiveSpanClasses,
  customGridTemplate,
  isReversed,
  layoutWidth,
  normalizeCustomDesktop,
  toPreset,
} from "./layout";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { mode, breakpoint } = useAppContext();
  const twoColumnsNode = node as NodeTwoColumnsType;
  const layout = twoColumnsNode.attributes?.layout ?? DEFAULT_LAYOUT;
  const customDesktop = normalizeCustomDesktop(layout.customDesktop);
  const desktopIsCustom = layoutWidth(layout, "desktop") === "custom";
  const currentBp = breakpoint || "desktop";
  const currentWidth = layoutWidth(layout, currentBp);
  const isViewMode = mode === APP_MODE.VIEW;

  let gridClasses: string;
  let leftSpanClasses: string;
  let rightSpanClasses: string;
  let leftOrderClasses: string;
  let rightOrderClasses: string;
  let gridStyle: CSSProperties = {};

  if (isViewMode) {
    const mobile = toPreset(layoutWidth(layout, "mobile"));
    const tablet = toPreset(layoutWidth(layout, "tablet"));
    const desktop = toPreset(layoutWidth(layout, "desktop"));
    const orders = buildResponsiveOrderClasses(layout);

    gridClasses = buildResponsiveGridClasses(mobile, tablet, desktop, desktopIsCustom);
    leftSpanClasses = buildResponsiveSpanClasses(mobile, tablet, desktop, desktopIsCustom, "left");
    rightSpanClasses = buildResponsiveSpanClasses(mobile, tablet, desktop, desktopIsCustom, "right");
    leftOrderClasses = orders.left;
    rightOrderClasses = orders.right;

    if (desktopIsCustom) {
      gridStyle = {
        ["--two-cols-template-lg" as string]: customGridTemplate(
          customDesktop.left,
          customDesktop.right
        ),
      };
    }
  } else if (currentWidth === "custom") {
    const orders = buildEditOrderClasses(isReversed(layout, currentBp));

    gridClasses = "grid gap-4";
    gridStyle = {
      gridTemplateColumns: customGridTemplate(customDesktop.left, customDesktop.right),
    };
    leftSpanClasses = "";
    rightSpanClasses = "";
    leftOrderClasses = orders.left;
    rightOrderClasses = orders.right;
  } else {
    const preset = toPreset(currentWidth);
    const spans = buildPresetSpanClasses(preset);
    const orders = buildEditOrderClasses(isReversed(layout, currentBp));

    gridClasses = buildPresetGridClasses(preset);
    leftSpanClasses = spans.left;
    rightSpanClasses = spans.right;
    leftOrderClasses = orders.left;
    rightOrderClasses = orders.right;
  }

  const dataAttributes = Object.entries(twoColumnsNode.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => ({ ...acc, [`data-ce-${key}`]: value }),
    {}
  );
  const isFluid = twoColumnsNode.attributes?.options?.fluid ?? false;

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn(
        `ce-two_columns ce-two_columns-${isFluid ? "fluid" : "no-fluid"}`,
        node?.attributes?.className
      )}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div className={cn(gridClasses, isFluid && "w-full")} style={gridStyle}>
        <div className={cn("ce-two_columns-col min-w-0", leftSpanClasses, leftOrderClasses)}>
          <NodeCollection nodes={getChildren("left")} parentId={node.id} zone="left" />
        </div>
        <div className={cn("ce-two_columns-col min-w-0", rightSpanClasses, rightOrderClasses)}>
          <NodeCollection nodes={getChildren("right")} parentId={node.id} zone="right" />
        </div>
      </div>
    </div>
  );
};

export default View;
