import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Spacing2Settings, Text2Settings, Object2Settings, Border2Settings, THEME_SELECTORS } from "../Settings";
// theme selectors added below
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

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <Base2Settings
                attributes={node.attributes}
                onChange={(attributes: { className?: string; id?: string }) =>
                  onChange({
                    ...node,
                    attributes: { ...node.attributes, ...attributes },
                  })
                }
              />
              <TabsList className="justify-center w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="general">
                <Form.Group className="mb-2">
                  <Form.Label text="Endpoint videos home" />
                  <Input value={endpoint} disabled />
                </Form.Group>
                <Background2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={containerStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, container: { ...content.container, style } },
                    })
                  }
                />
                <Spacing2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={containerStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, container: { ...content.container, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="card">
                <Background2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={cardStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, card: { ...content.card, style } },
                    })
                  }
                />
                <Spacing2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={cardStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, card: { ...content.card, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="title">
                <Text2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, title: { ...content.title, style } },
                    })
                  }
                />
                <Background2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, title: { ...content.title, style } },
                    })
                  }
                />
                <Spacing2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, title: { ...content.title, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="image">
                <Object2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={imageStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, image: { ...content.image, style } },
                    })
                  }
                />
                <Border2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={imageStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, image: { ...content.image, style } },
                    })
                  }
                />
                <Spacing2Settings
                  
            themeOverrideSelector={THEME_SELECTORS.videoHome}
            style={imageStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, image: { ...content.image, style } },
                    })
                  }
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
