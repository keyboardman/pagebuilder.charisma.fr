import { type FC, useEffect, useState } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeVideoApiType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../components/VideoPlayOverlayIcon";
import { getVideoModalDataAttributes } from "../../components/video/videoModalAttributes";
import { openCharismaVideoModal } from "../../components/video/charismaVideoModal";
import { parseFavoriCount } from "../../components/video/favoriCount";
import {
  resolveCollectionEntries,
  type CollectionApiMappedItem,
} from "../NodeCollection/collectionApiUtils";

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

const VideoWrapper = ({ children, className, style, onClick, onKeyDown, videoModalAttrs }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void, onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void, videoModalAttrs?: Record<string, string> }) => {
  return (
    <div
      className={className}
      style={styleForView(style ?? {})}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...videoModalAttrs}
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

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeVideoApiType };
  const { mode } = useAppContext();
  const { id, className, style } = node.attributes ?? {};
  const content = node.content || {};
  const [favoriCount, setFavoriCount] = useState<number | undefined>(content.favoriCount);
  const hasVideo = content.src && (content.apiId || content.itemId);
  const hasPoster = !!content.poster;
  const showTitle = content.showTitle !== false;
  const titleText = content.title?.text || "";
  const shouldShowTitle = showTitle && titleText.trim() !== "";
  const isEditMode = mode === APP_MODE.EDIT;
  const isViewMode = mode === APP_MODE.VIEW;

  useEffect(() => {
    setFavoriCount(content.favoriCount);
  }, [content.favoriCount]);

  useEffect(() => {
    if (!content.apiId || !content.itemId) return;

    let cancelled = false;
    void resolveCollectionEntries([{ apiId: content.apiId, itemId: String(content.itemId) }])
      .then((items) => {
        if (cancelled) return;
        const item = items[0];
        if (item) {
          setFavoriCount(favoriFromCollectionItem(item));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [content.apiId, content.itemId]);

  const videoModalAttrs = getVideoModalDataAttributes({
    isViewMode,
    src: content.src,
    poster: content.poster,
    mediaId: content.itemId,
    favoriCount,
  });

  if (!content.apiId || !content.itemId) {
    return <VideoPlaceholder />;
  }

  const openVideo = () => {
    if (!hasVideo) return;
    openCharismaVideoModal({
      src: content.src,
      poster: content.poster,
      mediaId: content.itemId,
      favoriCount,
      apiId: content.apiId,
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    openVideo();
  };

  const cardStyle = content.card?.style || {};
  const imageStyle = content.image?.style || {};
  const titleStyle = content.title?.style || {};

  return (
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
            openVideo();
          }
        }}
        videoModalAttrs={videoModalAttrs}
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
  );
}

export default View;
