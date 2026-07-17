import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import {
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  getCardApiThemeSelector,
} from "../../../Settings";
import type { NodeCollectionType } from "../../index";

/** Styles du bloc contenu — miroir NodeCardApi ContainerSettings. */
export function ContainerSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(
    content.container?.position,
    "container-content"
  );
  const containerStyle = content.container?.style ?? {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              container: { ...content.container, style },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              container: { ...content.container, style },
            },
          })
        }
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              container: { ...content.container, style },
            },
          })
        }
      />
    </div>
  );
}
