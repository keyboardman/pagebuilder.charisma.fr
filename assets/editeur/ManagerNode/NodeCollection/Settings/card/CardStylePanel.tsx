import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { CardLayoutSettings } from "./CardLayoutSettings";
import { ContainerSettings } from "./ContainerSettings";
import { ImageSettings } from "./ImageSettings";
import { TitleSettings } from "./TitleSettings";
import { TextSettings } from "./TextSettings";
import { LabelsSettings } from "./LabelsSettings";

/**
 * Panneau Style Card pour article + view=default.
 * Miroir des onglets NodeCardApi (Card / Container / Image / Title / Text / Labels).
 */
export const CardStylePanel: FC = () => {
  return (
    <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="card">
      <TabsList className="mb-2 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="card">Card</TabsTrigger>
        <TabsTrigger value="container">Container</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      <TabsList className="mb-2 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="title">Titre</TabsTrigger>
        <TabsTrigger value="text">Texte</TabsTrigger>
        <TabsTrigger value="labels">Labels</TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="mt-0">
        <CardLayoutSettings />
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
    </Tabs>
  );
};
