import type { CSSProperties, FC } from "react";
import {
  Background2Settings,
  Border2Settings,
  Object2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const content = node.content ?? { src: "", poster: "" };
  const style = node.attributes?.style ?? {};

  const updateStyle = (nextStyle: CSSProperties) => {
    onChange({
      ...node,
      attributes: { ...node.attributes, style: nextStyle },
    });
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="video">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="video">Vidéo</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
              <TabsContent value="video" className="mt-0">
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
                    typeMedia="video"
                    className="h-7 text-sm"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Poster" />
                  <InputFile
                    type="text"
                    value={content.poster ?? ""}
                    onChange={(value: string) => {
                      onChange({
                        ...node,
                        content: { ...content, poster: value },
                      });
                    }}
                    typeMedia="image"
                    className="h-7 text-sm"
                  />
                </Form.Group>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="style" className="mt-0">
              <Object2Settings
                themeOverrideSelector={THEME_SELECTORS.video}
                style={style}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.video}
                style={style}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.video}
                style={style}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.video}
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
