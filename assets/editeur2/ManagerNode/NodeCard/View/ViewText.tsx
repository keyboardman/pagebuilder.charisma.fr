import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";

export type ViewTextProps = {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

export const ViewText: FC<ViewTextProps> = ({ text, className, style }) => (
    <div
        dangerouslySetInnerHTML={{ __html: text }}
        className={cn("text-base/6", className)}
        style={styleForView(style)}
    />
);

export default ViewText;