import { type FC } from "react";
import { cn } from "@editeur/lib/utils";

/**
 * Props for the ViewTitle component
 * @param title - The title to display
 * @param className - The class name to apply to the title
 * @param style - The style to apply to the title
 */
export type ViewTitleProps = {
    className: string;
    onClick?: () => void;
    show: boolean;
    style: React.CSSProperties;
    title: string;
    
}

export const ViewTitle: FC<ViewTitleProps> = ({ title, className, style, onClick, show }) => {
    if (!show) return null;

    return (
        <div
            role="heading"
            aria-level={3}
            dangerouslySetInnerHTML={{ __html: title }}
            className={cn("w-full text-xl/6 font-bold", className)}
            style={style}
            onClick={onClick}
        />
    );
}