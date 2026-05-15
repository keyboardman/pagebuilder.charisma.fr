import { cn } from "@/lib/utils";
import { toReactStyle, toThemePreviewAssetUrl } from "../utils";
import { useTheme } from "../ThemeContext";
import { VideoPlayOverlayIcon } from "@/editeur/ManagerNode/components/VideoPlayOverlayIcon";

type OverridesState = Record<string, Record<string, string>>;

const PREVIEW_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Cpath d='M120 280l120-130 90 95 70-80 150 115' fill='none' stroke='%239ca3af' strokeWidth='14' strokeLinecap='round' strokeLinejoin='round'/%3E%3Ccircle cx='230' cy='125' r='32' fill='%239ca3af'/%3E%3C/svg%3E";


export const Card = ({ overrides, position, isApi }: { overrides: OverridesState, position: string, isApi: boolean }) => {
    const _prefix = `.ce-card-position-${position}`;
    const className = isApi ? cn("ce-card-api ce-card-api-align-start", `ce-card-api-position-${position}`) : cn("ce-card ce-card-align-start", `ce-card-position-${position}`);


    return (
        <div className="space-y-2">
            <article className={className} style={toReactStyle(overrides[`${_prefix}`] ?? {})}>
                <img src={PREVIEW_IMAGE} alt="Card" className={isApi ? "ce-card-api-image" : "ce-card-image"} style={toReactStyle(overrides[`${_prefix} .ce-card-image`] ?? {})} />
                <div className={isApi ? "ce-card-api-container-content" : "ce-card-container-content"} style={toReactStyle(overrides[`${_prefix} .ce-card-container-content`] ?? {})}>
                    <div className={isApi ? "ce-card-api-title" : "ce-card-title"} style={toReactStyle(overrides[`${_prefix} .ce-card-title`] ?? {})}>Titre de carte</div>
                    {position !== 'overlay' ? (
                        <div className={isApi ? "ce-card-api-text" : "ce-card-text"} style={toReactStyle(overrides[`${_prefix} .ce-card-text`] ?? {})}>Texte descriptif de la carte pour l&apos;aperçu visuel.</div>
                    ) : false}
                    <div className="flex flex-wrap gap-2">
                        <span className={isApi ? "ce-card-api-label" : "ce-card-label"} style={toReactStyle(overrides[`${_prefix} .ce-card-label`] ?? {})}>Label</span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export const Media = ({ type }: { type: string }) => {
    const { getStyleFromOverride, getVideoPlayerIconUrl } = useTheme();
    switch (type) {
        case 'node-image':
            return (
                <img src={PREVIEW_IMAGE} alt="Media" className="ce-image" style={getStyleFromOverride('.ce-image')} />
            );
        case 'node-video': {
            const playerIconPreviewUrl = toThemePreviewAssetUrl(getVideoPlayerIconUrl());
            return (
                <div
                    className="ce-video"
                    style={{
                        ['--ce-video-player-icon-url' as string]: `url("${playerIconPreviewUrl}")`,
                    }}
                >
                    <img src={PREVIEW_IMAGE} alt="Media" className="ce-video-poster" style={getStyleFromOverride('.ce-video')} />
                    <VideoPlayOverlayIcon />
                </div>
            );
        }
        default:
            return null;
    }
};

export default { Card, Media };
