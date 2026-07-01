import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeRootType } from "./index";
import BackgroundSettings from "./Settings/BackgroundSettings";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const rootNode = node as NodeRootType;

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <NodeSettingsWrapper
        header={
          <TabsList className="justify-center w-full">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="background">Arrière-plan</TabsTrigger>
          </TabsList>
        }
        content={
          <>
            <TabsContent value="general" className="mt-0">
              <Form.Group>
                <Form.Label text="Titre de la page" />
                <Form.Input
                  value={rootNode.content?.title ?? ""}
                  onChange={(value) => {
                    onChange({
                      ...node,
                      content: {
                        ...rootNode.content,
                        title: value,
                      },
                    });
                  }}
                />
              </Form.Group>
            </TabsContent>

            <TabsContent value="background" className="mt-0">
              <BackgroundSettings />
            </TabsContent>
          </>
        }
      />
    </Tabs>
  );
};

export default Settings;
