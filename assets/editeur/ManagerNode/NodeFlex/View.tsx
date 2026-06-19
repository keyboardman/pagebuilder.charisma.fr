import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type { NodeFlexType, NodeFlexOptions } from "./index";
import { cn } from "@/editeur/lib/utils";

const defaultOptions: NodeFlexOptions = {
  direction: "row",
  justify: "flex-start",
  align: "stretch",
  gap: 4,
  wrap: "nowrap",
};

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { mode } = useAppContext();
  const flexNode = node as NodeFlexType;
  const options = { ...defaultOptions, ...flexNode?.attributes?.options };

  const children = getChildren("main");

  const direction = options.direction ?? "row";
  const justify = options.justify ?? "flex-start";
  const isHorizontal = direction === "row" || direction === "row-reverse";
  const isEdit = mode === APP_MODE.EDIT;
  // flex-1 sur la dropzone finale casse center / flex-end / space-* : réservé à flex-start
  const horizontalDropzoneFill = isEdit && isHorizontal && justify === "flex-start";
  const flexWrap = options.wrap ?? "nowrap";

  const flexStyle: React.CSSProperties = {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: options.align ?? "stretch",
    gap: options.gap != null ? `${options.gap * 0.25}rem` : "1rem",
    flexWrap,
    ...(horizontalDropzoneFill ? { width: "100%", minWidth: 0 } : {}),
  };

  const dataAttributes = Object.entries(flexNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`data-ce-${key}`]: value,
    }),
    {}
  );

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn("ce-flex", node?.attributes?.className)}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div style={flexStyle} className="ce-flex-inner">
        <NodeCollection
          nodes={children}
          parentId={node.id}
          zone="main"
          trailingDropzoneFill={horizontalDropzoneFill}
        />
      </div>
    </div>
  );
};

export default View;
