import { type FC, useState, useEffect } from "react";
import { Base2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardType } from "./index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@editeur/components/ui/tabs";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { ContainerSettings, CardSettings, ImageSettings, TitleSettings, TextSettings, LabelsSettings } from "./Settings/index";

const TAB_VALUES = ["card", "container", "image", "title", "text", "labels"] as const;
const ELEMENT_TABS = ["image", "title", "text", "labels"] as const;

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const selectedElement = content.selectedElement || null;

  const [activeTab, setActiveTab] = useState<string>(selectedElement || "card");

  useEffect(() => {
    if (selectedElement && ELEMENT_TABS.includes(selectedElement as typeof ELEMENT_TABS[number])) {
      setActiveTab(selectedElement);
    }
  }, [selectedElement]);

  const baseProps = {
    attributes: node.attributes,
    onChange: (attributes: { className?: string; id?: string }) =>
      onChange({ ...node, attributes: { ...node.attributes, ...attributes } }),
  };

  const onTabChange = (value: string) => {
    if (TAB_VALUES.includes(value as typeof TAB_VALUES[number])) {
      setActiveTab(value);
      if (ELEMENT_TABS.includes(value as typeof ELEMENT_TABS[number])) {
        onChange({
          ...node,
          content: {
            ...cardNode.content,
            selectedElement: value as NodeCardType["content"]["selectedElement"],
          },
        });
      }
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <Base2Settings {...baseProps} />
              <TabsList className="justify-center w-full">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
              <TabsList className="justify-center w-full">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="text">Texte</TabsTrigger>
                <TabsTrigger value="labels">Labels</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="card">
                
                <CardSettings />
              </TabsContent>
              <TabsContent value="container">
                <ContainerSettings />
              </TabsContent>
              <TabsContent value="image">
                <ImageSettings />
              </TabsContent>
              <TabsContent value="title">
                <TitleSettings />
              </TabsContent>
              <TabsContent value="text">
                <TextSettings />
              </TabsContent>
              <TabsContent value="labels">
                <LabelsSettings />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
