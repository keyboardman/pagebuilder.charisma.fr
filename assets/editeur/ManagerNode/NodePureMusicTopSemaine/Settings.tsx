import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Text2Settings } from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { Input } from "@/editeur/components/ui/input";
import Form from "../../components/form";
import type { NodePureMusicTopSemaineType } from "./index";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const topNode = node as NodePureMusicTopSemaineType;
  const content = topNode.content ?? ({} as NodePureMusicTopSemaineType["content"]);

  const endpoint = content.endpoint ?? "https://api.charisma.fr/api/puremusic/musiques/tops/semaine";
  const titleStyle = content.title?.style ?? {};
  const playerStyle = content.player?.style ?? {};
  const playerIconStyle = content.player?.icon?.style ?? {};
  const itemStyle = content.item?.style ?? {};
  const itemNumberStyle = content.item?.number?.style ?? {};
  const itemTitleStyle = content.item?.title?.style ?? {};
  const itemIconStyle = content.item?.icon?.style ?? {};
  const itemDescriptionStyle = content.item?.description?.style ?? {};

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="title">
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
                <TabsTrigger value="title">Header</TabsTrigger>
                <TabsTrigger value="item">Musique</TabsTrigger>
                <TabsTrigger value="player">Player</TabsTrigger>
              </TabsList>
              <TabsList className="justify-center w-full">
                <TabsTrigger value="item-number">N°</TabsTrigger>
                <TabsTrigger value="item-title">Titre</TabsTrigger>
                <TabsTrigger value="item-description">Description</TabsTrigger>
                <TabsTrigger value="item-icon">Icône</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="title">
                <Text2Settings
                  style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, title: { ...content.title, style } },
                    })
                  }
                />
                <Spacing2Settings
                  style={titleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, title: { ...content.title, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="item">
                <Background2Settings
                  style={itemStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, style } },
                    })
                  }
                />
                <Spacing2Settings
                  style={itemStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="item-number">
                <Text2Settings
                  style={itemNumberStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        item: { ...content.item, number: { ...content.item?.number, style } },
                      },
                    })
                  }
                />
                <Background2Settings
                  style={itemNumberStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, number: { ...content.item?.number, style } } },
                    })
                  }
                />
                <Border2Settings
                  style={itemNumberStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, number: { ...content.item?.number, style } } },
                    })
                  }
                />
                <Spacing2Settings
                  style={itemNumberStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, number: { ...content.item?.number, style } } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="item-title">
                <Text2Settings
                  style={itemTitleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, title: { ...content.item?.title, style } } },
                    })
                  }
                />
                <Spacing2Settings
                  style={itemTitleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, title: { ...content.item?.title, style } } },
                    })
                  }
                />
                <Background2Settings
                  style={itemTitleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, title: { ...content.item?.title, style } } },
                    })
                  }
                />
                <Border2Settings
                  style={itemTitleStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, title: { ...content.item?.title, style } } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="item-description">
                <Text2Settings
                  style={itemDescriptionStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, description: { ...content.item?.description, style } } },
                    })
                  }
                />
                <Background2Settings
                  style={itemDescriptionStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, description: { ...content.item?.description, style } } },
                    })
                  }
                />
                <Spacing2Settings
                  style={itemDescriptionStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, description: { ...content.item?.description, style } } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="item-icon">
                <Text2Settings
                  style={itemIconStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, icon: { ...content.item?.icon, style } } },
                    })
                  }
                />
                <Background2Settings
                  style={itemIconStyle}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...content, item: { ...content.item, icon: { ...content.item?.icon, style } } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="player">
                <Form.Group className="mb-0">
                    <Form.Label text="background-color" className="text-foreground" />
                    <Form.InputColor
                        type="text"
                        value={content.player?.style?.backgroundColor?.toString() ?? ""}
                        onChange={(value) => {
                          onChange({
                            ...node,
                            content: { ...content, player: { ...content.player, style: { ...content.player?.style, backgroundColor: value } } },
                          })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="color" className="text-foreground" />
                    <Form.InputColor
                        type="text"
                        value={content.player?.style?.color?.toString() ?? ""}
                        onChange={(value) => {
                          onChange({
                            ...node,
                            content: { ...content, player: { ...content.player, style: { ...content.player?.style, color: value } } },
                          })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
