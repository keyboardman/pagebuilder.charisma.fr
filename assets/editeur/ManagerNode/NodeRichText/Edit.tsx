import React, { type FC, useCallback, useEffect } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeRichTextType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { NodeRichTextEditorModal } from "./NodeRichTextEditorModal";
import { useNodeRichTextEditor } from "./NodeRichTextEditorContext";

const Edit: FC<NodeEditProps> = () => {
  const { node, onChange, isSelected } = useNodeBuilderContext();
  const { openEditor, closeEditor, isEditorOpen } = useNodeRichTextEditor();
  const richTextNode = node as NodeRichTextType;
  const html = richTextNode.content?.html ?? "";
  const selected = isSelected();
  const modalOpen = selected && isEditorOpen(node.id);

  useEffect(() => {
    if (selected) {
      openEditor(node.id);
    }
  }, [selected, node.id, openEditor]);

  const viewStyle = styleForView(node?.attributes?.style ?? {});

  const handleHtmlChange = useCallback(
    (nextHtml: string) => {
      onChange({
        ...node,
        content: {
          ...node.content,
          html: nextHtml,
        },
      });
    },
    [node, onChange]
  );

  return (
    <>
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={node?.attributes?.id ?? ""}
        className={cn("ce-rich-text ce-rich-text-pg", node?.attributes?.className ?? "")}
        style={viewStyle}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {selected ? (
        <NodeRichTextEditorModal
          open={modalOpen}
          onOpenChange={(open) => {
            if (open) {
              openEditor(node.id);
            } else {
              closeEditor();
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

export default Edit;
