import { apiRegistry } from "../../ManagerApi/ApiRegistry";
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

export function mapCollectionToSlides(
  items: unknown[],
  adapter: NonNullable<ReturnType<typeof apiRegistry.get>>,
  apiId: string
): NodeSlideshowSlide[] {
  return items
    .map((item) => adapter.mapItem(item))
    .filter((mapped) => (mapped.image ?? "").trim().length > 0)
    .map((mapped) => ({
      src: String(mapped.image ?? ""),
      alt: mapped.title ?? "",
      source: "api-fixed" as const,
      link: mapped.link ?? "",
      apiId,
      itemId: mapped.id,
    }));
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

export async function fetchSlidesFromApi(apiId: string): Promise<NodeSlideshowSlide[]> {
  const adapter = apiRegistry.get(apiId);
  if (!adapter) {
    return [placeholderApiSlide(apiId)];
  }

  const result = await adapter.fetchCollection({
    page: 1,
    limit: 200,
  });

  const mapped = mapCollectionToSlides(result.items ?? [], adapter, apiId);
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

/** @deprecated Utiliser normalizeSlideshowContent */
export function sanitizeSlideshowContentForPersistence(
  content: Record<string, unknown>
): Record<string, unknown> {
  return normalizeSlideshowContent(content);
}
