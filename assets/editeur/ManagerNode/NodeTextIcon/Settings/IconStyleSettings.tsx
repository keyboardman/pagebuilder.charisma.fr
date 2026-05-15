import type React from "react";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { Background2Settings, Border2Settings, Spacing2Settings } from "../../Settings";
import type { NodeTextIconType } from "../index";

export function IconStyleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextIconType;
  const iconStyle = textNode.content?.iconMedia?.style ?? {};

  const updateStyle = (style: React.CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...textNode.content,
        iconMedia: { ...textNode.content?.iconMedia, style },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Background2Settings style={iconStyle} onChange={updateStyle} />
      <Border2Settings style={iconStyle} onChange={updateStyle} />
      <Spacing2Settings style={iconStyle} onChange={updateStyle} />
    </div>
  );
}
