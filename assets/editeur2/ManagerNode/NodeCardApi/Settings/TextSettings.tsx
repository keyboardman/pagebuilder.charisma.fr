import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { ClassName2Settings, Text2Settings, Spacing2Settings, Background2Settings, Border2Settings } from "../../Settings";
import type { NodeCardApiType } from "../index";

export function TextSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardApiType;
  const textStyle = cardNode.content?.text?.style || {};
  const textClassName = cardNode.content?.text?.className || "";


  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings 
        classes={textClassName}
        onChange={(className) => onChange({
          ...node,
          content: {
            ...cardNode.content,
            text: { ...cardNode.content?.text, className }
          }
        })} 
      />
      <Text2Settings style={textStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          text: { ...cardNode.content?.text, style }
        }
      })} />
      <Background2Settings style={textStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          text: { ...cardNode.content?.text, style }
        }
      })} />
      <Border2Settings style={textStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          text: { ...cardNode.content?.text, style }
        }
      })} />
      <Spacing2Settings style={textStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          text: { ...cardNode.content?.text, style }
        }
      })} />
    </div>
  );
}