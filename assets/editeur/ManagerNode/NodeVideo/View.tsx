import { type FC, useState } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { X } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/editeur/components/ui/dialog";
import { VisuallyHidden } from "@/editeur/components/ui/visually-hidden";
import { styleForView } from "../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../components/VideoPlayOverlayIcon";

const VideoPlaceholder: FC<{ text?: string }> = ({ text = "Aucune vidéo" }) => {
  return (
    <div className="ce-video-placeholder" >
      <div className="ce-icon" />
      <p className="text-sm">{text}</p>
    </div>
  );
};

const VideoPoster = ({ poster, alt = "" }: { poster: string, alt?: string }) => {
  return (
    <img
      src={poster}
      alt={alt}
      className="ce-video-poster" 
      loading="lazy"
    />
  );
}

const VideoWrapper = ({ children, node, className, style, id, onClick, onKeyDown }: { children: React.ReactNode, node: NodeVideoType, className?: string, style?: React.CSSProperties, id?: string, onClick?: () => void, onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void }) => {
  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={className}
      style={styleForView(style ?? {})}
      id={id ?? ""}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

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
  const { node } = useNodeContext() as { node: NodeVideoType };
  const { mode } = useAppContext();
  const { id, className, style } = node.attributes ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const content = node.content ?? { src: "", poster: "", autoplay: false, controls: false };
  const hasVideo = !!content.src;
  const hasPoster = !!content.poster;
  const isEditMode = mode === APP_MODE.EDIT;

  const handleVideoClick = () => {
    if (isEditMode) return;
    if (hasVideo) setModalOpen(true);
  };

  if (!hasVideo) {
    return <VideoPlaceholder />;
  }

  return (
    <>
      <VideoWrapper
        node={node}
        className={cn("ce-video", !isEditMode && "cursor-pointer", className)}
        style={styleForView(style ?? {})}
        id={id}
        onClick={handleVideoClick}
        onKeyDown={(e) => {
          if (!isEditMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleVideoClick();
          }
        }}
      >
        {hasPoster && <VideoPoster poster={content.poster} alt="" />}
       <VideoPlayOverlayIcon />
      </VideoWrapper>
      <ModalPlayer modalOpen={modalOpen} setModalOpen={setModalOpen} src={content.src} poster={content.poster} />
    </>
  );

};

export default View;
