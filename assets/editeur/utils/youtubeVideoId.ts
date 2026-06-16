const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_URL_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
] as const;

function extractFromUrl(trimmed: string): string | null {
  try {
    const urlString = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(urlString);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0]?.split("?")[0];
      if (id && YOUTUBE_ID_PATTERN.test(id)) {
        return id;
      }
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host.endsWith(".youtube.com")) {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        if (id && YOUTUBE_ID_PATTERN.test(id)) {
          return id;
        }
      }

      const pathMatch = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
      const id = pathMatch?.[2];
      if (id && YOUTUBE_ID_PATTERN.test(id)) {
        return id;
      }
    }
  } catch {
    // Not a valid URL yet (saisie en cours).
  }

  return null;
}

export function extractYoutubeVideoId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const fromUrl = extractFromUrl(trimmed);
  if (fromUrl) {
    return fromUrl;
  }

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return trimmed;
}
