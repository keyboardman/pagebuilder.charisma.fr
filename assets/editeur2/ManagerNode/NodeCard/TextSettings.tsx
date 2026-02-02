import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useTypographyOptions } from "../../services/typography";
import type { NodeCardType } from "./index";
import { MarginPaddingFields } from "./MarginPaddingFields";

export function TextSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const textStyle = cardNode.content?.text?.style || {};
  const textClassName = cardNode.content?.text?.className || "";
  const { fontSizeOptions } = useTypographyOptions();

  const updateTextStyle = (property: keyof React.CSSProperties, value: string | undefined) => {
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        text: {
          ...cardNode.content.text,
          style: {
            ...cardNode.content.text.style,
            [property]: value as React.CSSProperties[keyof React.CSSProperties],
          },
        }
      },
    });
  };

  const updateTextClassName = (value: string) => {
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        text: {
          ...cardNode.content.text,
          className: value,
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
      <h3 className="text-center">Texte</h3>
      
      <Form.Group>
        <Form.Label text="Classes CSS" />
        <Form.Input
          type="text"
          value={textClassName}
          onChange={updateTextClassName}
          placeholder="ex: text-sm text-muted-foreground"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Couleur" />
        <Form.InputColor
          value={textStyle?.color?.toString() || ""}
          onChange={(value) => updateTextStyle("color", value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Alignement" />
        <Form.Select
          options={[
            { label: "...", value: "" },
            { label: "gauche", value: "left" },
            { label: "centre", value: "center" },
            { label: "droite", value: "right" },
            { label: "justifié", value: "justify" },
          ]}
          value={textStyle?.textAlign?.toString() || ""}
          onChange={(value) => updateTextStyle("textAlign", value)}
        />
      </Form.Group>

      <div className="flex flex-1">
        <Form.Group className="w-1/2">
          <Form.Label text="Taille" />
          <Form.Input
            type="text"
            list="node-card-text-font-sizes"
            value={textStyle?.fontSize?.toString() || ""}
            onChange={(value) => updateTextStyle("fontSize", value)}
            placeholder="ex: 1rem"
          />
          <datalist id="node-card-text-font-sizes">
            {fontSizeOptions.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>
        </Form.Group>

        <Form.Group className="w-1/2">
          <Form.Label text="Style" />
          <Form.Select
            options={[
              { label: '...', value: '' },
              { label: 'normal', value: 'normal' },
              { label: 'italic', value: 'italic' },
              { label: 'oblique', value: 'oblique' },
            ]}
            value={textStyle?.fontStyle?.toString() || ""}
            onChange={(value) => updateTextStyle("fontStyle", value)}
          />
        </Form.Group>
      </div>

      <hr className="border-border/30 my-2" />
      <MarginPaddingFields
        style={cardNode.content?.text?.style}
        onStyleChange={updateTextStyle}
      />
    </div>
  );
}

