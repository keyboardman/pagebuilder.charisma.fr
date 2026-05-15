import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";

export function createRichTextLexicalConfig(nodeId: string): InitialConfigType {
  return {
    namespace: `node-rich-text-${nodeId}`,
    nodes: [HeadingNode, QuoteNode, CodeNode, LinkNode, AutoLinkNode, ListNode, ListItemNode, HorizontalRuleNode],
    theme: {
      paragraph: "ce-rich-text-paragraph",
      quote: "ce-rich-text-quote",
      text: {
        bold: "ce-rich-text-bold",
        italic: "ce-rich-text-italic",
        underline: "ce-rich-text-underline",
        strikethrough: "ce-rich-text-strikethrough",
        code: "ce-rich-text-code",
      },
      list: {
        ul: "ce-rich-text-list-ul",
        ol: "ce-rich-text-list-ol",
        listitem: "ce-rich-text-listitem",
        listitemChecked: "ce-rich-text-listitem-checked",
        listitemUnchecked: "ce-rich-text-listitem-unchecked",
        nested: {
          listitem: "ce-rich-text-nested-listitem",
        },
      },
    },
    onError(error: Error) {
      throw error;
    },
  };
}
