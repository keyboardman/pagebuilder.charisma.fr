import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

export type ViewTextProps = {
    className: string;
    onClick?: () => void;
    show: boolean;
    style: React.CSSProperties;
    text: string;
    
}

export const ViewText: FC<ViewTextProps> = ({ className, show, style, text, onClick }) => {
    if (!show) return null;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: text }}
            className={cn("text-base/6", className)}
            style={styleForView(style)}
            onClick={onClick}
        />
    );
}