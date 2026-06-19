import type React from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { Background2Settings, Border2Settings, Spacing2Settings, THEME_SELECTORS } from "../Settings";
import type { NodeType } from "../../types/NodeType";

type IconNodeContent = {
  iconMedia?: { style?: React.CSSProperties };
  container?: { style?: React.CSSProperties };
};

type IconNode = NodeType & { content: IconNodeContent };

function createIconNodeStyleSettings(field: "iconMedia" | "container") {
  return function IconNodeStyleSettings() {
    const { node, onChange } = useNodeBuilderContext();
    const iconNode = node as IconNode;
    const style = iconNode.content?.[field]?.style ?? {};

    const updateStyle = (nextStyle: React.CSSProperties) => {
      onChange({
        ...node,
        content: {
          ...iconNode.content,
          [field]: { ...iconNode.content?.[field], style: nextStyle },
        },
      });
    };

    return (
      <div className="flex flex-1 flex-col gap-1">
        <Background2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={style} onChange={updateStyle} />
        <Border2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={style} onChange={updateStyle} />
        <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.textIcon} style={style} onChange={updateStyle} />
      </div>
    );
  };
}

export const IconStyleSettings = createIconNodeStyleSettings("iconMedia");
export const ContainerStyleSettings = createIconNodeStyleSettings("container");
