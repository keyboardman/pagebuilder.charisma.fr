import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Spacing2Settings, Text2Settings } from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { Input } from "@/editeur/components/ui/input";
import Form from "../../components/form";
import type { NodeAnniversaireType } from "./index";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const anniversaireNode = node as NodeAnniversaireType;

  const content = anniversaireNode.content ?? {};
  const containerStyle = content.container?.style ?? {};
  const titleStyle = content.title?.style ?? {};
  const dayStyle = content.day?.style ?? {};
  const anniversairesStyle = content.anniversaires?.style ?? {};
  const titleText = content.title?.text ?? "";

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
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="date">Date</TabsTrigger>
                <TabsTrigger value="anniversaires">Anniversaires</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="general">
                <Background2Settings
                  style={containerStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        container: {
                          ...content.container,
                          style,
                        },
                      },
                    })
                  }
                />
                <Spacing2Settings
                  style={containerStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        container: {
                          ...content.container,
                          style,
                        },
                      },
                    })
                  }
                />
              </TabsContent>

              <TabsContent value="title">
                <Form.Group className="mb-2">
                  <Form.Label text="Titre" />
                  <Input
                    type="text"
                    value={titleText}
                    onChange={(event) =>
                      onChange({
                        ...node,
                        content: {
                          ...content,
                          title: {
                            ...content.title,
                            text: event.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Anniversaires de mariage"
                  />
                </Form.Group>
                <Text2Settings
                  style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        title: {
                          ...content.title,
                          style,
                        },
                      },
                    })
                  }
                />
                <Background2Settings
                  style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        title: {
                          ...content.title,
                          style,
                        },
                      },
                    })
                  }
                />
                <Spacing2Settings
                  style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        title: {
                          ...content.title,
                          style,
                        },
                      },
                    })
                  }
                />
              </TabsContent>

              <TabsContent value="date">
                <Text2Settings
                  style={dayStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        day: {
                          ...content.day,
                          style,
                        },
                      },
                    })
                  }
                />
                <Background2Settings
                  style={dayStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        day: {
                          ...content.day,
                          style,
                        },
                      },
                    })
                  }
                />
                <Spacing2Settings
                  style={dayStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        day: {
                          ...content.day,
                          style,
                        },
                      },
                    })
                  }
                />
              </TabsContent>

              <TabsContent value="anniversaires">
                <Text2Settings
                  style={anniversairesStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        anniversaires: {
                          ...content.anniversaires,
                          style,
                        },
                      },
                    })
                  }
                />
                <Background2Settings
                  style={anniversairesStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        anniversaires: {
                          ...content.anniversaires,
                          style,
                        },
                      },
                    })
                  }
                />
                <Spacing2Settings
                  style={anniversairesStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        anniversaires: {
                          ...content.anniversaires,
                          style,
                        },
                      },
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
