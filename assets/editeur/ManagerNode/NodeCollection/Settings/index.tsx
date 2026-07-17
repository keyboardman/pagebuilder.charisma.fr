import { type FC } from "react";
import { type NodeSettingsProps } from "../../NodeConfigurationType";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeCollectionType, CollectionShow } from "../index";
import { normalizeCollectionDisplay, normalizeCollectionView } from "../collectionUtils";
import { DisplayTab } from "./display";
import { SourceTab } from "./SourceTab";
import { StyleTab } from "./StyleTab";
import { CardStylePanel } from "./card";
import { ListApiStylePanel } from "./listApi";
import { VideoStylePanel } from "./video";
import { useCollectionSettingsData } from "./useCollectionSettingsData";

const GENERIC_STYLE_KEYS: Array<keyof CollectionShow> = [
  "image",
  "title",
  "description",
  "counter",
  "like",
  "labels",
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const { collectionType, mode, apiOptions, totalPages, currentPage, currentItemsPerPage } =
    useCollectionSettingsData(collectionNode);

  const display = normalizeCollectionDisplay(content.display);
  const view = normalizeCollectionView(collectionType, content.view);

  const isArticleCardDefault = collectionType === "article" && view === "default";
  const isArticleListApi = collectionType === "article" && view === "article";
  const isVideoDefault = collectionType === "video";

  const updateShow = (key: keyof CollectionShow, checked: boolean) => {
    onChange({
      ...node,
      content: {
        ...content,
        show: {
          ...(content.show ?? {}),
          [key]: checked,
        },
      },
    });
  };

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="source">
      <NodeSettingsWrapper
        header={
          <>
            <TabsList className="mb-3 grid h-auto w-full grid-cols-3 gap-1">
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="display">Affichage</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            <TabsContent value="source" className="mt-0 space-y-2">
              <SourceTab
                node={collectionNode}
                onChange={onChange}
                content={content}
                collectionType={collectionType}
                mode={mode}
                apiOptions={apiOptions}
                totalPages={totalPages}
                currentPage={currentPage}
                currentItemsPerPage={currentItemsPerPage}
              />
            </TabsContent>

            <TabsContent value="display" className="mt-0 space-y-2">
              <DisplayTab
                node={collectionNode}
                onChange={onChange}
                content={content}
                collectionType={collectionType}
                display={display}
                view={view}
              />
            </TabsContent>
          </>
        }
        content={
          <TabsContent value="style" className="mt-0 space-y-2 text-xs">
            {isArticleCardDefault ? (
              <CardStylePanel />
            ) : isArticleListApi ? (
              <ListApiStylePanel />
            ) : isVideoDefault ? (
              <VideoStylePanel />
            ) : (
              <StyleTab show={content.show} onToggle={updateShow} keys={GENERIC_STYLE_KEYS} />
            )}
          </TabsContent>
        }
      />
    </Tabs>
  );
};

export default Settings;
