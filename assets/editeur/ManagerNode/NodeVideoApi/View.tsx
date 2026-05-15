import { type FC, useState } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoApiType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import {  Video as VideoIcon, X } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
//import { Card, CardImage, CardContent } from "@editeur/components/card";
import { styleForView } from "../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../components/VideoPlayOverlayIcon";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/editeur/components/ui/dialog";
import { VisuallyHidden } from "@/editeur/components/ui/visually-hidden";

const ViewTitle: FC<{
  title: string;
  className: string;
  style: React.CSSProperties;
}> = ({ title, className, style }) => {
  return (
    <div
      role="heading"
      aria-level={3}
      dangerouslySetInnerHTML={{ __html: title }}
      className={className}
      style={style}
    />
  );
};

const VideoWrapper = ({ children, className, style, onClick, onKeyDown }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: () => void, onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void }) => {
  return (
    <div
      className={className}
      style={styleForView(style ?? {})}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

const VideoPoster = ({ poster, alt = "", style }: { poster: string, alt?: string, style?: React.CSSProperties }) => {
  return (
    <img
      src={poster}
      alt={alt}
      className="ce-card-image ce-video-poster"
      style={style} 
      loading="lazy"
    />
  );
}

const VideoPlaceholder: FC<{ text?: string }> = ({ text = "Aucune vidéo" }) => {
  return (
    <div className="ce-card-video-placeholder" >
      <div className="ce-icon" />
      <p>{text}</p>
    </div>
  );
};

const ModalPlayer = ({ modalOpen, setModalOpen, src, poster }: { modalOpen: boolean, setModalOpen: (open: boolean) => void, src: string, poster: string }) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Vidéo</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video className="w-full h-full" src={src} poster={poster} controls={true} autoPlay={true} />
          <button
          onClick={() => setModalOpen(false)}
          className="absolute right-4 top-4 z-50
             rounded-full bg-black/70 text-white
             p-2 hover:bg-black
             focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

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
    return <VideoPlaceholder />;

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
  //const contentStyle = content.content?.style || {};
  return (
    <>
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn("ce-card ce-card-position-top ce-card-align-top", className ?? "")}
        style={cardStyle}
        id={id ?? ""}
      >
        <VideoWrapper 
          className={cn("ce-card-wrapper ce-video")} 
          onClick={handleImageClick}
          onKeyDown={(e) => {
            if (!isEditMode && hasVideo && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleImageClick();
            }
          }}
        >
          {hasPoster && (
            <VideoPoster poster={content.poster} alt="Video thumbnail" style={imageStyle} />
          )}
          <VideoPlayOverlayIcon />
        </VideoWrapper>
        
        {shouldShowTitle && (
          <ViewTitle
            title={titleText}
            className={cn("ce-card-title", content.title?.className || "")}
            style={titleStyle}
          />
        )}
      </div>

      <ModalPlayer modalOpen={modalOpen} setModalOpen={setModalOpen} src={content.src} poster={content.poster} />      
    </>
  );
}

export default View;