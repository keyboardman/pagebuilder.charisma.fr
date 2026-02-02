import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";

const View: FC<NodeViewProps|NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeVideoType };
  const { id, className, style } = node.attributes ?? {};

  return (
    <video
      data-ce-id={node.id}
      data-ce-type={node.type}
      preload="false"
      id={id}
      className={className}
      style={style}
      src={node.content?.src ?? ""}
      poster={node.content?.poster ?? ""}
      controls={node.content?.controls ?? false}
      autoPlay={node.content?.autoplay ?? false}
    />
  );
}

export default View;
