import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { Image as ImageIcon } from "lucide-react";

export type ViewImageProps = {
    alt: string;
    className: string;
    image: string;
    style: React.CSSProperties;
    onClick?: () => void;
}

export const ViewImage: FC<ViewImageProps> = ({ alt, className, image, style, onClick }) => {
    const showPlaceholder = Boolean(image && image.trim() !== "") === false;
    const sharedClassName = cn(
        "ce-card-image",
        className,
        onClick ? "cursor-pointer" : "",
        showPlaceholder &&
            "flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg min-h-0"
    );
    // Placeholder sans aspectRatio natif : garder une boîte stable (sinon hauteur = icône seule).
    const resolvedStyle: React.CSSProperties = showPlaceholder
        ? {
            ...style,
            ...(style?.aspectRatio == null || String(style.aspectRatio).trim() === ""
                ? { aspectRatio: "1 / 1" }
                : {}),
          }
        : style;

    if (showPlaceholder) {
        return (
            <div
                className={sharedClassName}
                style={resolvedStyle}
                onClick={onClick}
            >
                <ImageIcon className="h-8 w-8 text-muted-foreground/50 shrink-0" />
            </div>
        );
    }
    return (
        <img
            src={image}
            alt={alt}
            className={sharedClassName}
            style={resolvedStyle}
            onClick={onClick}
            loading="lazy"
        />
    );
}
