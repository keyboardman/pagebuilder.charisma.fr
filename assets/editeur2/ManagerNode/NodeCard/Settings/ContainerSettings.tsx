import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "../index";
import { Background2Settings, Border2Settings, Spacing2Settings } from "../../Settings";

export function ContainerSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const containerStyle = content?.container?.style || {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Background2Settings
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              container: { ...cardNode.content?.container, style },
            },
          })
        }
      />
      <Border2Settings
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              container: { ...cardNode.content?.container, style },
            },
          })
        }
      />
      <Spacing2Settings
        style={containerStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              container: { ...cardNode.content?.container, style },
            },
          })
        }
      />
    </div>
  );
}
