import type { NodesType } from "../types/NodeType";

/** Extrait les valeurs fontFamily et leur nombre d'occurrences dans l'arbre de nodes. */
export function extractFontFamiliesFromNodes(nodes: NodesType): Map<string, number> {
  const counts = new Map<string, number>();

  const visit = (value: unknown): void => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "object") {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        if (key === "fontFamily" && typeof child === "string") {
          const family = child.trim();
          if (family) {
            counts.set(family, (counts.get(family) ?? 0) + 1);
          }
        } else {
          visit(child);
        }
      }
    }
  };

  visit(nodes);
  return counts;
}
