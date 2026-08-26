const DEFAULT_API_BASE = "/api/page-builder";

/**
 * Base API page-builder : attribut DOM `data-api-cards-base-url` (URL absolue
 * injectée par Twig sur le rendu public) ou chemin relatif same-origin.
 */
export function resolvePageBuilderApiBaseUrl(): string {
  if (typeof document !== "undefined") {
    const fromDom = document
      .querySelector<HTMLElement>("[data-api-cards-base-url]")
      ?.dataset.apiCardsBaseUrl?.trim();
    if (fromDom) {
      return fromDom.replace(/\/$/, "");
    }
  }
  return DEFAULT_API_BASE;
}

/** Joint un sous-chemin (ex. `collections/resolve`) à la base API page-builder. */
export function pageBuilderApiUrl(subpath: string): string {
  const base = resolvePageBuilderApiBaseUrl();
  const path = subpath.replace(/^\//, "");
  const url = `${base}/${path}`;
  // #region agent log
  const hypothesisId = path.startsWith("lists-image")
    ? "B"
    : path.startsWith("lists")
      ? "C"
      : path.startsWith("forms")
        ? "D"
        : "A";
  fetch("http://127.0.0.1:7375/ingest/e4c19944-5710-4268-9166-c005b5bfd0b6", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1ac27e" },
    body: JSON.stringify({
      sessionId: "1ac27e",
      runId: "post-fix",
      hypothesisId,
      location: "pageBuilderApiBase.ts:pageBuilderApiUrl",
      message: "page-builder API url",
      data: {
        base,
        subpath,
        url,
        origin: typeof window !== "undefined" ? window.location.origin : null,
        isAbsolute: /^https?:\/\//i.test(url),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return url;
}

/** Rend une URL (chemin ou absolue) ciblant l’hôte du page-builder en rendu cross-site. */
export function toPageBuilderAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const base = resolvePageBuilderApiBaseUrl();
  if (/^https?:\/\//i.test(base)) {
    try {
      return new URL(trimmed, `${new URL(base).origin}/`).toString();
    } catch {
      // fall through
    }
  }
  if (typeof window !== "undefined") {
    return new URL(trimmed, window.location.origin).toString();
  }
  return trimmed;
}
