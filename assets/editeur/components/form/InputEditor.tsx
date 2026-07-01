import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/editeur/lib/utils";

interface InputEditorProps {
    value?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    tagName?: keyof HTMLElementTagNameMap;
    onFocus?: () => void;
    onBlur?: (value: string) => void;
}

const NBSP = "\u00A0";

const spacesToNbspEntity = (text: string): string =>
    text.replace(/ /g, "&nbsp;").replace(/\u00A0/g, "&nbsp;");

/** Normalise le HTML produit par contentEditable (sauts de ligne navigateur, espaces → &nbsp;). */
export function normalizeContentEditableHtml(html: string): string {
    const trimmed = html.trim();
    if (!trimmed || trimmed === "<br>" || /^<div><br><\/div>$/i.test(trimmed)) {
        return "";
    }

    const normalized = trimmed
        .replace(/<div><br><\/div>/gi, "<br>")
        .replace(/<div>([\s\S]*?)<\/div>/gi, (_, inner: string) => {
            const content = inner.replace(/<br\s*\/?>/gi, "").trim();
            return content ? `${content}<br>` : "<br>";
        })
        .replace(/(<br\s*\/?>\s*)+$/i, "");

    return spacesToNbspEntity(normalized);
}

export function InputEditor({
    value = "",
    id,
    className,
    style,
    tagName = "div",
    onFocus,
    onBlur,
    ...rest
}: InputEditorProps) {
    const ref = useRef<HTMLElement | null>(null);
    const previousTagNameRef = useRef(tagName);
    const initializedRef = useRef(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const tagChanged = previousTagNameRef.current !== tagName;

        if (tagChanged) {
            ref.current.innerHTML = value || "";
            initializedRef.current = true;
            previousTagNameRef.current = tagName;
        } else if (!initializedRef.current) {
            ref.current.innerHTML = value || "";
            initializedRef.current = true;
        }
    }, [value, tagName]);

    useEffect(() => {
        if (!ref.current || focused) return;
        ref.current.innerHTML = value || "";
    }, [value, focused]);

    const insertTextAtCursor = (text: string) => {
        const el = ref.current;
        if (!el) return;

        el.focus();
        const selection = window.getSelection();
        if (!selection) return;

        let range: Range;
        if (selection.rangeCount > 0 && el.contains(selection.anchorNode)) {
            range = selection.getRangeAt(0);
        } else {
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
        }

        const lines = text.split(/\r?\n/);
        lines.forEach((line, index) => {
            if (index > 0) {
                const br = document.createElement("br");
                range.insertNode(br);
                range.setStartAfter(br);
                range.collapse(true);
            }
            if (line) {
                const textNode = document.createTextNode(line.replace(/ /g, NBSP));
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.collapse(true);
            }
        });

        selection.removeAllRanges();
        selection.addRange(range);
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
        if (!text) return;

        insertTextAtCursor(text);
    };

    const stopCanvasPropagation = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    const props: Record<string, unknown> = {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        className: cn("outline-1", className),
        id,
        style,
        onMouseDown: stopCanvasPropagation,
        onClick: stopCanvasPropagation,
        onFocus: () => {
            setFocused(true);
            onFocus?.();
        },
        onBlur: () => {
            setFocused(false);
            if (!ref.current) return;
            onBlur?.(normalizeContentEditableHtml(ref.current.innerHTML));
        },
        onKeyDown: handleKeyDown,
        onKeyPress: handleKeyPress,
        onPaste: handlePaste,
        ...rest,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(tagName, props as any);
}

export default InputEditor;
