import { type FC } from "react";
import { Base2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  ContainerSettings,
  CardSettings,
  ImageSettings,
  TitleSettings,
  TextSettings,
  LabelsSettings,
} from "./Settings/index";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();

  const baseProps = {
    attributes: node.attributes,
    onChange: (attributes: { className?: string; id?: string }) =>
      onChange({ ...node, attributes: { ...node.attributes, ...attributes } }),
  };

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
              <TabsList className="mb-3 w-full justify-center">
                
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="text">Texte</TabsTrigger>
                <TabsTrigger value="labels">Labels</TabsTrigger>
              </TabsList>
              
            </>
          }
          content={
            <>
              <TabsContent value="general" className="mt-0">
                <Base2Settings {...baseProps} />
              </TabsContent>
              <TabsContent value="card" className="mt-0">
                <CardSettings />
              </TabsContent>
              <TabsContent value="container" className="mt-0">
                <ContainerSettings />
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <ImageSettings />
              </TabsContent>
              <TabsContent value="title" className="mt-0">
                <TitleSettings />
              </TabsContent>
              <TabsContent value="text" className="mt-0">
                <TextSettings />
              </TabsContent>
              <TabsContent value="labels" className="mt-0">
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
