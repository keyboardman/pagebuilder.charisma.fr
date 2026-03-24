import { type FC, useState, useEffect } from "react";
import { Base2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardType } from "./index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { ContainerSettings, CardSettings, ImageSettings, TitleSettings, TextSettings, LabelsSettings } from "./Settings/index";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;

  const baseProps = {
    attributes: node.attributes,
    onChange: (attributes: { className?: string; id?: string }) =>
      onChange({ ...node, attributes: { ...node.attributes, ...attributes } }),
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="card">
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
