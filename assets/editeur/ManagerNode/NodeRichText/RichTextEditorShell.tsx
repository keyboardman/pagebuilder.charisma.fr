import React, {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRichTextLexicalConfig } from "./richTextLexicalConfig";
import { cn } from "@/editeur/lib/utils";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_LOW,
  type ElementFormatType,
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  mergeRegister,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";
import { $findMatchingParent } from "@lexical/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link,
  Link2Off,
  Minus,
  Redo2,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";

type ToolbarUi = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  blockKey: string;
  blockLabel: string;
  elementFormat: ElementFormatType;
  canUndo: boolean;
  canRedo: boolean;
};

const defaultToolbar: ToolbarUi = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  code: false,
  blockKey: "paragraph",
  blockLabel: "Normal",
  elementFormat: "left",
  canUndo: false,
  canRedo: false,
};

function normalizeAlign(format: ElementFormatType): "left" | "center" | "right" | "justify" {
  if (format === "start") return "left";
  if (format === "end") return "right";
  if (format === "center" || format === "right" || format === "justify") return format;
  return "left";
}

function $readInlineFormats(): Pick<
  ToolbarUi,
  "bold" | "italic" | "underline" | "strikethrough" | "code"
> {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
    };
  }
  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
    code: selection.hasFormat("code"),
  };
}

function $readToolbarState(): ToolbarUi {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return defaultToolbar;
  }

  const anchorNode = selection.anchor.getNode();
  const listNode = $findMatchingParent(anchorNode, $isListNode);

  let blockKey = "paragraph";
  let blockLabel = "Normal";

  if (listNode) {
    const lt = listNode.getListType();
    if (lt === "bullet") {
      blockKey = "bullet";
      blockLabel = "Bullet List";
    } else if (lt === "number") {
      blockKey = "number";
      blockLabel = "Numbered List";
    } else if (lt === "check") {
      blockKey = "check";
      blockLabel = "Check List";
    }
  } else {
    let element = null;
    try {
      element =
        anchorNode.getKey() === "root"
          ? null
          : anchorNode.getTopLevelElementOrThrow();
    } catch {
      element = null;
    }

    if (element) {
      if ($isHeadingNode(element)) {
        blockKey = element.getTag();
        blockLabel = `Heading ${element.getTag().replace("h", "")}`;
      } else if ($isQuoteNode(element)) {
        blockKey = "quote";
        blockLabel = "Quote";
      } else if ($isCodeNode(element)) {
        blockKey = "code";
        blockLabel = "Code Block";
      }
    }
  }

  let elementFormat: ElementFormatType = "left";
  try {
    const fmtEl =
      anchorNode.getKey() === "root" ? null : anchorNode.getTopLevelElementOrThrow();
    if (fmtEl && $isElementNode(fmtEl)) {
      elementFormat = fmtEl.getFormatType();
    }
  } catch {
    elementFormat = "left";
  }

  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
    code: selection.hasFormat("code"),
    blockKey,
    blockLabel,
    elementFormat,
    canUndo: defaultToolbar.canUndo,
    canRedo: defaultToolbar.canRedo,
  };
}

function ToolbarIconButton(props: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  spaced?: boolean;
}): React.JSX.Element {
  const { label, onClick, active, disabled, children, spaced } = props;
  return (
    <button
      type="button"
      className={cn("toolbar-item", active && "active", spaced && "spaced")}
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <span className="icon">{children}</span>
    </button>
  );
}

