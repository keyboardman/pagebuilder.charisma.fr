import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext } from "../../services/providers/AppContext";
import type { NodeSlideshowType } from ".";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

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

const DEFAULT_SLIDE_SRC = "https://placehold.net/3-800x600.png";

const View: FC = () => {
  const { node } = useNodeContext() as { node: NodeSlideshowType };
  const { breakpoint } = useAppContext();

  const content = node.content ?? ({} as NodeSlideshowType["content"]);
  const slidesFromNode = Array.isArray(content.slides) ? content.slides : [];
  const slides =
    slidesFromNode.length > 0
      ? slidesFromNode
      : [{ src: DEFAULT_SLIDE_SRC, alt: "" }];

  const navigationEnabled = content.navigationEnabled !== false;
  const paginationEnabled = content.paginationEnabled !== false;
  const speedMs = typeof content.speedMs === "number" ? content.speedMs : 300;
  const slidesCount = slides.length;
  const slidesPerViewByBreakpoint = content.slidesPerViewByBreakpoint ?? {
    desktop: 1,
    tablet: 1,
    mobile: 1,
  };
  const aspectRatioRaw =
    typeof content.aspectRatio === "string" && content.aspectRatio.trim().length > 0
      ? content.aspectRatio.trim()
      : "16/9";
  const aspectRatio =
    aspectRatioRaw === "auto" ? undefined : aspectRatioRaw;
  const effect =
    typeof content.effect === "string" && content.effect.trim().length > 0
      ? content.effect
      : "slide";
  const imageBorderRadiusRaw =
    typeof content.imageBorderRadius === "string" ? content.imageBorderRadius.trim() : "";
  const imageBorderRadius = imageBorderRadiusRaw.length > 0 ? imageBorderRadiusRaw : "0px";
  const gap = typeof content.gap === "number" && content.gap >= 0 ? content.gap : 10;
  type BreakpointKey = "mobile" | "tablet" | "desktop";
  const currentBreakpoint: BreakpointKey = (breakpoint as BreakpointKey) || "desktop";
  const slidesPerViewCurrent =
    typeof slidesPerViewByBreakpoint[currentBreakpoint] === "number"
      ? Math.max(1, Math.floor(slidesPerViewByBreakpoint[currentBreakpoint]))
      : 1;

  const loopEnabled = slidesCount > slidesPerViewCurrent;
  const autoplayConfiguredEnabled = content.autoplayEnabled !== false;
  const autoplayDelayMs =
    typeof content.autoplayDelayMs === "number" ? content.autoplayDelayMs : 3000;
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

  const swiperKey = `${navigationEnabled ? 1 : 0}-${paginationEnabled ? 1 : 0}-${speedMs}-${slides.length}-${slidesPerViewCurrent}-${autoplayEnabled ? 1 : 0}-${autoplayDelayMs}-${aspectRatioRaw}-${effect}-${imageBorderRadius}-${gap}`;

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-slideshow", node?.attributes?.className ?? "")}
      style={styleForView(node?.attributes?.style ?? {})}
    >
      <Swiper
        key={swiperKey}
        modules={modules}
        navigation={navigationEnabled ? true : false}
        pagination={paginationEnabled ? { clickable: true } : false}

        autoplay={
          autoplayEnabled
            ? { delay: autoplayDelayMs, disableOnInteraction: false }
            : false
        }
        effect={effect}
        fadeEffect={effect === "fade" ? { crossFade: true } : undefined}
        cubeEffect={
          effect === "cube"
            ? { shadow: false, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }
            : undefined
        }
        coverflowEffect={
          effect === "coverflow"
            ? { rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true }
            : undefined
        }
        flipEffect={effect === "flip" ? { slideShadows: true, limitRotation: true } : undefined}
        cardsEffect={effect === "cards" ? { slideShadows: true, rotate: true } : undefined}
        creativeEffect={
          effect === "creative"
            ? {
              prev: { shadow: true, translate: ["-20%", 0, -1] },
              next: { translate: ["100%", 0, 0] },
            }
            : undefined
        }
        slidesPerView={slidesPerViewCurrent}
        loop={loopEnabled}
        className="ce-slideshow-swiper"
        spaceBetween={slidesPerViewCurrent > 1 ? gap : 0}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={`${slide.src}-${idx}`} className="ce-slideshow-slide">
            <div
              className="ce-slideshow-image-wrapper"
              style={aspectRatio ? { aspectRatio } : undefined}
            >
              {slide.link && slide.link.trim().length > 0 ? (
                <a href={slide.link} className="block h-full w-full">
                  <img
                    className="ce-slideshow-image"
                    src={slide.src}
                    alt={slide.alt ?? ""}
                    style={{ borderRadius: imageBorderRadius }}
                  />
                </a>
              ) : (
                <img
                  className="ce-slideshow-image"
                  src={slide.src}
                  alt={slide.alt ?? ""}
                  style={{ borderRadius: imageBorderRadius }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default View;

