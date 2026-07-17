import { type FC } from "react";
import { useAppContext } from "../../../services/providers/AppContext";
import { CollectionItemRenderer } from "./CollectionItemRenderer";
import type { CollectionItem } from "../collectionUtils";
import type { CollectionView, NodeCollectionType } from "../index";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectCards,
  EffectCreative,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";

interface CollectionDisplaySlideshowProps {
  items: CollectionItem[];
  view: CollectionView;
  content: NodeCollectionType["content"];
}

export const CollectionDisplaySlideshow: FC<CollectionDisplaySlideshowProps> = ({
  items,
  view,
  content,
}) => {
  const { breakpoint } = useAppContext();
  const slideshow = content?.slideshow ?? {};
  const show = content?.show ?? {};
  const styles = {
    item: content?.item,
    image: content?.image,
    title: content?.title,
    description: content?.description,
    counter: content?.counter,
    like: content?.like,
  };

  const isImageSlideshow = items[0]?.collectionType === "image";
  const navigationEnabled = slideshow.navigationEnabled !== false;
  const paginationEnabled = slideshow.paginationEnabled !== false;
  const slidesCount = items.length;
  const slidesPerViewByBreakpoint = slideshow.slidesPerViewByBreakpoint ?? {
    desktop: 1,
    tablet: 1,
    mobile: 1,
  };
  const aspectRatioRaw =
    typeof slideshow.aspectRatio === "string" && slideshow.aspectRatio.trim().length > 0
      ? slideshow.aspectRatio.trim()
      : "16/9";
  const aspectRatio =
    isImageSlideshow && aspectRatioRaw !== "auto" ? aspectRatioRaw : undefined;
  const effect = slideshow.effect ?? "slide";
  const imageBorderRadius =
    isImageSlideshow &&
    typeof slideshow.imageBorderRadius === "string" &&
    slideshow.imageBorderRadius.trim().length > 0
      ? slideshow.imageBorderRadius.trim()
      : undefined;
  const gap = typeof slideshow.gap === "number" && slideshow.gap >= 0 ? slideshow.gap : 10;

  type BreakpointKey = "mobile" | "tablet" | "desktop";
  const currentBreakpoint: BreakpointKey = (breakpoint as BreakpointKey) || "desktop";
  const slidesPerViewCurrent = Math.max(
    1,
    Math.floor(slidesPerViewByBreakpoint[currentBreakpoint] ?? 1)
  );

  const loopEnabled = slidesCount > slidesPerViewCurrent;
  const autoplayConfiguredEnabled = slideshow.autoplayEnabled !== false;
  const autoplayDelayMs = typeof slideshow.autoplayDelayMs === "number" ? slideshow.autoplayDelayMs : 3000;
  const autoplayEnabled = autoplayConfiguredEnabled && slidesCount > slidesPerViewCurrent;

  const modules = [
    ...(autoplayEnabled ? [Autoplay] : []),
    ...(navigationEnabled ? [Navigation] : []),
    ...(paginationEnabled ? [Pagination] : []),
    ...(effect === "fade" ? [EffectFade] : []),
    ...(effect === "cube" ? [EffectCube] : []),
    ...(effect === "coverflow" ? [EffectCoverflow] : []),
    ...(effect === "flip" ? [EffectFlip] : []),
    ...(effect === "cards" ? [EffectCards] : []),
    ...(effect === "creative" ? [EffectCreative] : []),
  ];

  const swiperKey = `${navigationEnabled}-${paginationEnabled}-${slidesCount}-${slidesPerViewCurrent}-${autoplayEnabled}-${effect}`;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ce-collection-slideshow">
      <Swiper
        key={swiperKey}
        modules={modules}
        navigation={navigationEnabled}
        pagination={paginationEnabled ? { clickable: true } : false}
        autoplay={autoplayEnabled ? { delay: autoplayDelayMs, disableOnInteraction: false } : false}
        effect={effect}
        fadeEffect={effect === "fade" ? { crossFade: true } : undefined}
        slidesPerView={slidesPerViewCurrent}
        loop={loopEnabled}
        className="ce-collection-slideshow-swiper"
        spaceBetween={slidesPerViewCurrent > 1 ? gap : 0}
      >
        {items.map((item, idx) => (
          <SwiperSlide key={`${item.id}-${idx}`} className="ce-collection-slideshow-slide">
            <div
              className="ce-collection-slideshow-image-wrapper"
              style={{
                ...(aspectRatio ? { aspectRatio } : {}),
                ...(imageBorderRadius ? { borderRadius: imageBorderRadius } : {}),
              }}
            >
              <CollectionItemRenderer
                item={item}
                view={view}
                show={show}
                content={content}
                styles={styles}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
