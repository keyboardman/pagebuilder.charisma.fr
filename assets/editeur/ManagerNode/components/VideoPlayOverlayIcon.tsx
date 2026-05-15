import type { CSSProperties } from "react";

export type VideoPlayOverlayIconProps = {
  innerStyle?: CSSProperties;
  /** Couleurs / taille du triangle play (masque CSS). */
  playStyle?: CSSProperties;
};

/**
 * Pastille lecture sur poster : cercle + triangle play, couleurs pilotées par le thème
 * (`background-color` sur `.ce-video-icon-player-inner` et `.ce-video-icon-player-play`).
 */
export function VideoPlayOverlayIcon({ innerStyle, playStyle }: VideoPlayOverlayIconProps = {}) {
  return (
    <div className="ce-video-icon-player-inner">
      <i className="ce-icon-video-play" />
    </div>
  );
}