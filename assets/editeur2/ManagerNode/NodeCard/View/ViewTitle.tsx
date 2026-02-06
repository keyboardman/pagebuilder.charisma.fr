import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";

export type ViewTitleProps = {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

export const ViewTitle: FC<ViewTitleProps> = ({ text, className, style }) => (
    <div
        role="heading"
        aria-level={3}
        dangerouslySetInnerHTML={{ __html: text }}
        className={cn("node-block-title w-full leading-1.2 text-xl font-bold", className ?? "")}
        style={styleForView(style ?? {})}
    />
);

export default ViewTitle;