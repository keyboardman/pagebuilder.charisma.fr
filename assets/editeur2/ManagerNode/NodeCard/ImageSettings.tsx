import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "./index";

export function ImageSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;

  const borderRadius = (cardNode.content?.image?.style?.borderRadius as string) || "";
  const className = cardNode.content?.image?.className || "";
  const aspectRatio = cardNode.content?.image?.style?.aspectRatio || "";
  const objectFit = cardNode.content?.image?.style?.objectFit || "";
  return (
    <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
      <h3 className="text-center">Image</h3>

      <div className="flex flex-col gap-1 mb-1">
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
                  image: {
                    ...cardNode.content.image,
                    src: value,
                  },
                },
              });
            }}
            acceptedTypes="image/*"
            placeholder="URL de l'image"
            className="h-7 text-sm"
          />
        </Form.Group>

        <Form.Group className="mb-0">
          <Form.Label text="Texte alternatif de l'image" />
          <Form.Input
            type="text"
            value={cardNode.content?.image?.alt || ""}
            onChange={(value) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  image: {
                    ...cardNode.content.image,
                    alt: value,
                  },
                },
              });
            }}
            placeholder="Description de l'image"
            className="h-7 text-sm"
          />
        </Form.Group>

        <Form.Group className="mb-0">
          <Form.Label text="Classes" />
          <Form.Input
            type="text"
            value={className}
            onChange={(value) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  image: {
                    ...cardNode.content.image,
                    className: value,
                  },
                },
              });
            }}
            placeholder="Ex: rounded-lg shadow-md"
            className="h-7 text-sm"
          />
        </Form.Group>

        <Form.Group className="mb-0">
          <Form.Label text="Border radius" />
          <Form.Input
            type="text"
            value={borderRadius}
            onChange={(value) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  image: {
                    ...cardNode.content.image,
                    style: {
                      ...(cardNode.content?.image?.style ?? {}),
                      borderRadius: value,
                    },
                  },
                },
              });
            }}
            placeholder="Ex: 12px, 0.5rem, 50%"
            className="h-7 text-sm"
          />
        </Form.Group>
        
        <Form.Group className="mb-0">
          <Form.Label text="aspect-ratio" />
          <Form.Input
            type="text"
            value={aspectRatio?.toString() ?? ""}
            placeholder="ex: 16/9, 4/3, 1/1, auto"
            onChange={(value) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  image: {
                    ...cardNode.content.image,
                    style: {
                      ...(cardNode.content?.image?.style ?? {}),
                      aspectRatio: value,
                    },
                  },
                },
              });
            }}
            className="h-7 text-sm"
          />
        </Form.Group>
        
        <Form.Group className="mb-0">
          <Form.Label text="object-fit" />
          <Form.Select 
            options={[
              { label: '...', value: '' },
              { label: 'fill', value: 'fill' },
              { label: 'contain', value: 'contain' },
              { label: 'cover', value: 'cover' },
              { label: 'none', value: 'none' },
              { label: 'scale-down', value: 'scale-down' }
            ]}
            value={objectFit}
            onChange={(value) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  image: {
                    ...cardNode.content.image,
                    style: {
                      ...(cardNode.content?.image?.style ?? {}),
                      objectFit: value,
                    },
                  },
                },
              });
            }}
            className="h-7 text-sm"
          />
        </Form.Group>
      </div>
    </div>
  );
}

