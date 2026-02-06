import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import { styleForView } from "../../../utils/styleHelper";

export type ViewImageProps = {
    image: string;
    alt: string;
    className: string;
    style: React.CSSProperties;
}

const ViewImage: FC<{
    image: string;
    alt: string;
    className: string;
    style: React.CSSProperties;
  }> = ({ image, alt, className, style }) => {
    const showPlaceholder = Boolean(image && image.trim() !== "") === false;
    if (showPlaceholder) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
        </div>
      );
    }
    return (
      <img src={image} alt={alt} className={cn("w-full h-full object-cover", className)} style={styleForView(style)} />
    );
  };

  export default ViewImage;