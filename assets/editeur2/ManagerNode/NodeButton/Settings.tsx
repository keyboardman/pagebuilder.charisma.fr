import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeButtonType, NodeButtonButtonType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Text2Settings, Border2Settings, Size2Settings, Spacing2Settings } from "../Settings";

const BUTTON_TYPE_OPTIONS: { value: NodeButtonButtonType; label: string }[] = [
  { value: "button", label: "Bouton" },
  { value: "submit", label: "Submit" },
  { value: "link", label: "Lien" },
];

const TARGET_OPTIONS = [
  { value: "_self", label: "Même fenêtre" },
  { value: "_blank", label: "Nouvel onglet" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";

  return (
    <NodeSettingsWrapper
      header={
        <>
          <Form.Group>
            <Form.Label text="Type" />
            <Form.Select
              value={buttonType}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: { ...node.content, buttonType: value as NodeButtonButtonType },
                })
              }
              options={BUTTON_TYPE_OPTIONS}
            />
          </Form.Group>
          {buttonType === "link" && (
            <>
              <Form.Group>
                <Form.Label text="URL (href)" />
                <Form.Input
                  type="text"
                  value={href}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, href: value ?? "" },
                    })
                  }
                  className="h-7 text-sm"
                  placeholder="https://..."
                />
              </Form.Group>
              <Form.Group>
                <Form.Label text="Cible (target)" />
                <Form.Select
                  value={target}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, target: value ?? "_self" },
                    })
                  }
                  options={TARGET_OPTIONS}
                />
              </Form.Group>
            </>
          )}
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, ...attributes },
              })
            }
          />
        </>
      }
      content={
        <>
          <Text2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Background2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Size2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Spacing2Settings
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
