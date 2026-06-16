/** Sélecteurs CSS utilisés dans `Theme.config.node_overrides` (ThemeBuilder). */

export const THEME_SELECTORS = {
    container: ".ce-container",
    flex: ".ce-flex",
    grid: ".ce-grid",
    hero: ".ce-hero",
    twoColumns: ".ce-two_columns",
    form: ".ce-form",
    formLabel: ".ce-form-label",
    formControl: ".ce-form-control",
    formField: ".ce-form-field",
    formRadioLabel: ".ce-form-radio-label",
    nav: ".ce-menu",
    navApi: ".ce-menu-api",
    navItem: ".ce-nav-item",
    text: ".ce-text",
    richText: ".ce-rich-text",
    html: ".ce-html",
    header: ".ce-header",
    image: ".ce-image",
    slideshow: ".ce-slideshow",
    video: ".ce-video",
    videoIconPlayerInner: ".ce-video-icon-player-inner",
    youtube: ".ce-youtube",
    button: ".ce-button",
    topButton: ".ce-top-button",
    anniversaire: ".ce-anniversaire",
    videoHome: ".ce-video-home",
    pureMusicTopSemaine: ".ce-puremusic-top-semaine",
    cardVideo: ".ce-card-video",
    cardApi: ".ce-card-api",
    textIcon: ".ce-text-icon",
} as const;

export function headerTagSelector(tag: string): string {
    const normalized = tag.toLowerCase();
    if (/^h[1-6]$/.test(normalized)) {
        return `.ce-header-${normalized}`;
    }
    return THEME_SELECTORS.header;
}

export type CardPosition = "left" | "top" | "right" | "overlay";

export type CardPart =
    | "card"
    | "image"
    | "container-content"
    | "title"
    | "text"
    | "label";

const CARD_PART_SUFFIX: Record<CardPart, string> = {
    card: "",
    image: ".ce-card-image",
    "container-content": ".ce-card-container-content",
    title: ".ce-card-title",
    text: ".ce-card-text",
    label: ".ce-card-label",
};

export function cardPartSelector(position: CardPosition, part: CardPart): string {
    const prefix = `.ce-card-position-${position}`;
    const suffix = CARD_PART_SUFFIX[part];
    return suffix ? `${prefix} ${suffix}` : prefix;
}

export function cardApiPartSelector(position: CardPosition, part: CardPart): string {
    if (part === "card") {
        return THEME_SELECTORS.cardApi;
    }
    return cardPartSelector(position, part);
}

export function getCardThemeSelector(
    position: string | undefined,
    part: CardPart
): string {
    const normalized = (position ?? "top") as CardPosition;
    return cardPartSelector(normalized, part);
}

export function getCardApiThemeSelector(
    position: string | undefined,
    part: CardPart
): string {
    const normalized = (position ?? "top") as CardPosition;
    return cardApiPartSelector(normalized, part);
}
