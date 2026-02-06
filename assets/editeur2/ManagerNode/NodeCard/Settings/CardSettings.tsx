import Form from "../../../components/form";
import { Switch } from "@editeur/components/ui/switch";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "../index";
import type { ContainerAlign, ContainerPosition, ContainerRatio } from "../index";
import { Spacing2Settings, Border2Settings, Background2Settings } from "../../Settings";

const imagePositionOptions = [
  { label: "En haut", value: "top" },
  { label: "À gauche", value: "left" },
  { label: "À droite", value: "right" },
  { label: "Overlay", value: "overlay" },
];

const imageAlignOptions = [
  { label: "Début", value: "start" },
  { label: "Centre", value: "center" },
  { label: "Fin", value: "end" },
  { label: "Étirer", value: "stretch" },
];

const imageRatioOptions = [
  { label: "1/4", value: "1/4" },
  { label: "1/3", value: "1/3" },
  { label: "2/5", value: "2/5" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "Plein", value: "full" },
];

export function CardSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const link = content?.container?.link || "";
  const isOverlay = content.container?.position === "overlay";
  const cardStyle = content?.card?.style || {};
  const _textOverlay = content.container?.textOverlay || {
    position: "bottom" as const,
    background: {},
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex flex-1 items-center justify-between p-2 gap-2">
        <div>
          Titre&nbsp;
          <Switch
            checked={content?.show?.title !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: { ...content.show, title: checked },
                },
              });
            }}
          />
        </div>
        <div>
          Texte&nbsp;
          <Switch
            checked={content?.show?.text !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: { ...content.show, text: checked },
                },
              });
            }}
          />
        </div>
        <div>
          Labels&nbsp;
          <Switch
            checked={content?.show?.labels !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...cardNode.content,
                  show: { ...content.show, labels: checked },
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
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  position: newPosition,
                  textOverlay:
                    newPosition === "overlay"
                      ? (content.container?.textOverlay || {
                          position: "bottom",
                          background: {},
                        })
                      : content.container?.textOverlay,
                },
              },
            });
          }}
          options={imagePositionOptions}
          className="h-7 text-sm"
        />
      </Form.Group>
      {isOverlay && (
        <>
          <Form.Group className="mb-0">
            <Form.Label text="Position du contenu" />
            <Form.Select
              options={[
                { label: "Bas", value: "bottom" },
                { label: "Haut", value: "top" },
                { label: "Centre", value: "center" },
              ]}
              value={_textOverlay.position || "bottom"}
              onChange={(value) => {
                onChange({
                  ...node,
                  content: {
                    ...cardNode.content,
                    container: {
                      ...cardNode.content?.container,
                      textOverlay: {
                        ..._textOverlay,
                        position: value as "bottom" | "top" | "center",
                      },
                    },
                  },
                });
              }}
              className="h-7 text-sm"
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Form.Label text="Couleur de fond (fallback)" />
            <Form.InputColor
              value={_textOverlay.background?.color || ""}
              onChange={(value) => {
                onChange({
                  ...node,
                  content: {
                    ...cardNode.content,
                    container: {
                      ...cardNode.content?.container,
                      textOverlay: {
                        ..._textOverlay,
                        background: {
                          ..._textOverlay.background,
                          color: value,
                        },
                      },
                    },
                  },
                });
              }}
              className="h-7 text-sm"
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Form.Label text="Gradient CSS" />
            <Form.Input
              type="text"
              value={_textOverlay.background?.gradient || ""}
              onChange={(value) => {
                onChange({
                  ...node,
                  content: {
                    ...cardNode.content,
                    container: {
                      ...cardNode.content?.container,
                      textOverlay: {
                        ..._textOverlay,
                        background: {
                          ..._textOverlay.background,
                          gradient: value,
                        },
                      },
                    },
                  },
                });
              }}
              placeholder="ex: linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
              className="h-7 text-sm"
            />
          </Form.Group>
        </>
      )}
      {!isOverlay && (
        <>
          <Form.Group>
            <Form.Label text="Alignement de l'image" />
            <Form.Select
              value={content.container?.align || "start"}
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
              options={imageAlignOptions}
              className="h-7 text-sm"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="Ratio de l'image" />
            <Form.Select
              value={content.container?.ratio || "1/3"}
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
              options={imageRatioOptions}
              className="h-7 text-sm"
            />
          </Form.Group>
        </>
      )}
      <Form.Group>
        <Form.Label text="Lien (image + titre)" />
        <Form.Input
          type="text"
          value={link}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  link: value,
                },
              },
            });
          }}
          placeholder="Ex: https://monsite.fr ou /page"
          className="h-7 text-sm"
        />
      </Form.Group>
      <Background2Settings
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              card: { ...cardNode.content?.card, style },
            },
          })
        }
      />
      <Border2Settings
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              card: { ...cardNode.content?.card, style },
            },
          })
        }
      />
      <Spacing2Settings
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              card: { ...cardNode.content?.card, style },
            },
          })
        }
      />
    </div>
  );
}
