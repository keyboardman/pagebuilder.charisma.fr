import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";

interface ContainerProps {
    position: ContainerPosition;
    content: React.ReactNode;
    image: React.ReactNode;
}


export const ContainerImage: FC<{
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

export const ContainerContent: FC<{
    align: ContainerAlign;
    children: React.ReactNode;
}> = ({ align = 'start', children }) => {

    const _align = `justify-${align}`;

    return (
        <div className={cn("flex flex-col h-full justify-center shrink-0", _align)}>
            {children}
        </div>
    )
}

export const Container: FC<ContainerProps> = ({
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


export default Container;