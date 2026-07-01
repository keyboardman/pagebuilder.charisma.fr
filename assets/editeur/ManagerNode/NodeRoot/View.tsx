import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { useAppContext } from "../../services/providers/AppContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeRootType } from "./index";
import { usePageTitle } from "./utils";
import Content from "./Content";

const View: FC<NodeViewProps|NodeEditProps> = () => {
  const { getChildren, breakpoint } = useAppContext();
  const { node } = useNodeContext();
  const rootNode = node as NodeRootType;

  const _nodes = getChildren(node.id, "main");

  usePageTitle(rootNode.content?.title);

  return (
    <Content
      nodes={_nodes}
      nodeId={node.id}
      breakpoint={breakpoint}
      background={rootNode.content?.background}
    />
  );
}

export default View;
