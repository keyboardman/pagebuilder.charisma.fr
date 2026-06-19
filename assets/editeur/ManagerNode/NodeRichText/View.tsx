import React, { type FC, useCallback, useContext, useEffect } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { NodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeRichTextType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { NodeRichTextEditorModal } from "./NodeRichTextEditorModal";
import { useNodeRichTextEditorSafe } from "./NodeRichTextEditorContext";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useContext(NodeBuilderContext);
  const richTextEditor = useNodeRichTextEditorSafe();
  const richTextNode = node as NodeRichTextType;
  const html = richTextNode.content?.html ?? "";
  const isEdit = mode === APP_MODE.EDIT;
  const selected = isEdit && builder?.isSelected() === true && richTextEditor !== null;
  const modalOpen = selected && richTextEditor!.isEditorOpen(node.id);

  useEffect(() => {
    if (selected && richTextEditor) {
      richTextEditor.openEditor(node.id);
    }
  }, [selected, node.id, richTextEditor]);

  const handleHtmlChange = useCallback(
    (nextHtml: string) => {
      if (!builder) return;
      builder.onChange({
        ...node,
        content: {
          ...node.content,
          html: nextHtml,
        },
      });
    },
    [builder, node]
  );

  return (
    <>
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={node?.attributes?.id ?? ""}
        className={cn("ce-rich-text ce-rich-text-pg", node?.attributes?.className ?? "")}
        style={styleForView(node?.attributes?.style ?? {})}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {selected && richTextEditor ? (
        <NodeRichTextEditorModal
          open={modalOpen}
          onOpenChange={(open) => {
            if (open) {
              richTextEditor.openEditor(node.id);
            } else {
              richTextEditor.closeEditor();
            }
          }}
          nodeId={node.id}
          html={html}
          onHtmlChange={handleHtmlChange}
        />
      ) : null}
    </>
  );
};

export default View;
