export function getVideoModalDataAttributes(options: {
  isViewMode: boolean;
  src?: string;
  poster?: string;
  mediaId?: string;
  favoriCount?: number;
}): Record<string, string> {
  if (!options.isViewMode || !options.src) {
    return {};
  }

  const attrs: Record<string, string> = {
    "data-video-src": options.src,
    "data-video-poster": options.poster ?? "",
  };

  if (options.mediaId) {
    attrs["data-media-id"] = options.mediaId;
  }

  if (options.favoriCount !== undefined && Number.isFinite(options.favoriCount)) {
    attrs["data-favori-count"] = String(Math.max(0, Math.floor(options.favoriCount)));
  }

  return attrs;
}
