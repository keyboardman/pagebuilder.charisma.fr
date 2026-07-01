import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const { createCharismaVideoPlayer, disposeCharismaVideoPlayer } = vi.hoisted(() => ({
  createCharismaVideoPlayer: vi.fn(),
  disposeCharismaVideoPlayer: vi.fn(),
}));

vi.mock("./createCharismaVideoPlayer", () => ({
  createCharismaVideoPlayer,
  disposeCharismaVideoPlayer,
}));

import { CharismaVideoPlayer } from "./CharismaVideoPlayer";

describe("CharismaVideoPlayer", () => {
  beforeEach(() => {
    createCharismaVideoPlayer.mockReset();
    disposeCharismaVideoPlayer.mockReset();
    createCharismaVideoPlayer.mockReturnValue({ isDisposed: () => false });
  });

  it("initialise Video.js et passe en état ready", async () => {
    render(
      <CharismaVideoPlayer
        src="https://example.com/video.mp4"
        mediaId="159"
        favoriCount={42}
      />
    );

    await waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalledWith(
        expect.any(HTMLVideoElement),
        expect.objectContaining({
          src: "https://example.com/video.mp4",
          mediaId: "159",
          favoriCount: 42,
        })
      );
    });

    const host = document.querySelector("[data-charisma-video-ready='true']");
    expect(host).not.toBeNull();
  });

  it("ne monte pas le player sans src", () => {
    render(<CharismaVideoPlayer src="" />);
    expect(createCharismaVideoPlayer).not.toHaveBeenCalled();
  });

  it("dispose le player au démontage", async () => {
    const player = { isDisposed: () => false };
    createCharismaVideoPlayer.mockReturnValue(player);

    const { unmount } = render(
      <CharismaVideoPlayer src="https://example.com/video.mp4" />
    );

    await waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(disposeCharismaVideoPlayer).toHaveBeenCalledWith(player);
    });
  });
});
