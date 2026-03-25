import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import Form from "../../components/form";
import type { NodeFormMethod, NodeFormType } from "./index";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Text2Settings } from "../Settings";

const methodOptions: { value: NodeFormMethod; label: string }[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const formNode = node as NodeFormType;
  const content = formNode.content ?? { method: "POST", action: "" };

  return (
    <NodeSettingsWrapper
      header={
        <>
          <Form.Group>
            <Form.Label text="Méthode HTTP" />
            <Form.Select
              value={content.method ?? "POST"}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: {
                    ...content,
                    method: value as NodeFormMethod,
                  },
                })
              }
              options={methodOptions}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="URL d'action" />
            <Form.Input
              value={content.action ?? ""}
              onChange={(action) =>
                onChange({
                  ...node,
                  content: { ...content, action },
                })
              }
              placeholder="/contact ou https://…"
            />
          </Form.Group>
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
          <Background2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
          <Border2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
          <Spacing2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
        </>
      }
    />
  );
};

export default Settings;
