import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { registerCharismaVideoPlugins } from "./registerCharismaVideoPlugins";
import { buildControlBarChildrenWithFavori } from "./controlBarChildren";

export interface CharismaVideoPlayerOptions {
  src: string;
  poster?: string;
  mediaId?: string;
  favoriCount?: number;
  autoplay?: boolean;
}

export function createCharismaVideoPlayer(
  element: HTMLElement,
  options: CharismaVideoPlayerOptions
): Player {
  registerCharismaVideoPlugins();

  

  const mediaId = options.mediaId?.trim();

  const playerOptions: Record<string, unknown> = {
    sources: [{ src: options.src, type: "video/mp4" }],
    poster: options.poster || undefined,
    autoplay: options.autoplay ?? true,
    controls: true,
    fluid: true,
    responsive: true,
    playsinline: true,
  };

  if (mediaId) {
    playerOptions.controlBar = {
      children: buildControlBarChildrenWithFavori(mediaId, options.favoriCount),
    };
    playerOptions.plugins = {
      charismaMediaCompteur: { mediaId },
    };
  }

  return videojs(element, playerOptions);
}

export function disposeCharismaVideoPlayer(player: Player | null | undefined): void {
  if (!player || player.isDisposed()) return;
  player.dispose();
}
