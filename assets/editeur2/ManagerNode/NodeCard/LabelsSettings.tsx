import Form from "../../components/form";
import { Input } from "@editeur/components/ui/input";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useTypographyOptions } from "../../services/typography";
import type { NodeCardType } from "./index";
import { useState } from "react";
import { MarginPaddingFields } from "./MarginPaddingFields";

export function LabelsSettings() {
  const { node, onChange } = useNodeBuilderContext();

  const cardNode = node as NodeCardType;
  const [input, setInput] = useState<string>(cardNode.content?.labels?.items?.join(", ") || "");

  const labelsClassName = cardNode.content?.labels?.className || "";
  const labelsStyle = cardNode.content?.labels?.style || {};
  const { fontSizeOptions } = useTypographyOptions();


  // Gérer les changements de l'input
  const handleLabelsInputChange = (value: string) => {
    setInput(value);
    // Convertir en tableau de labels (filtrer les vides) pour l'affichage
    const labels = value
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Mettre à jour à la fois labelsInput (valeur brute) et labels (tableau parsé)
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        labels: {
          ...cardNode.content.labels || {},
          items: labels,
        }
      },
    });
  };

  const updateLabelsClassName = (value: string) => {
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        labels: {
          ...cardNode.content.labels || {},
          className: value,
        }
      },
    });
  };

  const updateLabelsStyle = (property: keyof React.CSSProperties, value: string | undefined) => {
    onChange({
      ...node,
      content: {
        ...cardNode.content,
        labels: {
          ...(cardNode.content.labels || {}),
          style: {
            ...(cardNode.content.labels?.style ?? {}),
            [property]: value as React.CSSProperties[keyof React.CSSProperties],
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
      <h3 className="text-center">Labels</h3>

      <Form.Group>
        <Form.Label text="Labels (séparés par des virgules)" />
        <Input
          type="text"
          value={input}
          onChange={(e) => handleLabelsInputChange(e.target.value)}
          placeholder="label1, label2, label3"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Classes CSS (conteneur)" />
        <Form.Input
          type="text"
          value={labelsClassName}
          onChange={updateLabelsClassName}
          placeholder="ex: gap-3"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Taille de police" />
        <Form.Input
          type="text"
          list="node-card-labels-font-sizes"
          value={labelsStyle?.fontSize?.toString() || ""}
          onChange={(value) => updateLabelsStyle("fontSize", value)}
          placeholder="ex: 12px, 0.75rem"
        />
        <datalist id="node-card-labels-font-sizes">
          {fontSizeOptions.map((size) => (
            <option key={size} value={size} />
          ))}
        </datalist>
      </Form.Group>

      <Form.Group>
        <Form.Label text="Famille de police" />
        <Form.FontFamilySelect
          value={labelsStyle?.fontFamily?.toString() || ""}
          onChange={(value) => updateLabelsStyle("fontFamily", value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Couleur du texte" />
        <Form.InputColor
          value={labelsStyle?.color?.toString() || ""}
          onChange={(value) => updateLabelsStyle("color", value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Couleur de fond" />
        <Form.InputColor
          value={labelsStyle?.backgroundColor?.toString() || ""}
          onChange={(value) => updateLabelsStyle("backgroundColor", value)}
        />
      </Form.Group>

      <hr className="border-border/30 my-2" />
      <MarginPaddingFields
        style={cardNode.content?.labels?.style}
        onStyleChange={updateLabelsStyle}
      />
    </div>
  );
}