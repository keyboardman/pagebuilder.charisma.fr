import type React from "react";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { Background2Settings, Border2Settings, Spacing2Settings } from "../../Settings";
import type { NodeIconeType } from "../index";

export function IconStyleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const iconeNode = node as NodeIconeType;
  const iconStyle = iconeNode.content?.iconMedia?.style ?? {};

  const updateStyle = (style: React.CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...iconeNode.content,
        iconMedia: { ...iconeNode.content?.iconMedia, style },
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
