import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";

export type ViewLabelProps = {
    className: string;
    label: string;
    onClick?: () => void;
    show: boolean;
    style: React.CSSProperties;
    
}

export const ViewLabel: FC<ViewLabelProps> = ({ label, className, style, show, onClick }) => {
    if (!show || !label || label.trim() === "") return null;

    return (
        <div className="flex flex-wrap gap-2"  onClick={onClick}>
            <span dangerouslySetInnerHTML={{ __html: label }} className={cn("ce-card-label", className)} style={styleForView(style)} />
        </div>
    );
}