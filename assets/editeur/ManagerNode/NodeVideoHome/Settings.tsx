import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Spacing2Settings,
  Text2Settings,
  Object2Settings,
  Border2Settings,
  THEME_SELECTORS,
} from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import Form from "../../components/form";
import { Input } from "@/editeur/components/ui/input";
import type { NodeVideoHomeType } from "./index";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const videoHomeNode = node as NodeVideoHomeType;
  const content = videoHomeNode.content ?? ({} as NodeVideoHomeType["content"]);

  const endpoint = content.endpoint ?? "https://api.charisma.fr/api/charisma/videos/homes";
  const containerStyle = content.container?.style ?? {};
  const cardStyle = content.card?.style ?? {};
  const imageStyle = content.image?.style ?? {};
  const titleStyle = content.title?.style ?? {};

  const updateContainerStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, container: { ...content.container, style } },
    });

  const updateCardStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, card: { ...content.card, style } },
    });

  const updateTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, title: { ...content.title, style } },
    });

  const updateImageStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, image: { ...content.image, style } },
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
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              
            </>
          }
          content={
            <>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes: { className?: string; id?: string }) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, ...attributes },
                    })
                  }
                />
                <Form.Group className="mb-2">
                  <Form.Label text="Endpoint videos home" />
                  <Input value={endpoint} disabled />
                </Form.Group>
              </TabsContent>
              
              <TabsContent value="container" className="mt-0">
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={containerStyle}
                  onChange={updateContainerStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={containerStyle}
                  onChange={updateContainerStyle}
                />
              </TabsContent>
              <TabsContent value="card" className="mt-0">
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={cardStyle}
                  onChange={updateCardStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={cardStyle}
                  onChange={updateCardStyle}
                />
              </TabsContent>
              <TabsContent value="title" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <Object2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={imageStyle}
                  onChange={updateImageStyle}
                />
                <Border2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={imageStyle}
                  onChange={updateImageStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.videoHome}
                  style={imageStyle}
                  onChange={updateImageStyle}
                />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
