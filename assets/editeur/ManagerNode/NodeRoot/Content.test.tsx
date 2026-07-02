import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Content from "./Content";

vi.mock("../components/NodeCollection", () => ({
  default: ({ parentId, zone }: { parentId: string; zone: string }) => (
    <div data-testid="node-collection" data-parent={parentId} data-zone={zone} />
  ),
}));

describe("NodeRoot Content", () => {
  it("rend le wrapper et la collection enfants", () => {
    render(<Content nodes={{}} nodeId="root-1" breakpoint="desktop" />);

    expect(screen.getByTestId("node-collection")).toHaveAttribute("data-parent", "root-1");
    expect(screen.getByTestId("node-collection")).toHaveAttribute("data-zone", "main");

    const wrapper = document.querySelector(".node-root-content");
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass("min-h-screen");
  });

  it("ajoute bg-background sans arrière-plan personnalisé", () => {
    render(<Content nodes={{}} nodeId="root-1" breakpoint="desktop" />);

    const innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).toContain("bg-background");
  });

  it("retire bg-background avec un arrière-plan personnalisé", () => {
    render(
      <Content
        nodes={{}}
        nodeId="root-1"
        breakpoint="desktop"
        background={{ type: "color", color: "#abcdef" }}
      />
    );

    const wrapper = document.querySelector(".node-root-content") as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe("rgb(171, 205, 239)");

    const innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).not.toContain("bg-background");
  });

  it("applique les classes de breakpoint", () => {
    const { rerender } = render(<Content nodes={{}} nodeId="root-1" breakpoint="mobile" />);
    let innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).toContain("max-w-sm");
    expect(innerColumn?.className).toContain("px-4");

    rerender(<Content nodes={{}} nodeId="root-1" breakpoint="tablet" />);
    innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).toContain("max-w-lg");
    expect(innerColumn?.className).toContain("px-4");

    rerender(<Content nodes={{}} nodeId="root-1" />);
    innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).toContain("max-w-3xl");
    expect(innerColumn?.className).toContain("max-lg:px-4");
  });
});
