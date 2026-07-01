import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { CHARISMA_MEDIA_COMPTEUR_MIN_PLAYBACK_SEC } from "./constants";
import { sendCharismaMediaCompteur } from "./mediaApi";
import { createCompteurTracker, type CompteurTracker } from "./compteurTracker";

export interface CharismaMediaCompteurOptions {
  mediaId?: string;
}

type CompteurSender = (mediaId: string) => Promise<unknown>;

export function setupCharismaMediaCompteur(
  player: Player,
  mediaId: string,
  options: {
    tracker?: CompteurTracker;
    send?: CompteurSender;
    minPlaybackSec?: number;
  } = {}
): void {
  const tracker = options.tracker ?? createCompteurTracker();
  const send = options.send ?? sendCharismaMediaCompteur;
  const threshold = options.minPlaybackSec ?? CHARISMA_MEDIA_COMPTEUR_MIN_PLAYBACK_SEC;

  const trySendCompteur = function (this: Player) {
    const time = this.currentTime() ?? 0;
    if (!tracker.shouldSend() || time < threshold) {
      return;
    }
    tracker.markSent();
    player.off("timeupdate", trySendCompteur);
    void send(mediaId).catch(() => undefined);
  };

  player.on("timeupdate", trySendCompteur);
  player.on("dispose", () => {
    player.off("timeupdate", trySendCompteur);
  });

  if (tracker.shouldSend() && (player.currentTime() ?? 0) >= threshold) {
    trySendCompteur.call(player);
  }
}

export function registerCharismaMediaCompteurPlugin(): void {
  if (videojs.getPlugin("charismaMediaCompteur")) {
    return;
  }

  videojs.registerPlugin(
    "charismaMediaCompteur",
    function charismaMediaCompteur(this: Player, options: CharismaMediaCompteurOptions = {}) {
      const mediaId = options.mediaId?.trim();
      if (!mediaId) return;

      this.ready(() => {
        setupCharismaMediaCompteur(this, mediaId);
      });
    }
  );
}
