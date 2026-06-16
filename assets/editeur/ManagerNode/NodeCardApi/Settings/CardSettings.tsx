import Form from "../../../components/form";
import { Switch } from "@/editeur/components/ui/switch";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardApiType, ContainerPosition, ContainerRatio } from "../index";
import type { ContainerAlign } from "../../NodeCard";
import { Spacing2Settings, Border2Settings, Background2Settings, getCardApiThemeSelector } from "../../Settings";
import { ContainerAlignOptions, ContainerPositionOptions, ContainerRatioOptions } from "../index";


export function CardSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardApiType;
  const themeOverrideSelector = getCardApiThemeSelector(cardNode.content?.container?.position, "card");
  const content = cardNode.content || {};
  const cardStyle = content?.card?.style || {};
  const gap = content?.container?.style?.gap || "";

  console.log([{'label': '...', 'value': ''}, ...ContainerRatioOptions]);

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex flex-1 items-center justify-between p-2 gap-2">
        <div>
          Title&nbsp;
          <Switch
            id="show-title"
            checked={content?.show?.title !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: {
                    ...content.show,
                    title: checked,
                  },
                },
              });
            }}
          />
        </div>
        <div>
          Text&nbsp;
          <Switch
            checked={content?.show?.text !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: {
                    ...content.show,
                    text: checked,
                  },
                },
              });
            }}
          />
        </div>
        <div>
          Label&nbsp;
          <Switch
            checked={content?.show?.labels !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: {
                    ...content.show,
                    labels: checked,
                  },
                },
              });
            }}
          />

        </div>
      </div>
      <Form.Group>
        <Form.Label text="Position de l'image" />
        <Form.Select
          value={content.container?.position || "top"}
          onChange={(value) => {
            const newPosition = value as ContainerPosition;

            let newRatio = "1_3" as ContainerRatio;
            let newAlign = "center" as ContainerAlign;

            if(newPosition === "top" || newPosition === "overlay") { 
              newRatio = "full" as ContainerRatio;
              newAlign = "start" as ContainerAlign;
            }

            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  position: newPosition,
                  ratio: newRatio,
                  align: newAlign
                },
              },
            });
          }}
          options={ContainerPositionOptions}
          className="h-7 text-sm"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label text="Alignement du contenu" />
        <Form.Select
          options={ContainerAlignOptions}
          value={content.container?.position || "top"}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  align: value as ContainerAlign,
                },
              },
            });
          }}
          className="h-7 text-sm"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label text="Taille de l'image" />
        <Form.Select
          options={[{'label': '...', 'value': ''}, ...ContainerRatioOptions]}
          value={content.container?.ratio || ""}
          onChange={(value) => {
            

            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  ratio: value as ContainerRatio,
                },
              },
            });
          }}
          className="h-7 text-sm"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label text="Gap contenu" />
        <Form.Input
          type="text"
          value={gap !== undefined ? String(gap) : ""}
          placeholder="Ex: 10px"
          onChange={(value) => {
            onChange( {
              ...node,
              content: {
                ...node.content,
                container: { ...content.container, style: { ...content.container?.style, gap: value } },
              },
            });
          }}
        />
      </Form.Group>

      <Background2Settings themeOverrideSelector={themeOverrideSelector}
        style={cardStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          card: { ...cardNode.content?.card, style }
        }
      })} />

      <Border2Settings themeOverrideSelector={themeOverrideSelector}
        style={cardStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          card: { ...cardNode.content?.card, style }
        }
      })} />
      <Spacing2Settings themeOverrideSelector={themeOverrideSelector}
        style={cardStyle} onChange={(style) => onChange({
        ...node,
        content: {
          ...cardNode.content,
          card: { ...cardNode.content?.card, style }
        }
      })} />
    </div>
  );
}
