import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeType } from "../../../types/NodeType";
import { ClassName2Settings } from "../../Settings";
import { Border2Settings, Object2Settings, Background2Settings } from "../../Settings";

export function ImageSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeType;


  const className = cardNode.content?.image?.className || "";
  const style = cardNode.content?.image?.style || {};
  return (
    <div className="flex flex-1 flex-col gap-1">

      <ClassName2Settings
        classes={className}
        onChange={(className) => onChange({
          ...node,
          content: {
            ...cardNode.content,
            image: { ...cardNode.content?.image, className }
          }
        })}
      />
      <Object2Settings style={style} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          image: { ...cardNode.content?.image, style }
        }
      })} />
      <Border2Settings style={style} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          image: { ...cardNode.content?.image, style }
        }
      })} />
      <Background2Settings style={style} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          image: { ...cardNode.content?.image, style }
        }
      })} />
    </div>
  );
}

