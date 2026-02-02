import React, { createContext, useContext } from "react"
import { cn } from "@editeur/lib/utils";

type CardVariant = "top" | "left" | "right" | "overlay"

type CardAlign = "start" | "center" | "end" | "stretch"

const CardContext = createContext<{ variant: CardVariant, align: CardAlign }>({
    variant: "top",
    align: "center",
})

export function useCard() {
    const ctx = useContext(CardContext)
    if (!ctx) throw new Error("Card components must be used inside <Card />")
    return ctx
}


type CardProps = {
    variant?: CardVariant;
    align?: CardAlign;

    id?: string;
    style?: React.CSSProperties;
    className?: string;
    children: React.ReactNode;
}

export function Card({ children, className, style, variant = "top", align = "center" }: CardProps) {

    return (
        <CardContext.Provider value={{ variant, align }}>
            <div
                data-variant={variant}
                className={cn(
                    "relative overflow-hidden",
                    variant === "top" && "flex flex-col",
                    variant === "left" && "flex",
                    variant === "right" && "flex flex-row-reverse",
                    variant === "overlay" && "flex",
                    variant !== "overlay" && align === "start" && "items-start",
                    variant !== "overlay" && align === "center" && "items-center",
                    variant !== "overlay" && align === "end" && "items-end",
                    variant !== "overlay" && align === "stretch" && "items-stretch",
                    className
                )}
                style={style}
            >
                {children}
            </div>
        </CardContext.Provider>

    )
}