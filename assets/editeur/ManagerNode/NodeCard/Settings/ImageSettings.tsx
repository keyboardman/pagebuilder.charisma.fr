import Form from "../../../components/form";
import { InputFile } from "../../../components/form/InputFile";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "../index";
import { ClassName2Settings } from "../../Settings";
import { Border2Settings, Object2Settings, Background2Settings } from "../../Settings";

export function ImageSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;

  const className = cardNode.content?.image?.className || "";
  const style = cardNode.content?.image?.style || {};

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Form.Group className="mb-0">
        <Form.Label text="Image" />
        <InputFile
          type="text"
          value={cardNode.content?.image?.src || ""}
          onChange={(value: string) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                image: { ...cardNode.content?.image, src: value },
              },
            });
          }}
          acceptedTypes="image/*"
          placeholder="URL de l'image"
          className="h-7 text-sm"
        />
      </Form.Group>
      <Form.Group className="mb-0">
        <Form.Label text="Texte alternatif" />
        <Form.Input
          type="text"
          value={cardNode.content?.image?.alt || ""}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                image: { ...cardNode.content?.image, alt: value },
              },
            });
          }}
          placeholder="Description de l'image"
          className="h-7 text-sm"
        />
      </Form.Group>
      <ClassName2Settings
        classes={className}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              image: { ...cardNode.content?.image, className },
            },
          })
        }
      />
      <Object2Settings
        style={style}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              image: { ...cardNode.content?.image, style },
            },
          })
        }
      />
      <Border2Settings
        style={style}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              image: { ...cardNode.content?.image, style },
            },
          })
        }
      />
      <Background2Settings
        style={style}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              image: { ...cardNode.content?.image, style },
            },
          })
        }
      />
    </div>
  );
}

export default ImageSettings;