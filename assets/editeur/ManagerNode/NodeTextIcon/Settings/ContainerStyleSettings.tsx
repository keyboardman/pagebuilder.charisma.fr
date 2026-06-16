import type React from "react";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { Background2Settings, Border2Settings, Spacing2Settings, THEME_SELECTORS } from "../../Settings";
import type { NodeTextIconType } from "../index";

export function ContainerStyleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextIconType;
  const containerStyle = textNode.content?.container?.style ?? {};

  const updateStyle = (style: React.CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...textNode.content,
        container: { ...textNode.content?.container, style },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Background2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={containerStyle} onChange={updateStyle} />
      <Border2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={containerStyle} onChange={updateStyle} />
      <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={containerStyle} onChange={updateStyle} />
    </div>
  );
}
