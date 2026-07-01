import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../components/VideoPlayOverlayIcon";
import { getVideoModalDataAttributes } from "../../components/video/videoModalAttributes";
import { openCharismaVideoModal } from "../../components/video/charismaVideoModal";

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

const VideoWrapper = ({ children, node, className, style, id, onClick, onKeyDown, videoModalAttrs }: { children: React.ReactNode, node: NodeVideoType, className?: string, style?: React.CSSProperties, id?: string, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void, onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void, videoModalAttrs?: Record<string, string> }) => {
  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={className}
      style={styleForView(style ?? {})}
      id={id ?? ""}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...videoModalAttrs}
    >
      {children}
    </div>
  );
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeVideoType };
  const { mode } = useAppContext();
  const { id, className, style } = node.attributes ?? {};
  const content = node.content ?? { src: "", poster: "", autoplay: false, controls: false };
  const hasVideo = !!content.src;
  const hasPoster = !!content.poster;
  const isEditMode = mode === APP_MODE.EDIT;
  const isViewMode = mode === APP_MODE.VIEW;
  const videoModalAttrs = getVideoModalDataAttributes({
    isViewMode,
    src: content.src,
    poster: content.poster,
  });

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditMode || !hasVideo) return;
    e.preventDefault();
    e.stopPropagation();
    openCharismaVideoModal({
      src: content.src,
      poster: content.poster,
    });
  };

  if (!hasVideo) {
    return <VideoPlaceholder />;
  }

  return (
    <VideoWrapper
      node={node}
      className={cn("ce-video", !isEditMode && "cursor-pointer", className)}
      style={styleForView(style ?? {})}
      id={id}
      onClick={handleVideoClick}
      onKeyDown={(e) => {
        if (!isEditMode && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          openCharismaVideoModal({
            src: content.src,
            poster: content.poster,
          });
        }
      }}
      videoModalAttrs={videoModalAttrs}
    >
      {hasPoster && <VideoPoster poster={content.poster} alt="" />}
      <VideoPlayOverlayIcon />
    </VideoWrapper>
  );
};

export default View;
