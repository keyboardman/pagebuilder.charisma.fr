import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeTextType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Text2Settings, Border2Settings, Spacing2Settings, THEME_SELECTORS } from "../Settings";
const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextType;
  const currentTag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";

  const tagOptions = [
    { value: "div", label: "Div" },
    { value: "p", label: "Paragraphe" },
  ];

  return (
    <>
      <NodeSettingsWrapper
        header={<>
          <Form.Group>
            <Form.Label text="Type de tag" />
            <Form.Select
              value={currentTag}
              onChange={(value) => {
                onChange({
                  ...node,
                  content: { ...node.content, tag: value as "div" | "p" },
                });
              }}
              options={tagOptions}
            />
          </Form.Group>
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) => onChange({
              ...node,
              attributes: {
                ...node.attributes,
                ...attributes
              }
            })}
          />
          <Form.Group>
            <Form.Label text="Contenu" />
            <Form.Textarea
              value={html}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: { ...node.content, html: value },
                })
              }
              className="min-h-[6rem] text-sm"
            />
          </Form.Group>

        </>}
        content={<>
          <Text2Settings
            themeOverrideSelector={THEME_SELECTORS.text}
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Background2Settings
            themeOverrideSelector={THEME_SELECTORS.text}
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Border2Settings
            themeOverrideSelector={THEME_SELECTORS.text}
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Spacing2Settings
            themeOverrideSelector={THEME_SELECTORS.text}
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
        </>}
      />
    </>
  );
}

export default Settings;
