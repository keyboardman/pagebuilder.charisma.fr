/** Ordre par défaut de la control bar Video.js (sans bouton favori). */
const CONTROL_BAR_CHILDREN_BEFORE_FAVORI = [
  "playToggle",
  "skipBackward",
  "skipForward",
  "volumePanel",
  "currentTimeDisplay",
  "timeDivider",
  "durationDisplay",
  "progressControl",
  "liveDisplay",
  "seekToLive",
  "remainingTimeDisplay",
  "customControlSpacer",
  "playbackRateMenuButton",
  "chaptersButton",
  "descriptionsButton",
  "subsCapsButton",
  "audioTrackButton",
] as const;

const CONTROL_BAR_CHILDREN_AFTER_FAVORI = ["pictureInPictureToggle", "fullscreenToggle"] as const;

export type ControlBarChild = string | { name: string; mediaId: string; favoriCount?: number };

/** Control bar avec le cœur juste avant pictureInPictureToggle. */
export function buildControlBarChildrenWithFavori(
  mediaId: string,
  favoriCount?: number
): ControlBarChild[] {
  return [
    ...CONTROL_BAR_CHILDREN_BEFORE_FAVORI,
    { name: "CharismaFavoriButton", mediaId, favoriCount },
    ...CONTROL_BAR_CHILDREN_AFTER_FAVORI,
  ];
}
