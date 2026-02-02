import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useTypographyOptions } from "../../services/typography";
import type { NodeCardType } from "./index";
import { MarginPaddingFields } from "./MarginPaddingFields";

export function TitleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const { fontSizeOptions } = useTypographyOptions();

  const updateTitleStyle = (property: keyof React.CSSProperties, value: string | undefined) => {
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        title: {
          ...cardNode.content.title,
          style: {
            ...cardNode.content.title.style,
            [property]: value as React.CSSProperties[keyof React.CSSProperties],
          },
        }
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
      <h3 className="text-center">Titre</h3>

      <Form.Group>
        <Form.Label text="Classes CSS" />
        <Form.Input
          type="text"
          value={cardNode.content.title.className || ""}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                title: {
                  ...cardNode.content.title,
                  className: value,
                },
              },
            });
          }}
          placeholder="ex: text-xl font-bold"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Couleur" />
        <Form.InputColor
          value={cardNode.content.title.style?.color?.toString() || ""}
          onChange={(value) => updateTitleStyle("color", value)}
        />
      </Form.Group>

      <div className="flex flex-1">
        <Form.Group className="w-1/2">
          <Form.Label text="Taille" />
          <Form.Input
            type="text"
            list="node-card-title-font-sizes"
            value={cardNode.content.title.style?.fontSize?.toString() || ""}
            onChange={(value) => updateTitleStyle("fontSize", value)}
            placeholder="ex: 1.5rem"
          />
          <datalist id="node-card-title-font-sizes">
            {fontSizeOptions.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>
        </Form.Group>

        <Form.Group className="w-1/2">
          <Form.Label text="Poids" />
          <Form.Select
            options={[
              { label: '...', value: '' },
              { label: '100', value: '100' },
              { label: '200', value: '200' },
              { label: '300', value: '300' },
              { label: 'normal', value: 'normal' },
              { label: '500', value: '500' },
              { label: '600', value: '600' },
              { label: 'bold', value: 'bold' },
              { label: '800', value: '800' },
              { label: '900', value: '900' },
            ]}
            value={cardNode.content.title.style?.fontWeight?.toString() || ""}
            onChange={(value) => updateTitleStyle("fontWeight", value)}
          />
        </Form.Group>
      </div>

      <Form.Group>
        <Form.Label text="Famille de police" />
        <Form.FontFamilySelect
          value={cardNode.content.title.style?.fontFamily?.toString() || ""}
          onChange={(value) => updateTitleStyle("fontFamily", value)}
        />
      </Form.Group>

      <hr className="border-border/30 my-2" />
      <MarginPaddingFields
        style={cardNode.content.title.style}
        onStyleChange={updateTitleStyle}
      />
    </div>
  );
}

