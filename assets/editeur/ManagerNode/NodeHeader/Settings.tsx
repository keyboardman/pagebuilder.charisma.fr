import { type CSSProperties, type FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Text2Settings,
  Border2Settings,
  Spacing2Settings,
  headerTagSelector,
} from "../Settings";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeHeaderType } from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const headerNode = node as NodeHeaderType;
  const currentTag = headerNode.content?.tag ?? "h1";
  const html = headerNode.content?.html ?? "";
  const themeOverrideSelector = headerTagSelector(currentTag);

  const tagOptions = [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
    { value: "h5", label: "H5" },
    { value: "h6", label: "H6" },
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
                  <Form.Label text="Tag" />
                  <Form.Select
                    value={currentTag}
                    onChange={(value) => {
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          tag: value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
                        },
                      });
                    }}
                    options={tagOptions}
                  />
                </Form.Group>
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
                    className="min-h-[5rem] text-sm"
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
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Text2Settings
                themeOverrideSelector={themeOverrideSelector}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={themeOverrideSelector}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={themeOverrideSelector}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={themeOverrideSelector}
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
