import type { NodesType } from "../types/NodeType";
import {
  registerPageFont,
  unregisterPageFont,
  isProtectedFontFamily,
  markThemeFontFamilies,
} from "../services/typography";
import { resolveFontFamily, type FontPayload } from "./backendFontAdapter";
import { extractFontFamiliesFromNodes } from "./scanNodeFonts";

type FontEntry = {
  fontId: number;
  payload: FontPayload;
};

let entries = new Map<number, FontEntry>();
let themeFontIds = new Set<number>();
let syncGeneration = 0;
let pendingSync: Promise<void> | null = null;

export function initThemeFontFamilies(families: string[]): void {
  markThemeFontFamilies(families);
}

export function initThemeFontIds(ids: number[]): void {
  themeFontIds = new Set(ids.filter((id) => id > 0));
}

export function getThemeFontIds(): number[] {
  return Array.from(themeFontIds);
}

export function isExcludedPageFont(payload: FontPayload): boolean {
  return payload.type === "native" || themeFontIds.has(payload.id);
}

/** Chargement immédiat après sélection dans ManagerFont (la sync nodes prend le relais). */
export function adoptPageFont(payload: FontPayload): void {
  registerPageFont({
    name: payload.name,
    href: payload.href,
    fontFamily: payload.fontFamily,
  });
}

function releaseFont(fontId: number): void {
  const entry = entries.get(fontId);
  if (!entry) return;
  entries.delete(fontId);
  unregisterPageFont(entry.payload.fontFamily, entry.payload.href);
}

/** Resynchronise le registre à partir des nodes (compteurs par fontFamily résolue). */
export function syncFontUsageFromNodes(nodes: NodesType, apiBaseUrl: string | null): Promise<void> {
  if (!apiBaseUrl) {
    return Promise.resolve();
  }

  const generation = ++syncGeneration;
  pendingSync = (async () => {
    const familyCounts = extractFontFamiliesFromNodes(nodes);
    const resolvedById = new Map<number, FontPayload>();

    for (const [family] of familyCounts) {
      if (isProtectedFontFamily(family)) continue;

      const payload = await resolveFontFamily(apiBaseUrl, family);
      if (!payload || isExcludedPageFont(payload)) continue;

      resolvedById.set(payload.id, payload);
    }

    if (generation !== syncGeneration) return;

    const nextIds = new Set(resolvedById.keys());

    for (const fontId of entries.keys()) {
      if (!nextIds.has(fontId)) {
        releaseFont(fontId);
      }
    }

    for (const [fontId, payload] of resolvedById) {
      if (!entries.has(fontId)) {
        entries.set(fontId, { fontId, payload });
        registerPageFont({
          name: payload.name,
          href: payload.href,
          fontFamily: payload.fontFamily,
        });
      } else {
        entries.set(fontId, { fontId, payload });
      }
    }
  })();

  return pendingSync;
}

export async function flushFontUsageSync(): Promise<void> {
  if (pendingSync) {
    await pendingSync;
  }
}
