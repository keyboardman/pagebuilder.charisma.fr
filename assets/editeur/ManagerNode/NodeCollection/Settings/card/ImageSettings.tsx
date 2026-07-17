import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import {
  Background2Settings,
  Border2Settings,
  ClassName2Settings,
  Object2Settings,
  getCardApiThemeSelector,
} from "../../../Settings";
import type { NodeCollectionType } from "../../index";

/** Miroir NodeCardApi ImageSettings. */
export function ImageSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(content.container?.position, "image");
  const className = content.image?.className ?? "";
  const style = content.image?.style ?? {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings
        classes={className}
        onChange={(nextClassName) =>
          onChange({
            ...node,
            content: {
              ...content,
              image: { ...content.image, className: nextClassName },
            },
          })
        }
      />
      <Object2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(nextStyle) =>
          onChange({
            ...node,
            content: {
              ...content,
              image: { ...content.image, style: nextStyle },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(nextStyle) =>
          onChange({
            ...node,
            content: {
              ...content,
              image: { ...content.image, style: nextStyle },
            },
          })
        }
      />
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(nextStyle) =>
          onChange({
            ...node,
            content: {
              ...content,
              image: { ...content.image, style: nextStyle },
            },
          })
        }
      />
    </div>
  );
}
