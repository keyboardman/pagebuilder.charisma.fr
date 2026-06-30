import { type CSSProperties, type FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Object2Settings,
  Spacing2Settings,
  Size2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

const TARGET_OPTIONS = [
  { value: "_self", label: "Même fenêtre" },
  { value: "_blank", label: "Nouvel onglet" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const content = node.content ?? { src: "", alt: "", href: "", target: "_self" };
  const style = node.attributes?.style ?? {};

  const updateStyle = (nextStyle: CSSProperties) => {
    onChange({
      ...node,
      attributes: { ...node.attributes, style: nextStyle },
    });
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="link">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="link">Lien</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              <TabsContent value="link" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, ...attributes },
                    })
                  }
                />
                <Form.Group>
                  <Form.Label text="URL (href)" />
                  <Form.Input
                    type="text"
                    value={content.href}
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
                    value={content.target}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, target: value ?? "_self" },
                      })
                    }
                    options={TARGET_OPTIONS}
                  />
                </Form.Group>
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <Form.Group>
                  <Form.Label text="Source" />
                  <InputFile
                    type="text"
                    value={content.src ?? ""}
                    onChange={(value: string) => {
                      onChange({
                        ...node,
                        content: { ...content, src: value },
                      });
                    }}
                    typeMedia="image"
                    className="h-7 text-sm"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Alt" />
                  <Form.Input
                    type="text"
                    value={content.alt ?? ""}
                    onChange={(value) => {
                      onChange({
                        ...node,
                        content: { ...content, alt: value },
                      });
                    }}
                    className="h-7 text-sm"
                  />
                </Form.Group>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="image" className="mt-0">
              <Object2Settings
                themeOverrideSelector={THEME_SELECTORS.image}
                style={style}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.image}
                style={style}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.image}
                style={style}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.image}
                style={style}
                onChange={updateStyle}
              />
              <Size2Settings
                themeOverrideSelector={THEME_SELECTORS.image}
                style={style}
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
