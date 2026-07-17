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

/** Miroir NodeCardApi TitleSettings. */
export function TitleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(content.container?.position, "title");
  const titleStyle = content.title?.style ?? {};
  const titleClassName = content.title?.className ?? "";

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings
        classes={titleClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...content,
              title: { ...content.title, className },
            },
          })
        }
      />
      <Text2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={titleStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              title: { ...content.title, style },
            },
          })
        }
      />
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={titleStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              title: { ...content.title, style },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={titleStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              title: { ...content.title, style },
            },
          })
        }
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={titleStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              title: { ...content.title, style },
            },
          })
        }
      />
    </div>
  );
}
