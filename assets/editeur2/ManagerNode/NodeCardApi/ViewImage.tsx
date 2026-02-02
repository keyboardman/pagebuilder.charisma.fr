import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { Image as ImageIcon } from "lucide-react";

export type ViewImageProps = {
    alt: string;
    className: string;
    image: string;
    style: React.CSSProperties;
}

export const ViewImage: FC<ViewImageProps> = ({ alt, className, image, style }) => {
    const showPlaceholder = Boolean(image && image.trim() !== "") === false;
    if (showPlaceholder) {
        return (
            <div className="w-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            </div>
        );
    }
    return (
        <img src={image} alt={alt} className={cn("w-full h-auto object-cover", className)} style={style} />
    );
}