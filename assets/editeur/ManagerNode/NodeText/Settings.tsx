import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeTextType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Text2Settings,
  Border2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextType;
  const currentTag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";

  const tagOptions = [
    { value: "div", label: "Div" },
    { value: "p", label: "Paragraphe" },
  ];

  const updateStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      attributes: { ...node.attributes, style },
    });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
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
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Text2Settings
                themeOverrideSelector={THEME_SELECTORS.text}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.text}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.text}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.text}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
            </TabsContent>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
