import { type FC } from "react";
import { cn } from "@editeur/lib/utils";

export type ContainerPosition = "left" | "top" | "right";
export type ContainerAlign = "start" | "center" | "end" | "stretch";
export type ContainerRatio = "1/4" | "1/3"| "2/5" | "1/2" | "2/3" | "full";

interface ViewContainerProps {
    position: ContainerPosition;
    content: React.ReactNode;
    image: React.ReactNode;
}


export const ViewContainerImage: FC<{
    position: ContainerPosition;
    align: ContainerAlign;
    ratio: ContainerRatio;
    children: React.ReactNode;
}> = ({ position, align = 'start', ratio = '1/2', children }) => {


    const _position = position === "top" ? "flex-col" : "flex-row";
    const _align = `items-${align}`;
    const _width = position === "top" ? "w-full" : `w-${ratio}`;

    return (
        <div className={cn("flex items-center shrink-0", _position, _align, _width)}>
            {children}
        </div>
    )
}

export const ViewContainerContent: FC<{
    align: ContainerAlign;
    children: React.ReactNode;
    style?: React.CSSProperties;
}> = ({ align = 'start', children, style }) => {

    const _align = `justify-${align}`;

    return (
        <div className={cn("flex flex-col h-full justify-center shrink-0", _align)} style={style}>
            {children}
        </div>
    )
}

export const ViewContainer: FC<ViewContainerProps> = ({
    position = "right",
    image,
    content,
}) => {

    const containerClasses = cn(
        "flex gap-4",
        position === "top" && "flex-col",
        position === "left" && "flex-row",
        position === "right" && "flex-row-reverse"
    );

    return (
        <div className={containerClasses}>
            {image}
            <div className="flex-1">
                {content}
            </div>
        </div>
    )
}
