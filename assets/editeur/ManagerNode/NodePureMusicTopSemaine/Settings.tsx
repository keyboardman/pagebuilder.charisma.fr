import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Text2Settings,
  THEME_SELECTORS,
} from "../Settings";
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
  const itemStyle = content.item?.style ?? {};
  const itemNumberStyle = content.item?.number?.style ?? {};
  const itemTitleStyle = content.item?.title?.style ?? {};
  const itemIconStyle = content.item?.icon?.style ?? {};
  const itemDescriptionStyle = content.item?.description?.style ?? {};

  const updateTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, title: { ...content.title, style } },
    });

  const updateItemStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...content, item: { ...content.item, style } },
    });

  const updateItemNumberStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        item: { ...content.item, number: { ...content.item?.number, style } },
      },
    });

  const updateItemTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        item: { ...content.item, title: { ...content.item?.title, style } },
      },
    });

  const updateItemDescriptionStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        item: { ...content.item, description: { ...content.item?.description, style } },
      },
    });

  const updateItemIconStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        item: { ...content.item, icon: { ...content.item?.icon, style } },
      },
    });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="title">Header</TabsTrigger>
                <TabsTrigger value="item">Musique</TabsTrigger>
                <TabsTrigger value="player">Player</TabsTrigger>
              </TabsList>
              <TabsList className="mb-3 w-full justify-center">
                
                <TabsTrigger value="item-number">N°</TabsTrigger>
                <TabsTrigger value="item-title">Titre</TabsTrigger>
                <TabsTrigger value="item-description">Description</TabsTrigger>
                <TabsTrigger value="item-icon">Icône</TabsTrigger>
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
                  <Form.Label text="Endpoint API" />
                  <Input value={endpoint} disabled />
                </Form.Group>
              </TabsContent>
              <TabsContent value="title" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
              </TabsContent>
              <TabsContent value="item" className="mt-0">
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemStyle}
                  onChange={updateItemStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemStyle}
                  onChange={updateItemStyle}
                />
              </TabsContent>
              <TabsContent value="item-number" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemNumberStyle}
                  onChange={updateItemNumberStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemNumberStyle}
                  onChange={updateItemNumberStyle}
                />
                <Border2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemNumberStyle}
                  onChange={updateItemNumberStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemNumberStyle}
                  onChange={updateItemNumberStyle}
                />
              </TabsContent>
              <TabsContent value="item-title" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemTitleStyle}
                  onChange={updateItemTitleStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemTitleStyle}
                  onChange={updateItemTitleStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemTitleStyle}
                  onChange={updateItemTitleStyle}
                />
                <Border2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemTitleStyle}
                  onChange={updateItemTitleStyle}
                />
              </TabsContent>
              <TabsContent value="item-description" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemDescriptionStyle}
                  onChange={updateItemDescriptionStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemDescriptionStyle}
                  onChange={updateItemDescriptionStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemDescriptionStyle}
                  onChange={updateItemDescriptionStyle}
                />
              </TabsContent>
              <TabsContent value="item-icon" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemIconStyle}
                  onChange={updateItemIconStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.pureMusicTopSemaine}
                  style={itemIconStyle}
                  onChange={updateItemIconStyle}
                />
              </TabsContent>
              <TabsContent value="player" className="mt-0">
                <Form.Group className="mb-0">
                  <Form.Label text="background-color" className="text-foreground" />
                  <Form.InputColor
                    type="text"
                    value={playerStyle.backgroundColor?.toString() ?? ""}
                    onChange={(value) => {
                      onChange({
                        ...node,
                        content: {
                          ...content,
                          player: {
                            ...content.player,
                            style: { ...playerStyle, backgroundColor: value },
                          },
                        },
                      });
                    }}
                    className="h-7 text-sm"
                  />
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label text="color" className="text-foreground" />
                  <Form.InputColor
                    type="text"
                    value={playerStyle.color?.toString() ?? ""}
                    onChange={(value) => {
                      onChange({
                        ...node,
                        content: {
                          ...content,
                          player: {
                            ...content.player,
                            style: { ...playerStyle, color: value },
                          },
                        },
                      });
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
