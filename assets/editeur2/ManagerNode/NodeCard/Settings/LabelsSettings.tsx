import Form from "../../../components/form";
import { Input } from "@editeur/components/ui/input";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "../index";
import {
  ClassName2Settings,
  Text2Settings,
  Spacing2Settings,
  Background2Settings,
  Border2Settings,
} from "../../Settings";

export function LabelsSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;

  const labelsClassName = cardNode.content?.labels?.className || "";
  const labelsStyle = cardNode.content?.labels?.style || {};
  const items = cardNode.content?.labels?.items ?? [];
  const inputValue = items.join(", ");

  const handleLabelsInputChange = (value: string) => {
    const labels = value
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        labels: { ...cardNode.content?.labels, items: labels },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Form.Group className="mb-0">
        <Form.Label text="Labels (séparés par des virgules)" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleLabelsInputChange(e.target.value)}
          placeholder="label1, label2, label3"
        />
      </Form.Group>
      <ClassName2Settings
        classes={labelsClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              labels: { ...cardNode.content?.labels, className },
            },
          })
        }
      />
      <Text2Settings
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              labels: { ...cardNode.content?.labels, style },
            },
          })
        }
      />
      <Background2Settings
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              labels: { ...cardNode.content?.labels, style },
            },
          })
        }
      />
      <Border2Settings
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              labels: { ...cardNode.content?.labels, style },
            },
          })
        }
      />
      <Spacing2Settings
        style={labelsStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              labels: { ...cardNode.content?.labels, style },
            },
          })
        }
      />
    </div>
  );
}

export default LabelsSettings;