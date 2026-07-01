import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExplorerDropZone from "./ExplorerDropZone";

vi.mock("@dnd-kit/react", () => ({
  useDroppable: ({ data }: { data: { order: number } }) => ({
    ref: () => undefined,
    isDropTarget: data.order === 1,
  }),
}));

vi.mock("shortid", () => ({
  default: { generate: () => "drop-test-id" },
}));

describe("ExplorerDropZone", () => {
  it("affiche un indicateur actif quand isDropTarget est true", () => {
    const { container } = render(
      <ExplorerDropZone
        parent={{ id: "parent-1", zone: "main", order: 1 }}
        depth={2}
      />
    );

    const zone = container.firstChild as HTMLElement;
    expect(zone.className).toContain("bg-primary/50");
    expect(zone.style.marginLeft).toBe("28px");
  });

  it("affiche le style inactif par défaut", () => {
    const { container } = render(
      <ExplorerDropZone
        parent={{ id: "parent-1", zone: "main", order: 0 }}
        depth={0}
      />
    );

    const zone = container.firstChild as HTMLElement;
    expect(zone.className).toContain("h-1");
    expect(zone.className).not.toContain("bg-primary/50");
  });
});
