import { type FC, useEffect, useState } from "react";
import { BaseSettings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardApiType } from "./index";
import { CardSettings } from "./Settings/CardSettings";
import { ImageSettings } from "./Settings/ImageSettings";
import { TitleSettings } from "./Settings/TitleSettings";
import { TextSettings } from "./Settings/TextSettings";
import { LabelsSettings } from "./Settings/LabelsSettings";
import { ContainerSettings } from "./Settings/ContainerSettings";
import { ApiManagerModal } from "../../ManagerApi/ApiManagerModal";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@editeur/components/ui/button";
import { Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@editeur/components/ui/tabs";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";

function extractText(mappedData: { text?: string; description?: string; }): string {
  return mappedData?.text?.trim() as string || "";
}

function extractLabels(mappedData: { labels?: string[] | string; raw: unknown }): string[] {
  const candidate = mappedData?.labels ?? [];

  if (Array.isArray(candidate)) {
    return candidate.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof candidate === "string") {
    return candidate
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const cardApiNode = node as NodeCardApiType;
  const content = cardApiNode.content || {};
  const selectedElement = content.selectedElement || null;
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

        const nextText = extractText(mappedData);
        const nextLabels = extractLabels(mappedData);

        // Mettre à jour le contenu avec les données mappées
        onChange({
          ...node,
          content: {
            ...cardApiNode.content,
            // Conserver les autres champs existants
            apiId: content.apiId,
            itemId: content.itemId,
            container: {
              ...(cardApiNode.content?.container ?? {}),
              // Utiliser le lien de l'API si disponible, sinon conserver le lien existant
              link: mappedData.link || cardApiNode.content?.container?.link || "#",
            },
            title: {
              ...(cardApiNode.content?.title ?? {}),
              text: mappedData.title,
            },
            text: {
              ...(cardApiNode.content?.text ?? {}),
              text: nextText,
            },
            image: {
              ...(cardApiNode.content?.image ?? {}),
              src: mappedData.image || "",
              alt: mappedData.title || "Image",
            },
            labels: {
              ...(cardApiNode.content?.labels ?? {}),
              items: nextLabels.length > 0 ? nextLabels : (content.labels?.items || []),
            },
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
    const nextText = extractText(mappedData);
    const nextLabels = extractLabels(mappedData);
    onChange({
      ...node,
      content: {
        ...cardApiNode.content,
        apiId,
        itemId,
        container: {
          ...(cardApiNode.content?.container ?? {}),
          // Utiliser le lien de l'API si disponible, sinon conserver le lien existant
          link: mappedData.link || cardApiNode.content?.container?.link || "#",
        },
        title: {
          ...(cardApiNode.content?.title ?? {}),
          text: mappedData.title,
        },
        text: {
          ...(cardApiNode.content?.text ?? {}),
          text: nextText,
        },
        image: {
          ...(cardApiNode.content?.image ?? {}),
          src: mappedData.image || "",
          alt: mappedData.title || "Image",
        },
        labels: {
          ...(cardApiNode.content?.labels ?? {}),
          items: nextLabels,
        },
      },
    });
  };

  const renderApiSection = () => {
    const selectedAdapter = content.apiId ? apiRegistry.get(content.apiId) : null;

    return (
      <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30 rounded-lg">
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
        {content.apiId && selectedAdapter && (
          <div className="px-2 bg-muted/50 rounded text-xs">
            <p className="node-block-title text-sm text-muted-foreground">API: <span className="font-medium">{selectedAdapter.label}</span></p>
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
        <ApiManagerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          apiId={content.apiId}
          itemId={content.itemId}
          typeFilter="article"
          onSelect={handleItemSelect}
        />
      </div>
    );
  };

  return (
    <Tabs defaultValue={selectedElement || "card"} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
        header={
          <>
            {renderApiSection()}
            <BaseSettings />
            <TabsList className="justify-center w-full">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="container">Container</TabsTrigger>
            </TabsList>
            <TabsList className="justify-center w-full">
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="title">Titre</TabsTrigger>
              <TabsTrigger value="text">Texte</TabsTrigger>
              <TabsTrigger value="labels">Label</TabsTrigger>
            </TabsList>

          </>
        }
        content={<>
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
        </>}
      />
      </div>
    </Tabs>

  )

};

export default Settings;
