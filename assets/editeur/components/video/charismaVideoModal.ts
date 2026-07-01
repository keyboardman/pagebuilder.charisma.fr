import type Player from "video.js/dist/types/player";
import {
  createCharismaVideoPlayer,
  disposeCharismaVideoPlayer,
} from "./createCharismaVideoPlayer";
import { fetchCharismaMediaFavoriCount } from "./mediaApi";
import { parseFavoriCountAttribute } from "./favoriCount";
import "video.js/dist/video-js.css";
import "./charismaVideo.css";

export interface CharismaVideoModalOptions {
  src: string;
  poster?: string;
  mediaId?: string;
  favoriCount?: number;
}

export function openCharismaVideoModal(options: CharismaVideoModalOptions): () => void {
  const { src, poster = "", mediaId, favoriCount } = options;
  if (!src) return () => undefined;

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4";

  const wrap = document.createElement("div");
  wrap.className = "relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden";

  const playerHost = document.createElement("div");
  playerHost.className = "w-full h-full";
  playerHost.dataset.vjsPlayer = "true";

  const video = document.createElement("video");
  video.className = "video-js vjs-big-play-centered w-full h-full";
  video.setAttribute("playsinline", "true");
  playerHost.appendChild(video);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className =
    "absolute right-4 top-4 z-10 rounded-sm opacity-70 hover:opacity-100 bg-white/90 text-black p-2";
  closeButton.setAttribute("aria-label", "Fermer");
  closeButton.textContent = "\u2715";

  let player: Player | null = null;
  let closed = false;

  const close = () => {
    closed = true;
    disposeCharismaVideoPlayer(player);
    player = null;
    overlay.remove();
  };

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  wrap.appendChild(playerHost);
  wrap.appendChild(closeButton);
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);

  void (async () => {
    let resolvedFavoriCount = favoriCount;
    if (mediaId && resolvedFavoriCount === undefined) {
      resolvedFavoriCount = await fetchCharismaMediaFavoriCount(mediaId);
    }
    if (closed) return;

    player = createCharismaVideoPlayer(video, {
      src,
      poster,
      mediaId,
      favoriCount: resolvedFavoriCount,
      autoplay: true,
    });
  })();

  return close;
}

export function initCharismaVideoModals(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-video-src]").forEach((element) => {
    if (element.dataset.videoModalInit) return;
    element.dataset.videoModalInit = "1";

    element.addEventListener("click", (event) => {
      event.preventDefault();
      const src = element.getAttribute("data-video-src");
      if (!src) return;

      openCharismaVideoModal({
        src,
        poster: element.getAttribute("data-video-poster") || "",
        mediaId: element.getAttribute("data-media-id") || undefined,
        favoriCount: parseFavoriCountAttribute(element.getAttribute("data-favori-count")),
      });
    });
  });
}
