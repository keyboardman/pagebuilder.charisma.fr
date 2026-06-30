import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Spacing2Settings,
  Text2Settings,
  THEME_SELECTORS,
} from "../Settings";
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

  const updateContainerStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        container: {
          ...content.container,
          style,
        },
      },
    });

  const updateTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        title: {
          ...content.title,
          style,
        },
      },
    });

  const updateDayStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        day: {
          ...content.day,
          style,
        },
      },
    });

  const updateAnniversairesStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        anniversaires: {
          ...content.anniversaires,
          style,
        },
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
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="date">Date</TabsTrigger>
                <TabsTrigger value="anniversaires">Anniversaires</TabsTrigger>
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
              </TabsContent>
              <TabsContent value="container" className="mt-0">
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={containerStyle}
                  onChange={updateContainerStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={containerStyle}
                  onChange={updateContainerStyle}
                />
              </TabsContent>

              <TabsContent value="title" className="mt-0">
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
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={titleStyle}
                  onChange={updateTitleStyle}
                />
              </TabsContent>

              <TabsContent value="date" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={dayStyle}
                  onChange={updateDayStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={dayStyle}
                  onChange={updateDayStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={dayStyle}
                  onChange={updateDayStyle}
                />
              </TabsContent>

              <TabsContent value="anniversaires" className="mt-0">
                <Text2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={anniversairesStyle}
                  onChange={updateAnniversairesStyle}
                />
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={anniversairesStyle}
                  onChange={updateAnniversairesStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.anniversaire}
                  style={anniversairesStyle}
                  onChange={updateAnniversairesStyle}
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
