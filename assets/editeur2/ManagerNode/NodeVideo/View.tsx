import { type FC, useState } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { Play, Video as VideoIcon, X } from "lucide-react";
import { cn } from "@editeur/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@editeur/components/ui/dialog";
import { VisuallyHidden } from "@editeur/components/ui/visually-hidden";
import { styleForView } from "../../utils/styleHelper";

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

  // Aucune source : placeholder
  if (!hasVideo) {
    return (
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn(className ?? "", "p-8 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center bg-muted/50 text-muted-foreground")}
        style={styleForView(style ?? {})}
        id={id ?? ""}
      >
        <VideoIcon className="h-12 w-12 mb-2" />
        <p className="text-sm">Aucune vidéo</p>
      </div>
    );
  }

  return (
    <>
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn(className ?? "", "relative overflow-hidden rounded-lg")}
        style={styleForView(style ?? {})}
        id={id ?? ""}
      >
        {hasPoster ? (
          <div
            className={cn("relative group", !isEditMode && "cursor-pointer")}
            onClick={handleVideoClick}
            role={!isEditMode ? "button" : undefined}
            tabIndex={!isEditMode ? 0 : undefined}
            data-video-src={hasVideo ? content.src : undefined}
            data-video-poster={hasPoster ? content.poster : undefined}
            onKeyDown={(e) => {
              if (!isEditMode && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleVideoClick();
              }
            }}
          >
            <img
              src={content.poster}
              alt=""
              className="w-full h-auto transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors pointer-events-none">
              <div className="flex items-center justify-center rounded-full p-4 bg-white/90 group-hover:bg-white transition-colors w-14 h-14">
                <Play className="h-8 w-8 text-foreground shrink-0" fill="currentColor" strokeWidth={0} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative group p-16 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center bg-muted/50 min-h-[120px]",
              !isEditMode && "cursor-pointer"
            )}
            onClick={!isEditMode ? handleVideoClick : undefined}
            role={!isEditMode ? "button" : undefined}
            tabIndex={!isEditMode ? 0 : undefined}
            data-video-src={hasVideo ? content.src : undefined}
            data-video-poster={hasPoster ? content.poster : undefined}
            onKeyDown={(e) => {
              if (!isEditMode && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleVideoClick();
              }
            }}
          >
            <div className="relative z-0 flex flex-col items-center justify-center">
              <VideoIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Vidéo</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="flex items-center justify-center rounded-full w-14 h-14 p-4 bg-white/90 group-hover:bg-white transition-colors">
                <Play className="h-8 w-8 text-foreground shrink-0" fill="currentColor" strokeWidth={0} />
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Vidéo</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full"
              src={content.src}
              poster={content.poster}
              controls={true}
              autoPlay={true}
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
    </>
  );
};

export default View;
