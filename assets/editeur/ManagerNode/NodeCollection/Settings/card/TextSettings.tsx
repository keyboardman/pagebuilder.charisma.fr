import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import {
  Background2Settings,
  Border2Settings,
  ClassName2Settings,
  Spacing2Settings,
  Text2Settings,
  getCardApiThemeSelector,
} from "../../../Settings";
import type { NodeCollectionType } from "../../index";

/** Miroir NodeCardApi TextSettings — styles sur `content.text`. */
export function TextSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(content.container?.position, "text");
  const textStyle = content.text?.style ?? {};
  const textClassName = content.text?.className ?? "";

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings
        classes={textClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...content,
              text: { ...content.text, className },
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
              ...content,
              text: { ...content.text, style },
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
              ...content,
              text: { ...content.text, style },
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
              ...content,
              text: { ...content.text, style },
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
              ...content,
              text: { ...content.text, style },
            },
          })
        }
      />
    </div>
  );
}
