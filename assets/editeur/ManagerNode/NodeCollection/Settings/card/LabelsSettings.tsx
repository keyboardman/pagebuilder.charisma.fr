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

/** Miroir NodeCardApi LabelsSettings. */
export function LabelsSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(content.container?.position, "label");
  const labelsClassName = content.labels?.className ?? "";
  const labelsStyle = content.labels?.style ?? {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <ClassName2Settings
        classes={labelsClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...content,
              labels: { ...content.labels, className },
            },
          })
        }
      />
      <Text2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              labels: { ...content.labels, style },
            },
          })
        }
      />
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              labels: { ...content.labels, style },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              labels: { ...content.labels, style },
            },
          })
        }
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              labels: { ...content.labels, style },
            },
          })
        }
      />
    </div>
  );
}
