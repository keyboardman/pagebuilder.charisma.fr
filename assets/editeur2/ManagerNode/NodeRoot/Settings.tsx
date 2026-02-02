import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeRootType, TypographyElement, DefaultStyle } from "./index";
import { DEFAULT_TYPOGRAPHY_STYLES } from "./index";
import { useTypographyOptions } from "../../services/typography";

const elements: TypographyElement[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p'];
const elementLabels: Record<TypographyElement, string> = {
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
  h4: 'H4',
  h5: 'H5',
  h6: 'H6',
  div: 'Div',
  p: 'Paragraphe',
};

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const rootNode = node as NodeRootType;
  const defaultStyles = rootNode.content?.defaultStyles || {};
  const { fontSizeOptions } = useTypographyOptions();

  // Valeurs par défaut depuis NodeRoot.default
  const fallbackStyles = DEFAULT_TYPOGRAPHY_STYLES;

  const updateStyle = (element: TypographyElement, property: keyof DefaultStyle, value: string) => {
    const currentStyle = defaultStyles[element] || fallbackStyles[element];

    onChange({
      ...node,
      content: {
        ...rootNode.content,
        defaultStyles: {
          ...defaultStyles,
          [element]: {
            ...currentStyle,
            [property]: value,
          },
        },
      },
    });
  };

  return (
    <>
      <Form.Group>
        <Form.Label text="Titre de la page" />
        <Form.Input
          value={rootNode.content?.title ?? ""}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...rootNode.content,
                title: value,
              },
            });
          }}
        />
      </Form.Group>

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-sm font-semibold text-foreground/80">Styles par défaut</h3>
        
        {elements.map((element, index) => {
          const style = defaultStyles[element] || fallbackStyles[element];

          return (
            <div key={element} className="flex flex-col gap-2">
              {index > 0 && <div className="border-t border-border/20 my-2" />}
              <h4 className="text-sm font-medium text-foreground/70 mb-1">{elementLabels[element]}</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Form.Group>
                  <Form.Label text="Taille" />
                  <Form.Input
                    value={style.fontSize}
                    list="node-root-font-sizes"
                    onChange={(value) => updateStyle(element, 'fontSize', value)}
                    placeholder="ex: 1rem, 16px"
                  />
                  <datalist id="node-root-font-sizes">
                    {fontSizeOptions.map((size) => (
                      <option key={size} value={size} />
                    ))}
                  </datalist>
                </Form.Group>

                <Form.Group>
                  <Form.Label text="Famille" />
                  <Form.FontFamilySelect
                    value={style.fontFamily}
                    onChange={(value) => updateStyle(element, 'fontFamily', value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label text="Hauteur de ligne" />
                  <Form.Input
                    value={style.lineHeight}
                    onChange={(value) => updateStyle(element, 'lineHeight', value)}
                    placeholder="ex: 1.5rem"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label text="Couleur" />
                  <Form.InputColor
                    value={style.color}
                    onChange={(value) => updateStyle(element, 'color', value)}
                    placeholder="ex: var(--foreground)"
                  />
                </Form.Group>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Settings;
