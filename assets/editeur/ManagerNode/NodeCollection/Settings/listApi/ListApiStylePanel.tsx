import type { FC } from "react";
import { Switch } from "@/editeur/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { CollectionShow, NodeCollectionType } from "../../index";
import { StyledPartSettings } from "./StyledPartSettings";

const SHOW_KEYS: Array<{ key: keyof CollectionShow; label: string }> = [
  { key: "title", label: "Titre" },
  { key: "description", label: "Description" },
  { key: "counter", label: "Compteur" },
  { key: "like", label: "Like" },
];

/**
 * Panneau Style pour article + view=article (Variante 1 / Liste API).
 * Style vue article (liste riche) : Container / Item / Titre / Description / Compteur / Like.
 */
export const ListApiStylePanel: FC = () => {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const show = content.show ?? {};

  const updateShow = (key: keyof CollectionShow, checked: boolean) => {
    onChange({
      ...node,
      content: {
        ...content,
        show: {
          ...show,
          [key]: checked,
        },
      },
    });
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="collection">
      <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-2 px-1">
        {SHOW_KEYS.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between gap-2 text-xs">
            <span>{label}</span>
            <Switch
              checked={show[key] !== false}
              onCheckedChange={(checked) => updateShow(key, checked)}
            />
          </label>
        ))}
      </div>

      <TabsList className="mb-2 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="collection">Container</TabsTrigger>
        <TabsTrigger value="item">Item</TabsTrigger>
        <TabsTrigger value="title">Titre</TabsTrigger>
      </TabsList>
      <TabsList className="mb-2 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="counter">Compteur</TabsTrigger>
        <TabsTrigger value="like">Like</TabsTrigger>
      </TabsList>

      <TabsContent value="collection" className="mt-0">
        <StyledPartSettings part="collection" />
      </TabsContent>
      <TabsContent value="item" className="mt-0">
        <StyledPartSettings part="item" />
      </TabsContent>
      <TabsContent value="title" className="mt-0">
        <StyledPartSettings part="title" />
      </TabsContent>
      <TabsContent value="description" className="mt-0">
        <StyledPartSettings part="description" />
      </TabsContent>
      <TabsContent value="counter" className="mt-0">
        <StyledPartSettings part="counter" />
      </TabsContent>
      <TabsContent value="like" className="mt-0">
        <StyledPartSettings part="like" />
      </TabsContent>
    </Tabs>
  );
};
