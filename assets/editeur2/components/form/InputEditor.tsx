import React, { useRef, useEffect } from "react";
import { cn } from "@editeur/lib/utils";

interface InputEditorProps {
    value?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    tagName?: keyof HTMLElementTagNameMap;
    onFocus?: () => void;
    onBlur?: (value: string) => void;
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

    // ✅ Réinitialiser le contenu quand le tagName change ou à l'initialisation
    useEffect(() => {
        if (!ref.current) return;
        
        const tagChanged = previousTagNameRef.current !== tagName;
        
        // Si le tag a changé, réinitialiser le contenu
        if (tagChanged) {
            ref.current.innerHTML = value || "";
            initializedRef.current = true;
            previousTagNameRef.current = tagName;
        } 
        // Sinon, initialiser une seule fois si pas déjà fait
        else if (!initializedRef.current) {
            ref.current.innerHTML = value || "";
            initializedRef.current = true;
        }
    }, [value, tagName]);

    const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();

        const text = e.clipboardData.getData("text/plain");
        if (!text) return;

        const el = ref.current;
        if (!el) return;

        // focus sur l'élément
        el.focus();

        const selection = window.getSelection();
        if (!selection) return;

        // si pas de range sélectionné, on en crée un à la fin
        let range: Range;
        if (selection.rangeCount > 0 && el.contains(selection.anchorNode)) {
            range = selection.getRangeAt(0);
        } else {
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
        }

        // insérer le texte
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // placer le curseur après le texte
        range.setStartAfter(textNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    };

    const props: Record<string, unknown> = {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        className: cn("outline-1", className),
        id,
        style,
        onFocus: () => {
            onFocus?.();
        },
        onBlur: () => {
            if (!ref.current) return;
            onBlur?.(ref.current.innerHTML);
        },
        onPaste: handlePaste,
        ...rest,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(tagName, props as any);
}

export default InputEditor;
