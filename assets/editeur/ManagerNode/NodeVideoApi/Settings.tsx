import { type CSSProperties, type FC, useEffect, useState } from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeVideoApiType } from "./index";
import { Loader2, AlertCircle, Database } from "lucide-react";
import { Button } from "@/editeur/components/ui/button";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Spacing2Settings,
  Border2Settings,
  Object2Settings,
  Text2Settings,
} from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { Switch } from "@/editeur/components/ui/switch";
import { parseFavoriCount } from "../../components/video/favoriCount";
import {
  fetchCollectionCatalog,
  resolveCollectionEntries,
  type CollectionApiMappedItem,
} from "../NodeCollection/collectionApiUtils";
import { CollectionItemPickerModal } from "../NodeCollection/Settings/CollectionItemPickerModal";

function favoriFromCollectionItem(item: CollectionApiMappedItem): number {
  if (typeof item.like === "number" && Number.isFinite(item.like)) {
    return Math.max(0, Math.floor(item.like));
  }
  if (typeof item.like === "string" && item.like.trim() !== "") {
    const parsed = Number(item.like);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }
  return parseFavoriCount(item);
}

function mapCollectionItemToVideoFields(item: CollectionApiMappedItem) {
  return {
    src: item.link || item.image || "",
    poster: item.image || "",
    title: item.title || "",
    favoriCount: favoriFromCollectionItem(item),
  };
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const videoApiNode = node as NodeVideoApiType;
  const content = videoApiNode.content || {};
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
        const catalog = await fetchCollectionCatalog("video", undefined, { bypassCache: true });
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
          setError("Vidéo non trouvée");
          return;
        }

        const mapped = mapCollectionItemToVideoFields(item);

        onChange({
          ...node,
          content: {
            ...videoApiNode.content,
            apiId: content.apiId,
            itemId: String(content.itemId),
            src: mapped.src,
            poster: mapped.poster,
            favoriCount: mapped.favoriCount,
            title: {
              ...(videoApiNode.content?.title || { className: "", style: {} }),
              text: mapped.title,
            },
            autoplay: true,
            controls: true,
          },
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
    const mapped = mapCollectionItemToVideoFields(item);

    onChange({
      ...node,
      content: {
        ...videoApiNode.content,
        apiId,
        itemId: String(item.id),
        src: mapped.src,
        poster: mapped.poster,
        favoriCount: mapped.favoriCount,
        title: {
          ...(videoApiNode.content?.title || { className: "", style: {} }),
          text: mapped.title,
        },
        autoplay: true,
        controls: true,
      },
    });
  };

  const renderApiSection = () => {
    const selectedItemTitle = content.src ? "Vidéo sélectionnée" : "Aucune vidéo sélectionnée";

    return (
      <div className="flex flex-1 flex-col gap-2 p-1 m-1 border border-border/30 rounded-lg mb-3">
        <h3 className="node-block-title text-center text-sm font-medium text-foreground">Sélection API</h3>
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
          <div className="p-2 bg-muted/50 rounded text-xs">
            <p className="node-block-title text-foreground text-sm">
              Collection: <span className="font-medium">{sourceLabel ?? content.apiId}</span>
            </p>
            <p className="node-block-title text-foreground mt-1 text-sm">
              Item: <span className="font-medium">{selectedItemTitle}</span>
            </p>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalOpen(true)}
          className="w-full"
        >
          <Database className="h-4 w-4 mr-2" />
          {content.apiId && content.itemId ? "Changer la vidéo" : "Sélectionner une vidéo"}
        </Button>
        <CollectionItemPickerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          collectionType="video"
          mode="dynamic"
          initialSourceId={content.apiId}
          initialItemId={content.itemId}
          onSelect={handleItemSelect}
        />
      </div>
    );
  };

  const cardStyle = content.card?.style || {};
  const titleStyle = content.title?.style || {};
  const imageStyle = content.image?.style || {};

  const updateCardStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...node.content, card: { ...node.content?.card, style } },
    });

  const updateTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...node.content, title: { ...node.content?.title, style } },
    });

  const updateImageStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: { ...node.content, image: { ...node.content?.image, style } },
    });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="title">Titre</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
                {renderApiSection()}
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes: { className?: string; id?: string }) =>
                    onChange({
                      ...node,
                      attributes: {
                        ...node.attributes,
                        ...attributes,
                      },
                    })
                  }
                />
              </TabsContent>
            </>
          }
          content={
            <>
              <TabsContent value="card" className="mt-0">
                <Background2Settings style={cardStyle} onChange={updateCardStyle} />
                <Border2Settings style={cardStyle} onChange={updateCardStyle} />
                <Spacing2Settings style={cardStyle} onChange={updateCardStyle} />
              </TabsContent>
              <TabsContent value="title" className="mt-0">
                <div>
                  Visible&nbsp;
                  <Switch
                    checked={content?.showTitle !== false}
                    onCheckedChange={(checked) => {
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          showTitle: checked,
                        },
                      });
                    }}
                  />
                </div>
                <Text2Settings style={titleStyle} onChange={updateTitleStyle} />
                <Background2Settings style={titleStyle} onChange={updateTitleStyle} />
                <Border2Settings style={titleStyle} onChange={updateTitleStyle} />
                <Spacing2Settings style={titleStyle} onChange={updateTitleStyle} />
              </TabsContent>
              <TabsContent value="image" className="mt-0">
                <Object2Settings style={imageStyle} onChange={updateImageStyle} />
                <Border2Settings style={imageStyle} onChange={updateImageStyle} />
                <Spacing2Settings style={imageStyle} onChange={updateImageStyle} />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
