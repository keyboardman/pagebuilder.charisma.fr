import { type FC } from "react";
import { cn } from "@editeur/lib/utils";

export type ViewEmptyApiProps = {
    className: string;  
    style: React.CSSProperties;
}

export const ViewEmptyApi: FC<ViewEmptyApiProps> = ({ className, style }) => {
    return (
        <div className={cn("w-full h-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg", className)} style={style}>
            <p className="text-sm text-muted-foreground">Aucun item sélectionné</p>
        </div>
    );
}