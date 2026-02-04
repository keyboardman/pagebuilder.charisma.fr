import { cn } from "@editeur/lib/utils";
import { type FC, type ReactNode } from "react";

export type ViewContentOverlayProps = {
    position?: 'bottom' | 'top' | 'center';
    background?: {
        gradient?: string;
        color?: string | null;
    };
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export const ViewContentOverlayWrapper: FC<{children: ReactNode}> = ({ children }) => {
    return (
        <div className="relative w-full overflow-hidden">
            {children}
        </div>
    );
}

export const ViewContentOverlay: FC<ViewContentOverlayProps> = ({ position, background, children, style }) => {
    const positionClasses = {
        bottom: "bottom-0 left-0 right-0",
        top: "top-0 left-0 right-0",
        center: "top-1/2 left-0 right-0 -translate-y-1/2",
    };

    const backgroundStyle: React.CSSProperties = {};

    if (background?.gradient) {
        backgroundStyle.backgroundImage = background.gradient;
    } else if (background?.color) {
        backgroundStyle.backgroundColor = background.color;
    }

    return (
        <div
            className={cn(
                "absolute px-4 py-3 z-10 w-full",
                position ? positionClasses[position] : ""
            )}
            style={{ ...backgroundStyle, ...style }}
        >
            {children}
        </div>
    );
}