const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [ui, setUi] = useState<ToolbarUi>(defaultToolbar);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const next = $readToolbarState();
          setUi((prev) => ({ ...next, canUndo: prev.canUndo, canRedo: prev.canRedo }));
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setUi((prev) => ({ ...prev, canUndo: payload }));
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setUi((prev) => ({ ...prev, canRedo: payload }));
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const applyBlock = (value: string) => {
    if (value === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      return;
    }
    if (value === "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }
    if (value === "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      return;
    }

    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (value === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }
      if (value === "quote") {
        $setBlocksType(selection, () => $createQuoteNode());
        return;
      }
      if (value === "code") {
        $setBlocksType(selection, () => $createCodeNode());
        return;
      }
      if (value === "h1" || value === "h2" || value === "h3") {
        $setBlocksType(selection, () => $createHeadingNode(value as HeadingTagType));
      }
    });
  };

  const handleLink = () => {
    const url = window.prompt("URL du lien", "https://");
    if (!url) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const align = normalizeAlign(ui.elementFormat);

  return (
    <div className="toolbar" contentEditable={false}>
      <ToolbarIconButton
        label="Annuler"
        disabled={!ui.canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Refaire"
        disabled={!ui.canRedo}
        spaced
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 size={18} strokeWidth={2} />
      </ToolbarIconButton>

      <div className="divider" />

      <label className="toolbar-item toolbar-block-label" title={ui.blockLabel}>
        <span className="text">{ui.blockLabel}</span>
        <select
          className="toolbar-block-select"
          aria-label="Format de bloc"
          value={ui.blockKey}
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => applyBlock(e.target.value)}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="number">Numbered List</option>
          <option value="bullet">Bullet List</option>
          <option value="check">Check List</option>
          <option value="quote">Quote</option>
          <option value="code">Code Block</option>
        </select>
      </label>

      <div className="divider" />

      <ToolbarIconButton label="Gras" active={ui.bold} onClick={() => formatText("bold")}>
        <Bold size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton label="Italique" active={ui.italic} onClick={() => formatText("italic")}>
        <Italic size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Souligne"
        active={ui.underline}
        onClick={() => formatText("underline")}
      >
        <Underline size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Barre"
        active={ui.strikethrough}
        onClick={() => formatText("strikethrough")}
      >
        <Strikethrough size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton label="Code inline" active={ui.code} onClick={() => formatText("code")}>
        <Code size={18} strokeWidth={2} />
      </ToolbarIconButton>

      <div className="divider" />

      <ToolbarIconButton
        label="Retrait gauche"
        onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
      >
        <IndentDecrease size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Retrait droite"
        spaced
        onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
      >
        <IndentIncrease size={18} strokeWidth={2} />
      </ToolbarIconButton>

      <div className="divider" />

      <ToolbarIconButton
        label="Aligner a gauche"
        active={align === "left"}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
      >
        <AlignLeft size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Centrer"
        active={align === "center"}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
      >
        <AlignCenter size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Aligner a droite"
        active={align === "right"}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
      >
        <AlignRight size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Justifier"
        active={align === "justify"}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
      >
        <AlignJustify size={18} strokeWidth={2} />
      </ToolbarIconButton>

      <div className="divider" />

      <ToolbarIconButton label="Lien" onClick={handleLink}>
        <Link size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Supprimer le lien"
        onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
      >
        <Link2Off size={18} strokeWidth={2} />
      </ToolbarIconButton>

      <div className="divider" />

      <ToolbarIconButton
        label="Ligne horizontale"
        onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
      >
        <Minus size={18} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Vider l'éditeur"
        onClick={() => editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)}
      >
        <Trash2 size={18} strokeWidth={2} />
      </ToolbarIconButton>
    </div>
  );
};

type FloatingState = {
  top: number;
  left: number;
  formats: Pick<ToolbarUi, "bold" | "italic" | "underline" | "strikethrough" | "code">;
};

const FLOATING_TOOLBAR_H = 44;
const FLOATING_MARGIN = 8;

const FloatingInlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [floating, setFloating] = useState<FloatingState | null>(null);

  const updateFloating = useCallback(() => {
    editor.getEditorState().read(() => {
      const rootEl = editor.getRootElement();
      if (!rootEl) {
        setFloating(null);
        return;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setFloating(null);
        return;
      }

      const native = window.getSelection();
      if (!native || native.rangeCount === 0) {
        setFloating(null);
        return;
      }

      const anchor = native.anchorNode;
      if (!anchor || !rootEl.contains(anchor)) {
        setFloating(null);
        return;
      }

      const range = native.getRangeAt(0);
      let rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        const rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
        }
      }

      if (rect.width === 0 && rect.height === 0 && !selection.isCollapsed()) {
        setFloating(null);
        return;
      }

      const formats = $readInlineFormats();
      const centerX = rect.left + rect.width / 2;
      let left = centerX;
      left = Math.max(FLOATING_MARGIN, Math.min(left, window.innerWidth - FLOATING_MARGIN));

      const spaceAbove = rect.top;
      const placeAbove = spaceAbove > FLOATING_TOOLBAR_H + FLOATING_MARGIN;
      let top = placeAbove
        ? rect.top - FLOATING_TOOLBAR_H - FLOATING_MARGIN
        : rect.bottom + FLOATING_MARGIN;

      top = Math.max(
        FLOATING_MARGIN,
        Math.min(top, window.innerHeight - FLOATING_TOOLBAR_H - FLOATING_MARGIN)
      );

      setFloating({
        top,
        left,
        formats,
      });
    });
  }, [editor]);

  useEffect(() => {
    const run = () => requestAnimationFrame(updateFloating);

    return mergeRegister(
      editor.registerUpdateListener(() => {
        run();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          run();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateFloating]);

  useEffect(() => {
    const run = () => requestAnimationFrame(updateFloating);
    const scrollerRef = { current: null as Element | null };

    const unregisterRoot = editor.registerRootListener((rootElement) => {
      scrollerRef.current?.removeEventListener("scroll", run);
      scrollerRef.current = rootElement?.closest(".editor-scroller") ?? null;
      scrollerRef.current?.addEventListener("scroll", run, { passive: true });
    });

    window.addEventListener("resize", run);
    window.addEventListener("scroll", run, true);
    document.addEventListener("selectionchange", run);

    return () => {
      unregisterRoot();
      scrollerRef.current?.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      window.removeEventListener("scroll", run, true);
      document.removeEventListener("selectionchange", run);
    };
  }, [editor, updateFloating]);

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleLink = () => {
    const url = window.prompt("URL du lien", "https://");
    if (!url) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  if (!floating) return null;

  const f = floating.formats;

  return (
    <div
      className="ce-rich-text-floating-toolbar"
      role="toolbar"
      aria-label="Mise en forme"
      style={{
        position: "fixed",
        top: floating.top,
        left: floating.left,
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
    >
      <ToolbarIconButton label="Gras" active={f.bold} onClick={() => formatText("bold")}>
        <Bold size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton label="Italique" active={f.italic} onClick={() => formatText("italic")}>
        <Italic size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Souligne"
        active={f.underline}
        onClick={() => formatText("underline")}
      >
        <Underline size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Barre"
        active={f.strikethrough}
        onClick={() => formatText("strikethrough")}
      >
        <Strikethrough size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton label="Code inline" active={f.code} onClick={() => formatText("code")}>
        <Code size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <span className="ce-rich-text-floating-divider" />
      <ToolbarIconButton label="Lien" onClick={handleLink}>
        <Link size={16} strokeWidth={2} />
      </ToolbarIconButton>
      <ToolbarIconButton
        label="Supprimer le lien"
        onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
      >
        <Link2Off size={16} strokeWidth={2} />
      </ToolbarIconButton>
    </div>
  );
};

const InitialHtmlPlugin: FC<{ html: string }> = ({ html }) => {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    editor.update(() => {
      if (!html) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, html]);

  return null;
};

const Placeholder: FC = () => (
  <div className="editor-placeholder">Saisissez du texte...</div>
);

const EditorFocusPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;
    requestAnimationFrame(() => root.focus());
  }, [editor]);

  return null;
};

export type RichTextEditorShellProps = {
  nodeId: string;
  html: string;
  onHtmlChange: (html: string) => void;
  className?: string;
  /** Barre flottante sur sélection de texte ; désactivée en modale (toolbar fixe déjà présente). */
  showFloatingToolbar?: boolean;
};

export const RichTextEditorShell: FC<RichTextEditorShellProps> = ({
  nodeId,
  html,
  onHtmlChange,
  className,
  showFloatingToolbar = true,
}) => {
  const initialConfig = useMemo(() => createRichTextLexicalConfig(nodeId), [nodeId]);

  return (
    <div className={cn("ce-rich-text ce-rich-text-pg editor-shell", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <InitialHtmlPlugin html={html} />
          <ToolbarPlugin />
          {showFloatingToolbar ? <FloatingInlineToolbarPlugin /> : null}
          <EditorFocusPlugin />
          <div className="editor-scroller">
            <div className="editor">
              <RichTextPlugin
                contentEditable={<ContentEditable className="ContentEditable__root" />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
          </div>
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin
          matchers={[
            (text: string) => {
              const match = text.match(/https?:\/\/[^\s]+/);
              if (!match) return null;
              return {
                index: match.index ?? 0,
                length: match[0].length,
                text: match[0],
                url: match[0],
                attributes: { rel: "noreferrer", target: "_blank" },
              };
            },
          ]}
        />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <TabIndentationPlugin />
        <HorizontalRulePlugin />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            editorState.read(() => {
              onHtmlChange($generateHtmlFromNodes(editor, null));
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditorShell;
