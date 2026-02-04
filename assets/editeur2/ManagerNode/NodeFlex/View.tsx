import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type { NodeFlexType, NodeFlexOptions } from "./index";

const defaultOptions: NodeFlexOptions = {
  direction: "row",
  justify: "flex-start",
  align: "stretch",
  gap: 4,
  wrap: "nowrap",
};

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const flexNode = node as NodeFlexType;
  const options = { ...defaultOptions, ...flexNode?.attributes?.options };

  const children = getChildren("main");

  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: options.direction ?? "row",
    justifyContent: options.justify ?? "flex-start",
    alignItems: options.align ?? "stretch",
    gap: options.gap != null ? `${options.gap * 0.25}rem` : "1rem",
    flexWrap: options.wrap ?? "nowrap",
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
      className={node?.attributes?.className}
      style={styleForView(node?.attributes?.style)}
      {...dataAttributes}
    >
      <div style={flexStyle}>
        <NodeCollection nodes={children} parentId={node.id} zone="main" />
      </div>
    </div>
  );
};

export default View;
