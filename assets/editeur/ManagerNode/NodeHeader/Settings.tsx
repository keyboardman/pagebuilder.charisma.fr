import { type FC } from "react";
import { Base2Settings, Background2Settings, Text2Settings, Border2Settings, Spacing2Settings } from "../Settings";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeHeaderType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();

  const headerNode = node as NodeHeaderType;
  
  const currentTag = headerNode.content?.tag ?? "h1";

  const tagOptions = [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
    { value: "h5", label: "H5" },
    { value: "h6", label: "H6" },
  ];

  return (
    <NodeSettingsWrapper 
      header={
        <>
          <Form.Group>
            <Form.Label text="Tag" />
            <Form.Select
              value={currentTag}
              onChange={(value) => {
                onChange({
                  ...node,
                  content: { ...node.content, tag: value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6" },
                });
              }}
              options={tagOptions}
            />
          </Form.Group>
          <Base2Settings 
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) => onChange({
              ...node,
              attributes: { ...node.attributes, ...attributes }
            })}
          />  
        </>
      } 

      content={
        <>
          <Text2Settings 
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Background2Settings 
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Border2Settings 
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Spacing2Settings 
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
        </>
      }/>
  )
}

export default Settings;

