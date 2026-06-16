import type { FC, PropsWithChildren } from "react";
import { cn } from "@/editeur/lib/utils";

type SettingsSectionTitleProps = PropsWithChildren<{
    className?: string;
}>;

export const SettingsSectionTitle: FC<SettingsSectionTitleProps> = ({ children, className }) => (
    <div
        className={cn(
            "text-center text-sm py-0 leading-tight text-muted-foreground bg-muted",
            className
        )}
    >
        {children}
    </div>
);
