import { createElement } from "react";
import { cn } from "@editeur/lib/utils";

const  TagNameEditable = ({
    tagName,
    className,
    style,
    label,
    onChange,
    ...rest
}: {
    tagName: string;
    className: string;
    style: React.CSSProperties;
    label: string;
    onChange: (tagName: string) => void;
    [key: string]: any;
}) => {

    return createElement(tagName, {
        contentEditable: true,
        suppressContentEditableWarning: true,
        dangerouslySetInnerHTML: { __html: label },
        ...rest,
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
            onChange(e.target.innerHTML);
        },
        className: cn("inline-block", className),
        style,
    });
}

export default TagNameEditable;