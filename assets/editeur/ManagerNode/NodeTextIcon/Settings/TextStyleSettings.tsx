import type React from "react";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { Background2Settings, Border2Settings, Spacing2Settings, Text2Settings } from "../../Settings";
import type { NodeTextIconType } from "../index";

export function TextStyleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextIconType;
  const textStyle = textNode.content?.text?.style ?? {};

  const updateStyle = (style: React.CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...textNode.content,
        text: { ...textNode.content?.text, style },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Text2Settings style={textStyle} onChange={updateStyle} />
      <Background2Settings style={textStyle} onChange={updateStyle} />
      <Border2Settings style={textStyle} onChange={updateStyle} />
      <Spacing2Settings style={textStyle} onChange={updateStyle} />
    </div>
  );
}
