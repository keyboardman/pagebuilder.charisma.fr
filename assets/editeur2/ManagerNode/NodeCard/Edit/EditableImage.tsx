import { type FC } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@editeur/lib/utils";

interface EditableImageProps {
    show: boolean;
    src: string;
    alt: string;
    className: string;
    style: React.CSSProperties;
    onSelect: () => void;
}

export const EditableImage: FC<EditableImageProps> = ({ show, src, alt, className, style, onSelect }) => {

    const showPlaceholder = Boolean(src && src.trim() !== "") === false;

    if (!show) return null;

    return showPlaceholder ? (
        <div 
            className="object-cover h-full w-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg"
            onClick={() => {
                onSelect();
            }}
        >
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <span className="text-sm text-muted-foreground/50">Image</span>
        </div>
    ): (
        <img
            src={src}
            alt={alt}
            style={style}
            className={cn("object-cover h-full w-full", className)}

            onClick={() => {
                onSelect();
            }}
        />
    )
}

export default EditableImage;