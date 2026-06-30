import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { Base2Settings, Spacing2Settings, Border2Settings, THEME_SELECTORS } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeYoutubeType } from ".";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { extractYoutubeVideoId } from "../../utils/youtubeVideoId";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const youtubeNode = node as NodeYoutubeType;
  const content = youtubeNode.content;

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
                  <Form.Label
                    text="ID de la vidéo YouTube"
                    className="text-sm font-medium text-foreground"
                  />
                  <Form.Input
                    type="text"
                    value={content?.videoId ?? ""}
                    onChange={(value) => {
                      onChange({
                        ...node,
                        content: { ...content, videoId: extractYoutubeVideoId(value) },
                      });
                    }}
                    placeholder="Ex: dQw4w9WgXcQ ou https://youtu.be/dQw4w9WgXcQ"
                  />
                  <div className="mt-1 text-sm font-medium text-foreground">
                    Collez l&apos;URL complète de la vidéo ou saisissez son ID YouTube
                  </div>
                </Form.Group>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.youtube}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.youtube}
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
