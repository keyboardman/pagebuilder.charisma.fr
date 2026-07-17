import Form from "../../../../components/form";
import { Switch } from "@/editeur/components/ui/switch";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { ContainerAlign, ContainerPosition, ContainerRatio } from "../../../NodeCard";
import {
  ContainerAlignOptions,
  ContainerPositionOptions,
  ContainerRatioOptions,
} from "../../../NodeCard";
import {
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  getCardApiThemeSelector,
} from "../../../Settings";
import type { NodeCollectionType } from "../../index";

/**
 * Layout + styles card — miroir de NodeCardApi/Settings/CardSettings.
 * Le toggle « Text » écrit `show.description`.
 */
export function CardLayoutSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const themeOverrideSelector = getCardApiThemeSelector(content.container?.position, "card");
  const cardStyle = content.card?.style ?? {};
  const gap = content.container?.style?.gap ?? "";

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Image</span>
          <Switch
            checked={content.show?.image !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...content,
                  show: { ...content.show, image: checked },
                },
              });
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Title</span>
          <Switch
            checked={content.show?.title !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...content,
                  show: { ...content.show, title: checked },
                },
              });
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Text</span>
          <Switch
            checked={content.show?.description !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...content,
                  show: { ...content.show, description: checked },
                },
              });
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Label</span>
          <Switch
            checked={content.show?.labels !== false}
            onCheckedChange={(checked) => {
              onChange({
                ...node,
                content: {
                  ...content,
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
            let newRatio = "1_3" as ContainerRatio;
            let newAlign = "center" as ContainerAlign;

            if (newPosition === "top" || newPosition === "overlay") {
              newRatio = "full";
              newAlign = "start";
            }

            onChange({
              ...node,
              content: {
                ...content,
                container: {
                  ...content.container,
                  position: newPosition,
                  ratio: newRatio,
                  align: newAlign,
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
          value={content.container?.align || "start"}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...content,
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
          options={[{ label: "...", value: "" }, ...ContainerRatioOptions]}
          value={content.container?.ratio || ""}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...content,
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
            onChange({
              ...node,
              content: {
                ...content,
                container: {
                  ...content.container,
                  style: { ...content.container?.style, gap: value },
                },
              },
            });
          }}
        />
      </Form.Group>

      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              card: { ...content.card, style },
            },
          })
        }
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              card: { ...content.card, style },
            },
          })
        }
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={cardStyle}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...content,
              card: { ...content.card, style },
            },
          })
        }
      />
    </div>
  );
}
