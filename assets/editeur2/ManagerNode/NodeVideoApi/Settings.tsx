import { type FC, useEffect, useState } from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeVideoApiType } from "./index";
import { ApiManagerModal } from "../../ManagerApi/ApiManagerModal";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@editeur/components/ui/button";
import { Database } from "lucide-react";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Spacing2Settings, Border2Settings, Object2Settings, Text2Settings } from "../Settings";
import { Tabs, TabsList, TabsTrigger } from "@editeur/components/ui/tabs";
import { TabsContent } from "@editeur/components/ui/tabs";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const videoApiNode = node as NodeVideoApiType;
  const content = videoApiNode.content || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Charger automatiquement l'item si apiId et itemId sont définis
  useEffect(() => {
    const loadItem = async () => {
      if (!content.apiId || !content.itemId) {
        return;
      }

      const adapter = apiRegistry.get(content.apiId);
      if (!adapter) {
        setError("API non trouvée");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const item = await adapter.fetchItem(content.itemId);
        const mappedData = adapter.mapItem(item);

        // Mapper les données de l'API vers les champs de la vidéo
        // src depuis src (pour les APIs vidéo), link, ou image si aucun n'est disponible
        const videoSrc = (mappedData as any).src || mappedData.link || mappedData.image || "";
        // poster depuis image
        const videoPoster = mappedData.image || "";
        // titre depuis title
        const videoTitle = mappedData.title || "";

        // Mettre à jour le contenu avec les données mappées
        onChange({
          ...node,
          content: {
            ...videoApiNode.content,
            apiId: content.apiId,
            itemId: content.itemId,
            src: videoSrc,
            poster: videoPoster,
            // Préserver les styles existants du titre lors du mapping
            title: {
              ...(videoApiNode.content?.title || { className: "", style: {} }),
              text: videoTitle,
            },
            // Autoplay et controls toujours à true
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

    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.apiId, content.itemId]);

  const handleItemSelect = (apiId: string, itemId: string, mappedData: {
    id: string;
    title: string;
    description?: string;
    image?: string;
    link?: string;
    raw: unknown;
  }) => {
    // Mapper les données de l'API vers les champs de la vidéo
    // src depuis src (pour les APIs vidéo), link, ou image si aucun n'est disponible
    const videoSrc = (mappedData as any).src || mappedData.link || mappedData.image || "";
    const videoPoster = mappedData.image || "";
    // titre depuis title
    const videoTitle = mappedData.title || "";

    onChange({
      ...node,
      content: {
        ...videoApiNode.content,
        apiId,
        itemId,
        src: videoSrc,
        poster: videoPoster,
        // Préserver les styles existants du titre lors du mapping
        title: {
          ...(videoApiNode.content?.title || { className: "", style: {} }),
          text: videoTitle,
        },
        // Autoplay et controls toujours à true
        autoplay: true,
        controls: true,
      },
    });
  };

  const renderApiSection = () => {
    const selectedAdapter = content.apiId ? apiRegistry.get(content.apiId) : null;
    const selectedItemTitle = content.src ? "Vidéo sélectionnée" : "Aucune vidéo sélectionnée";

    return (
      <div className="flex flex-1 flex-col gap-2 p-1 m-1 border border-border/30 rounded-lg mb-3">
        <h3 className="node-block-title text-center text-sm font-medium">Sélection API</h3>
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
        {content.apiId && selectedAdapter && (
          <div className="p-2 bg-muted/50 rounded text-xs">
            <p className="node-block-title text-muted-foreground text-sm">API: <span className="font-medium">{selectedAdapter.label}</span></p>
            <p className="node-block-title text-muted-foreground mt-1 text-sm">Item: <span className="font-medium">{selectedItemTitle}</span></p>
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
        <ApiManagerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          apiId={content.apiId}
          itemId={content.itemId}
          typeFilter="video"
          onSelect={handleItemSelect}
        />
      </div>
    );
  };

  const cardStyle = content.card?.style || {};
  const titleStyle = content.title?.style || {};
  const imageStyle = content.image?.style || {};

  return (
    <>
      <Tabs defaultValue="card">
        <NodeSettingsWrapper header={<>

          {renderApiSection()}
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) => onChange({
              ...node,
              attributes: {
                ...node.attributes,
                ...attributes
              }
            })}

          />
          <TabsList className="justify-center w-full">
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="title">Title</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

        </>} content={<>
          <TabsContent value="card">
            <Background2Settings
              style={cardStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, card: { ...node.content?.card, style } }
              })}
            />
            <Border2Settings
              style={cardStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, card: { ...node.content?.card, style } }
              })}
            />
            <Spacing2Settings
              style={cardStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, card: { ...node.content?.card, style } }
              })}
            />

          </TabsContent>
          <TabsContent value="title">
            <Text2Settings
              style={titleStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, title: { ...node.content?.title, style } }
              })}
            />
            <Background2Settings
              style={titleStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, title: { ...node.content?.title, style } }
              })}
            />
            <Border2Settings
              style={titleStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, title: { ...node.content?.title, style } }
              })}
            />
            <Spacing2Settings
              style={titleStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, title: { ...node.content?.title, style } }
              })}
            />
          </TabsContent>
          <TabsContent value="image">
            <Object2Settings
              style={imageStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, image: { ...node.content?.image, style } }
              })}
            />
            <Border2Settings
              style={imageStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, image: { ...node.content?.image, style } }
              })}
            />
            <Spacing2Settings
              style={imageStyle}
              onChange={(style) => onChange({
                ...node,
                content: { ...node.content, image: { ...node.content?.image, style } }
              })}
            />
          </TabsContent>
        </>} />
      </Tabs>
    </>
  );
};

export default Settings;
