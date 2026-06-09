import { createElement, useEffect, useRef, useState } from "react";
import { Bold } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import { sanitizeButtonLabelHtml } from "../shared";

const TagNameEditable = ({
  tagName,
  className,
  style,
  label,
  onChange,
  allowPartialBold = false,
  ...rest
}: {
  tagName: string;
  className: string;
  style: React.CSSProperties;
  label: string;
  onChange: (value: string) => void;
  allowPartialBold?: boolean;
  [key: string]: unknown;
}) => {
  const NBSP = "\u00A0";
  const ref = useRef<HTMLElement | null>(null);
  const previousTagNameRef = useRef(tagName);
  const initializedRef = useRef(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const tagChanged = previousTagNameRef.current !== tagName;
    if (tagChanged || !initializedRef.current) {
      ref.current.innerHTML = label || "";
      initializedRef.current = true;
      previousTagNameRef.current = tagName;
    }
  }, [label, tagName]);

  useEffect(() => {
    if (!ref.current || focused) return;
    ref.current.innerHTML = label || "";
  }, [label, focused]);

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

    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const applyBold = () => {
    ref.current?.focus();
    document.execCommand("bold");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (allowPartialBold && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      document.execCommand("bold");
      return;
    }

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

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (!ref.current) return;

    if (allowPartialBold) {
      const sanitized = sanitizeButtonLabelHtml(ref.current.innerHTML);
      ref.current.innerHTML = sanitized;
      onChange(sanitized);
      return;
    }

    onChange(ref.current.textContent ?? "");
  };

  const editable = createElement(tagName, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    ...rest,
    onKeyDown: handleKeyDown,
    onKeyPress: handleKeyPress,
    onPaste: handlePaste,
    onFocus: handleFocus,
    onBlur: handleBlur,
    className: cn("inline-block", className),
    style,
  });

  if (!allowPartialBold) {
    return editable;
  }

  return (
    <span className="relative inline-block max-w-full">
      {focused && (
        <span
          className="absolute -top-8 left-0 z-20 flex rounded-md border border-border bg-background shadow-sm"
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
            title="Gras (Ctrl+B)"
            onClick={applyBold}
          >
            <Bold size={14} strokeWidth={2.5} />
          </button>
        </span>
      )}
      {editable}
    </span>
  );
};

export default TagNameEditable;
