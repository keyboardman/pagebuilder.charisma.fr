import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps|NodeEditProps> = () => {

  const { node, getChildren } = useNodeContext();

  const children = getChildren("main");

  const dataAttributes = Object.entries(node?.attributes?.options ?? {}).reduce(
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
      <NodeCollection nodes={children} parentId={node.id} zone="main" />
    </div>
  );
}

export default View;
