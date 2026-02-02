import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { Badge } from "@editeur/components/ui/badge";

export type ViewLabelProps = {
    className: string;
    label: string;
    onClick?: () => void;
    show: boolean;
    style: React.CSSProperties;
    
}

export const ViewLabel: FC<ViewLabelProps> = ({ label, className, style, show, onClick }) => {
    if (!show) return null;

    return (
        <div className="flex flex-wrap gap-2"  onClick={onClick}>
            <Badge variant="secondary" className={cn(className)} style={style}>{label}</Badge>
        </div>
    );
}