import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { Badge } from "@editeur/components/ui/badge";

interface EditableLabelsProps {
    show: boolean;
    className: string;
    style: React.CSSProperties;
    labels: string[];
    onSelect: () => void;

}

export const EditableLabels: FC<EditableLabelsProps> = ({ show, className, style, labels = [], onSelect }) => {

    if (!show) return null;

    return (
        <div
            className={cn( "flex flex-wrap gap-2 cursor-pointer transition-all leading-1.5", className )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {labels.map((label) => (
                <Badge key={label} variant="secondary" style={style}>
                    {label}
                </Badge>
            ))}
            {labels.length === 0 && (
                <span className="text-xs text-muted-foreground/50">Labels...</span>
            )}
        </div>
    )
}

export default EditableLabels;