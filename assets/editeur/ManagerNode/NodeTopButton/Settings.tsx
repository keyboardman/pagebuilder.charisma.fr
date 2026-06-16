import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeTopButtonType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Border2Settings, THEME_SELECTORS } from "../Settings";
// theme selectors added below

const HORIZONTAL_ALIGN_OPTIONS = [
  { value: "right", label: "Droite" },
  { value: "left", label: "Gauche" },
] as const;

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const topButtonNode = node as NodeTopButtonType;

  return (
    <NodeSettingsWrapper
      header={
        <>
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) =>
              onChange({
                ...node,
                attributes: {
                  ...node.attributes,
                  ...attributes,
                },
              })
            }
          />
          <Form.Group>
            <Form.Label text="Couleur icone" />
            <Form.InputColor
              value={topButtonNode.content?.iconColor ?? "#ffffff"}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: { ...node.content, iconColor: value ?? "#ffffff" },
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="Position horizontale" />
            <Form.Select
              value={topButtonNode.content?.horizontalAlign ?? "right"}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: {
                    ...node.content,
                    horizontalAlign: (value === "left" ? "left" : "right"),
                  },
                })
              }
              options={[...HORIZONTAL_ALIGN_OPTIONS]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="Decalage bas (px)" />
            <Form.Input
              type="number"
              min="0"
              value={String(topButtonNode.content?.offsetBottom ?? 24)}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: {
                    ...node.content,
                    offsetBottom: Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 24,
                  },
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="Decalage lateral (px)" />
            <Form.Input
              type="number"
              min="0"
              value={String(topButtonNode.content?.offsetSide ?? 24)}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: {
                    ...node.content,
                    offsetSide: Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 24,
                  },
                })
              }
            />
          </Form.Group>

        </>
      }
      content={
        <>
          <Background2Settings
            
            themeOverrideSelector={THEME_SELECTORS.topButton}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            
            themeOverrideSelector={THEME_SELECTORS.topButton}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
        </>
      }
    />
  );
};

export default Settings;
