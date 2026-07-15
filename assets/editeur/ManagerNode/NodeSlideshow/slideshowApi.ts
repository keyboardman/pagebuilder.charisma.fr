import {
  fetchListImageItems,
  MAX_LIST_IMAGE_ITEMS_PER_PAGE,
  type ListImageMappedItem,
} from "../NodeListImage/listImageApiUtils";
import type { NodeSlideshowSlide } from ".";

export const DEFAULT_SLIDE_SRC = "https://placehold.net/3-800x600.png";

export type SlideshowContentLike = {
  slidesMode?: string;
  apiId?: string;
  slides?: NodeSlideshowSlide[];
};

export function resolveApiId(content: SlideshowContentLike): string {
  if (typeof content.apiId === "string" && content.apiId.trim().length > 0) {
    return content.apiId.trim();
  }

  const slides = Array.isArray(content.slides) ? content.slides : [];
  const slideApiId = slides.find((slide) => slide.apiId?.trim())?.apiId?.trim();
  return slideApiId ?? "";
}

export function resolveSlidesMode(content: SlideshowContentLike): "manual" | "api-endpoint" {
  if (content.slidesMode === "api-endpoint") {
    return "api-endpoint";
  }
  if (content.slidesMode === "manual") {
    return "manual";
  }

  if (resolveApiId(content)) {
    return "api-endpoint";
  }

  const slides = Array.isArray(content.slides) ? content.slides : [];
  if (slides.length > 0 && slides.every((slide) => slide.source === "api-fixed")) {
    return "api-endpoint";
  }

  return "manual";
}

export function placeholderApiSlide(apiId?: string): NodeSlideshowSlide {
  return {
    src: DEFAULT_SLIDE_SRC,
    alt: "",
    source: "api-fixed",
    link: "",
    apiId,
  };
}

export function mapListImageItemsToSlides(items: ListImageMappedItem[], apiId: string): NodeSlideshowSlide[] {
  return items
    .filter((item) => (item.image ?? "").trim().length > 0)
    .map((item) => ({
      src: String(item.image),
      alt: item.alt ?? "",
      source: "api-fixed" as const,
      link: item.link ?? "",
      apiId,
      itemId: item.id,
    }));
}

export async function fetchSlidesFromApi(apiId: string): Promise<NodeSlideshowSlide[]> {
  const result = await fetchListImageItems(apiId, {
    page: 1,
    itemsPerPage: MAX_LIST_IMAGE_ITEMS_PER_PAGE,
  });
  const mapped = mapListImageItemsToSlides(result.items ?? [], apiId);
  return mapped.length > 0 ? mapped : [placeholderApiSlide(apiId)];
}

export function normalizeSlideshowContent(
  content: Record<string, unknown>
): Record<string, unknown> {
  const typed = content as SlideshowContentLike;
  const mode = resolveSlidesMode(typed);

  if (mode === "api-endpoint") {
    const apiId = resolveApiId(typed);
    return {
      ...content,
      slidesMode: "api-endpoint",
      apiId: apiId || content.apiId,
      slides: [],
    };
  }

  return {
    ...content,
    slidesMode: "manual",
  };
}
