import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { ClassName2Settings, Text2Settings, Spacing2Settings, Background2Settings, Border2Settings } from "../../Settings";
import type { NodeCardApiType } from "../index";

export function TitleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardApiType;
  const titleStyle = cardNode.content?.title?.style || {};
  const titleClassName = cardNode.content?.title?.className || "";


  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings 
        classes={titleClassName}
        onChange={(className) => onChange({
          ...node,
          content: {
            ...cardNode.content,
            title: { ...cardNode.content?.title, className }
          }
        })} 
      />
      <Text2Settings style={titleStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          title: { ...cardNode.content?.title, style }
        }
      })} />
      <Background2Settings style={titleStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          title: { ...cardNode.content?.title, style }
        }
      })} />
      <Border2Settings style={titleStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          title: { ...cardNode.content?.title, style }
        }
      })} />
      <Spacing2Settings style={titleStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          title: { ...cardNode.content?.title, style }
        }
      })} />
    </div>
  );
}