import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { VideoCardSettings } from "./VideoCardSettings";
import { VideoTitleSettings } from "./VideoTitleSettings";
import { VideoImageSettings } from "./VideoImageSettings";

/**
 * Panneau Style pour collectionType=video (vue default).
 * Miroir des onglets NodeVideoApi (Card / Titre / Image).
 */
export const VideoStylePanel: FC = () => {
  return (
    <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="card">
      <TabsList className="mb-2 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="card">Card</TabsTrigger>
        <TabsTrigger value="title">Titre</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="mt-0">
        <VideoCardSettings />
      </TabsContent>

      <TabsContent value="title" className="mt-0">
        <VideoTitleSettings />
      </TabsContent>

      <TabsContent value="image" className="mt-0">
        <VideoImageSettings />
      </TabsContent>
    </Tabs>
  );
};
