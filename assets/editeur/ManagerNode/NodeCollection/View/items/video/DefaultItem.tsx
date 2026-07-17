import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../../../../components/VideoPlayOverlayIcon";
import { getVideoModalDataAttributes } from "../../../../../components/video/videoModalAttributes";
import { openCharismaVideoModal } from "../../../../../components/video/charismaVideoModal";
import { useAppContext, APP_MODE } from "../../../../../services/providers/AppContext";
import { isShowEnabled } from "../../../collectionUtils";
import { isYoutubeVideoSrc } from "../../collectionViews";
import type { CollectionItem } from "../../../collectionUtils";
import type { CollectionShow, NodeCollectionType } from "../../../index";

type Props = {
  item: Extract<CollectionItem, { collectionType: "video" }>;
  show: CollectionShow;
  content: NodeCollectionType["content"];
};

/** Vue `default` vidéo — alignée sur NodeVideoApi (`.ce-card` + `.ce-video`). */
const VideoDefaultItem: FC<Props> = ({ item, show, content }) => {
  const { mode } = useAppContext();
  const isEditMode = mode === APP_MODE.EDIT;
  const isViewMode = mode === APP_MODE.VIEW;

  const titleText = item.title?.trim() ?? "";
  const showTitle = isShowEnabled(show.title) && titleText !== "";
  const isYoutube = isYoutubeVideoSrc(item.src);
  const hasVideo = !!item.src;
  const favoriCount = item.favoriCount;

  const cardStyle = content?.card?.style ?? {};
  const imageStyle = content?.image?.style ?? {};
  const titleStyle = content?.title?.style ?? {};

  const videoModalAttrs = getVideoModalDataAttributes({
    isViewMode,
    src: item.src,
    poster: item.poster,
    mediaId: item.itemId,
    favoriCount,
  });

  const openVideo = () => {
    if (!hasVideo) return;
    openCharismaVideoModal({
      src: item.src,
      poster: item.poster,
      mediaId: item.itemId,
      favoriCount,
      apiId: item.apiId,
    });
  };

  const mediaWrapperClass = cn(
    isYoutube ? "ce-card-wrapper ce-youtube" : "ce-card-wrapper ce-video",
    !isEditMode && hasVideo ? "cursor-pointer" : null
  );
  const posterClass = isYoutube ? "ce-youtube-poster" : "ce-card-image ce-video-poster";
  const titleClass = cn("ce-card-title", content?.title?.className);

  return (
    <div
      className={cn(
        "ce-card ce-card-position-top ce-card-align-top",
        content?.item?.className
      )}
      style={styleForView(cardStyle)}
    >
      <div
        className={mediaWrapperClass}
        onClick={(e) => {
          if (isEditMode || !hasVideo) return;
          e.preventDefault();
          e.stopPropagation();
          openVideo();
        }}
        onKeyDown={(e) => {
          if (!isEditMode && hasVideo && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openVideo();
          }
        }}
        {...videoModalAttrs}
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt={titleText || "Video"}
            className={cn(posterClass, content?.image?.className)}
            style={styleForView(imageStyle)}
            loading="lazy"
          />
        ) : null}
        {!isYoutube ? <VideoPlayOverlayIcon /> : null}
      </div>

      {showTitle ? (
        <div
          role="heading"
          aria-level={3}
          className={titleClass}
          style={styleForView(titleStyle)}
          dangerouslySetInnerHTML={{ __html: titleText }}
        />
      ) : null}
    </div>
  );
};

export default VideoDefaultItem;
