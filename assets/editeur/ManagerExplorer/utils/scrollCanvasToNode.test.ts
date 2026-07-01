import { describe, expect, it, vi } from "vitest";
import { scrollCanvasToNode } from "./scrollCanvasToNode";

describe("scrollCanvasToNode", () => {
  it("appelle scrollIntoView sur le nœud ciblé", () => {
    const scrollIntoView = vi.fn();
    const el = document.createElement("div");
    el.setAttribute("data-ce-id", "node-42");
    el.scrollIntoView = scrollIntoView;
    document.body.appendChild(el);

    scrollCanvasToNode("node-42");

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });

    el.remove();
  });

  it("ne fait rien si le nœud est absent", () => {
    expect(() => scrollCanvasToNode("missing-node")).not.toThrow();
  });
});
