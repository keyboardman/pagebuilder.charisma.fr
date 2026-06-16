import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import {
  ClassName2Settings,
  Text2Settings,
  Spacing2Settings,
  Background2Settings,
  Border2Settings,
  getCardThemeSelector,
} from "../../Settings";
import type { NodeCardType } from "../index";

export function TextSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const themeOverrideSelector = getCardThemeSelector(cardNode.content?.container?.position, "text");
  const textStyle = cardNode.content?.text?.style || {};
  const textClassName = cardNode.content?.text?.className || "";

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings
        classes={textClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              text: { ...cardNode.content?.text, className },
            },
          })
        }
      />
      <Text2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={textStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              text: { ...cardNode.content?.text, style },
            },
          })
        }
      />
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={textStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              text: { ...cardNode.content?.text, style },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={textStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              text: { ...cardNode.content?.text, style },
            },
          })
        }
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={textStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              text: { ...cardNode.content?.text, style },
            },
          })
        }
      />
    </div>
  );
}

export default TextSettings;