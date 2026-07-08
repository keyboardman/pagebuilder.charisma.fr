import { formatFavoriCountLabel } from "./favoriCount";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export const CHARISMA_HEART_PATH = HEART_PATH;

/** Cœur rouge agrandi avec le nombre de likes en blanc au centre. */
export function renderCharismaFavoriHeart(count: number): string {
  const label = formatFavoriCountLabel(count);

  return `<span class="vjs-charisma-favori__inner" aria-hidden="true">
    <svg class="vjs-charisma-favori__svg" viewBox="0 0 24 24" focusable="false">
      <path class="vjs-charisma-favori__shape" fill="currentColor" d="${HEART_PATH}"/>
      <text class="vjs-charisma-favori__count" x="12" y="12" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-weight="700">${label}</text>
    </svg>
  </span>`;
}
