import { createElement } from "react";
import { cn } from "@editeur/lib/utils";

const TagNameEditable = ({
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
    const NBSP = "\u00A0";

    const insertTextAtCursor = (text: string) => {
        const selection = window.getSelection();
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        if (range) {
            range.deleteContents();
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === " ") {
            e.preventDefault();
            insertTextAtCursor(NBSP);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === " ") e.preventDefault();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        insertTextAtCursor(text);
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent ?? "";
        onChange(text);
    };

    return createElement(tagName, {
        contentEditable: true,
        suppressContentEditableWarning: true,
        dangerouslySetInnerHTML: { __html: label },
        ...rest,
        onKeyDown: handleKeyDown,
        onKeyPress: handleKeyPress,
        onPaste: handlePaste,
        onBlur: handleBlur,
        className: cn("inline-block", className),
        style,
    });
}

export default TagNameEditable;