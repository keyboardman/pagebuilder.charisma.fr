import React, { type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/editeur/components/ui/dialog";
import { RichTextEditorShell } from "./RichTextEditorShell";

export type NodeRichTextEditorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  html: string;
  onHtmlChange: (html: string) => void;
};

export const NodeRichTextEditorModal: FC<NodeRichTextEditorModalProps> = ({
  open,
  onOpenChange,
  nodeId,
  html,
  onHtmlChange,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="ce-rich-text-modal-content flex max-h-[85vh] w-[90vw] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-lg">
      <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
        <DialogTitle>Modifier le texte riche</DialogTitle>
      </DialogHeader>
      {open ? (
        <RichTextEditorShell
          key={nodeId}
          nodeId={nodeId}
          html={html}
          onHtmlChange={onHtmlChange}
          className="ce-rich-text-modal editor-shell"
        />
      ) : null}
    </DialogContent>
  </Dialog>
);

export default NodeRichTextEditorModal;
