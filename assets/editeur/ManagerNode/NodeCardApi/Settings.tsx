import { type FC, useEffect, useState } from "react";
import { Base2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardApiType } from "./index";
import { Loader2, AlertCircle, Database } from "lucide-react";
import { Button } from "@/editeur/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  CardSettings,
  ContainerSettings,
  ImageSettings,
  TitleSettings,
  TextSettings,
  LabelsSettings,
} from "./Settings/index";
import {
  fetchCollectionCatalog,
  resolveCollectionEntries,
  type CollectionApiMappedItem,
} from "../NodeCollection/collectionApiUtils";
import { CollectionItemPickerModal } from "../NodeCollection/Settings/CollectionItemPickerModal";

function extractText(item: CollectionApiMappedItem): string {
  const fromText = item.text?.trim();
  if (fromText) return fromText;
  return item.description?.trim() || "";
}

function extractLabels(item: CollectionApiMappedItem): string[] {
  if (Array.isArray(item.labels) && item.labels.length > 0) {
    return item.labels.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof item.label === "string" && item.label.trim() !== "") {
    return [item.label.trim()];
  }
  return [];
}

function applyCollectionItemToContent(
  content: NodeCardApiType["content"],
  apiId: string,
  item: CollectionApiMappedItem
): NodeCardApiType["content"] {
  const nextText = extractText(item);
  const nextLabels = extractLabels(item);

  return {
    ...content,
    apiId,
    itemId: String(item.id),
    container: {
      ...(content?.container ?? {}),
      link: item.link || content?.container?.link || "#",
    },
    title: {
      ...(content?.title ?? {}),
      text: item.title || "",
    },
    text: {
      ...(content?.text ?? {}),
      text: nextText,
    },
    image: {
      ...(content?.image ?? {}),
      src: item.image || "",
      alt: item.alt || item.title || "Image",
    },
    labels: {
      ...(content?.labels ?? {}),
      items: nextLabels,
    },
  };
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const cardApiNode = node as NodeCardApiType;
  const content = cardApiNode.content || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLabel = async () => {
      if (!content.apiId) {
        setSourceLabel(null);
        return;
      }
      try {
        const catalog = await fetchCollectionCatalog("article", undefined, { bypassCache: true });
        if (cancelled) return;
        const match = catalog.find((s) => s.id === content.apiId);
        setSourceLabel(match?.label ?? content.apiId);
      } catch {
        if (!cancelled) {
          setSourceLabel(content.apiId);
        }
      }
    };

    void loadLabel();
    return () => {
      cancelled = true;
    };
  }, [content.apiId]);

  useEffect(() => {
    const loadItem = async () => {
      if (!content.apiId || !content.itemId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const resolved = await resolveCollectionEntries([
          { apiId: content.apiId, itemId: String(content.itemId) },
        ]);
        const item = resolved[0];

        if (!item) {
          setError("Item non trouvé");
          return;
        }

        onChange({
          ...node,
          content: applyCollectionItemToContent(cardApiNode.content, content.apiId, item),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'item");
      } finally {
        setLoading(false);
      }
    };

    void loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.apiId, content.itemId]);

  const handleItemSelect = (apiId: string, item: CollectionApiMappedItem) => {
    onChange({
      ...node,
      content: applyCollectionItemToContent(cardApiNode.content, apiId, item),
    });
  };

  const renderApiSection = () => {
    const selectedTitle = content.title?.text?.trim() || "Item sélectionné";

    return (
      <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30 rounded-lg mb-3">
        <label className="node-block-title text-sm text-center font-medium">Sélection API</label>
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="node-block-title text-sm text-destructive">{error}</p>
          </div>
        )}
        {content.apiId && (
          <div className="px-2 bg-muted/50 rounded text-xs">
            <p className="node-block-title text-sm text-muted-foreground">
              Collection:{" "}
              <span className="font-medium text-foreground">{sourceLabel ?? content.apiId}</span>
            </p>
            {content.itemId && (
              <p className="node-block-title text-sm text-muted-foreground mt-1">
                Item: <span className="font-medium text-foreground">{selectedTitle}</span>
              </p>
            )}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalOpen(true)}
          className="w-full"
        >
          <Database className="h-4 w-4 mr-2" />
          {content.apiId && content.itemId ? "Changer l'item" : "Sélectionner un item"}
        </Button>
        <CollectionItemPickerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          collectionType="article"
          mode="dynamic"
          initialSourceId={content.apiId}
          initialItemId={content.itemId}
          onSelect={handleItemSelect}
        />
      </div>
    );
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
              <TabsContent value="general" className="mt-0">
                {renderApiSection()}
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes: { className?: string; id?: string }) =>
                    onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                  }
                />
              </TabsContent>
            </>
          }
          content={
            <>
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
