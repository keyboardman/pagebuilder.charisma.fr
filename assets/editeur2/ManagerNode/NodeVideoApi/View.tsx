import { type FC, useState } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoApiType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { Play, Video as VideoIcon, X } from "lucide-react";
import { cn } from "@editeur/lib/utils";
import { Card, CardImage, CardContent } from "@editeur/components/card";
import {
  Dialog,
  DialogContent,
} from "@editeur/components/ui/dialog";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeVideoApiType };
  const { mode } = useAppContext();
  const { id, className, style } = node.attributes ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const content = node.content || {};
  const hasVideo = content.src && (content.apiId || content.itemId);
  const hasPoster = !!content.poster;
  const showTitle = content.showTitle !== false; // true par défaut pour rétrocompatibilité
  const titleText = content.title?.text || "";
  const shouldShowTitle = showTitle && titleText.trim() !== "";
  const isEditMode = mode === APP_MODE.EDIT;

  // Afficher un message si aucun item n'est sélectionné
  if (!content.apiId || !content.itemId) {
    return (
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn(className ?? "", "p-8 border-2 border-dashed border-border/50 rounded-lg text-center text-muted-foreground")}
        style={styleForView(style ?? {})}
        id={id ?? ""}
      >
        <p className="text-sm">Aucune vidéo sélectionnée</p>
      </div>
    );
  }

  const handleImageClick = () => {
    // En mode édition, ne pas ouvrir la modale pour permettre la sélection du node
    if (isEditMode) {
      return;
    }
    if (hasVideo) {
      setModalOpen(true);
    }
  };

  const cardStyle = content.card?.style || {};
  const imageStyle = content.image?.style || {};
  const titleStyle = content.title?.style || {};

  return (
    <>
      <Card
        variant="overlay"
        align="end"
        className={className ?? ""}
        style={styleForView(cardStyle)}
        id={id ?? ""}
        data-ce-id={node.id}
        data-ce-type={node.type}
      >
        {hasPoster ? (
          <div
            className={cn("relative group w-full", !isEditMode && hasVideo && "cursor-pointer")}
            onClick={handleImageClick}
            role={!isEditMode && hasVideo ? "button" : undefined}
            tabIndex={!isEditMode && hasVideo ? 0 : undefined}
            onKeyDown={(e) => {
              if (!isEditMode && hasVideo && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleImageClick();
              }
            }}
          >
            <CardImage src={content.poster} alt="Video thumbnail" style={styleForView(imageStyle)} />
            {hasVideo && !isEditMode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors">
                <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                  <Play className="h-8 w-8 text-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative group w-full p-16 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center bg-muted/50 min-h-[200px]",
              !isEditMode && hasVideo && "cursor-pointer",
              !hasVideo && "cursor-not-allowed opacity-50"
            )}
            onClick={!isEditMode && hasVideo ? handleImageClick : undefined}
            role={!isEditMode && hasVideo ? "button" : undefined}
            tabIndex={!isEditMode && hasVideo ? 0 : undefined}
            onKeyDown={(e) => {
              if (!isEditMode && hasVideo && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleImageClick();
              }
            }}
          >
            <VideoIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Vidéo</p>
            {hasVideo && !isEditMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                  <Play className="h-8 w-8 text-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        )}
        {shouldShowTitle && (
          <CardContent>
            <CardContent.Title
              text={titleText}
              style={styleForView(titleStyle)}
              className={cn(content.title?.className || "", "p-2")}
            />
          </CardContent>
        )}
      </Card>

      {hasVideo && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                src={content.src}
                poster={content.poster}
                controls={content.controls ?? true}
                autoPlay={content.autoplay ?? true}
              />
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-background/80 text-foreground p-2 z-10"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default View;
