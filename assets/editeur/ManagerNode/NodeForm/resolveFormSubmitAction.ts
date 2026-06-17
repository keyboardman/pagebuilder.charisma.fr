const LEGACY_SUBMIT_PATH = /^\/submit\/form\/([a-z0-9][a-z0-9_-]*)\/?$/;
const API_SUBMIT_PATH = /^\/api\/page-builder\/forms\/([a-z0-9][a-z0-9_-]*)\/submit\/?$/;

/** URL API Platform de soumission pour un slug de configuration. */
export function builderFormSubmitPath(slug: string): string {
  return `/api/page-builder/forms/${slug}/submit`;
}

function pathnameFromAction(action: string): string {
  const trimmed = action.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Résout l’URL de soumission : priorité à formConfigId, puis migration des routes legacy.
 */
export function resolveFormSubmitAction(action: string, formConfigId?: string): string {
  const slug = (formConfigId ?? "").trim();
  if (slug !== "") {
    return builderFormSubmitPath(slug);
  }

  const path = pathnameFromAction(action);
  const legacy = path.match(LEGACY_SUBMIT_PATH);
  if (legacy) {
    return builderFormSubmitPath(legacy[1]);
  }

  if (API_SUBMIT_PATH.test(path)) {
    return path.replace(/\/$/, "");
  }

  return action.trim();
}
