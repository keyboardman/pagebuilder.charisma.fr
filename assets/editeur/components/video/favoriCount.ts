function readFavoriValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return null;
}

/** Extrait le nombre de favoris depuis un objet API ou un item mappé (`favori` ou `raw.favori`). */
export function parseFavoriCount(source: unknown): number {
  if (!source || typeof source !== "object") return 0;

  const obj = source as Record<string, unknown>;
  const direct = readFavoriValue(obj.favori);
  if (direct !== null) return direct;

  const nestedRaw = obj.raw;
  if (nestedRaw && typeof nestedRaw === "object") {
    const nested = readFavoriValue((nestedRaw as Record<string, unknown>).favori);
    if (nested !== null) return nested;
  }

  return 0;
}

export function formatFavoriCountLabel(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "0";
  if (count > 9999) return "9999+";
  return String(Math.floor(count));
}

export function parseFavoriCountAttribute(value: string | null | undefined): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.floor(parsed));
}
