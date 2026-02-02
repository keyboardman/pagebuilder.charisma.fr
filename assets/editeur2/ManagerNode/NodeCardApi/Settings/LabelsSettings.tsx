import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardApiType } from "../index";
import { ClassName2Settings, Spacing2Settings, Text2Settings, Background2Settings, Border2Settings} from "../../Settings";

export function LabelsSettings() {
  const { node, onChange } = useNodeBuilderContext();

  const cardNode = node as NodeCardApiType;
  
  const labelsClassName = cardNode.content?.labels?.className || "";
  const labelsStyle = cardNode.content?.labels?.style || {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings 
        classes={labelsClassName}
        onChange={(className) => onChange({
          ...node,
          content: {
            ...cardNode.content,
            labels: { ...cardNode.content.labels, className }
          }
        })} 
      />
      <Text2Settings style={labelsStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          labels: { ...cardNode.content.labels, style }
        }
      })} />
      <Background2Settings style={labelsStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          labels: { ...cardNode.content.labels, style }
        }
      })} />
      <Border2Settings style={labelsStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          labels: { ...cardNode.content.labels, style }
        }
      })} />
      <Spacing2Settings style={labelsStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          labels: { ...cardNode.content.labels, style }
        }
      })} />
    </div>
  );
}