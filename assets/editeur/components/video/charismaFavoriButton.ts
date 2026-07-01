import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { sendCharismaMediaFavori } from "./mediaApi";
import { isFavoriOnCooldown, setFavoriCooldown } from "./favoriStorage";
import { renderCharismaFavoriHeart } from "./heartIcon";

export interface CharismaFavoriButtonOptions {
  mediaId?: string;
  favoriCount?: number;
}

let favoriComponentRegistered = false;

export function registerCharismaFavoriButtonPlugin(): void {
  if (favoriComponentRegistered || videojs.getComponent("CharismaFavoriButton")) {
    favoriComponentRegistered = true;
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const VjsButton = videojs.getComponent("Button") as any;

  if (!VjsButton) {
    return;
  }

  class CharismaFavoriButton extends VjsButton {
    private mediaId: string;
    private favoriCount: number;
    private favoriDisabled = false;

    constructor(player: Player, options: CharismaFavoriButtonOptions & Record<string, unknown>) {
      super(player, options);
      this.mediaId = options.mediaId ?? "";
      this.favoriCount = typeof options.favoriCount === "number" ? Math.max(0, options.favoriCount) : 0;
      this.updateHeartDisplay();
      this.addClass("vjs-charisma-favori");

      if (this.mediaId && isFavoriOnCooldown(this.mediaId)) {
        this.disableFavoriButton();
      }
    }

    private updateHeartDisplay(): void {
      this.controlText(`Ajouter aux favoris (${this.favoriCount})`);
      this.el().innerHTML = renderCharismaFavoriHeart(this.favoriCount);
    }

    private disableFavoriButton(): void {
      this.favoriDisabled = true;
      this.addClass("vjs-charisma-favori--disabled");
      this.el().setAttribute("aria-disabled", "true");
    }

    handleClick(): void {
      if (this.favoriDisabled || !this.mediaId || isFavoriOnCooldown(this.mediaId)) {
        this.disableFavoriButton();
        return;
      }

      this.favoriCount += 1;
      this.updateHeartDisplay();
      this.disableFavoriButton();
      setFavoriCooldown(this.mediaId);

      void sendCharismaMediaFavori(this.mediaId)
        .then((response) => {
          if (response.ok || response.status === 429) {
            return;
          }
        })
        .catch(() => undefined);
    }

    buildCSSClass(): string {
      return `vjs-charisma-favori ${super.buildCSSClass()}`;
    }
  }

  videojs.registerComponent("CharismaFavoriButton", CharismaFavoriButton as never);
  favoriComponentRegistered = true;
}
