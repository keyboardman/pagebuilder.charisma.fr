import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageBackground from "./PageBackground";

describe("PageBackground", () => {
  it("ne rend rien sans vidéo configurée", () => {
    const { container } = render(<PageBackground />);
    expect(container.firstChild).toBeNull();

    const { container: colorContainer } = render(
      <PageBackground background={{ type: "color", color: "#000" }} />
    );
    expect(colorContainer.firstChild).toBeNull();

    const { container: emptyVideoContainer } = render(
      <PageBackground background={{ type: "video", url: "  " }} />
    );
    expect(emptyVideoContainer.firstChild).toBeNull();
  });

  it("affiche une vidéo en arrière-plan avec les attributs attendus", () => {
    render(
      <PageBackground
        background={{
          type: "video",
          url: "https://cdn.example.com/bg.mp4",
          poster: "https://cdn.example.com/poster.jpg",
          objectFit: "contain",
          objectPosition: "top",
        }}
      />
    );

    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video?.tagName).toBe("VIDEO");
    expect(video).toHaveAttribute("src", "https://cdn.example.com/bg.mp4");
    expect(video).toHaveAttribute("poster", "https://cdn.example.com/poster.jpg");
    expect(video).toHaveStyle({ objectFit: "contain", objectPosition: "top" });
    expect(video).toHaveClass("node-root-page-background-video");
  });

  it("utilise cover par défaut pour objectFit", () => {
    render(
      <PageBackground
        background={{
          type: "video",
          url: "https://cdn.example.com/bg.mp4",
        }}
      />
    );

    const video = document.querySelector("video");
    expect(video).toHaveStyle({ objectFit: "cover", objectPosition: "center" });
    expect(video).not.toHaveAttribute("poster");
  });
});
