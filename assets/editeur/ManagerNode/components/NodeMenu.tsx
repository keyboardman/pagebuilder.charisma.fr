import { GripVertical, Trash2, Copy, Pencil } from "lucide-react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { Button } from "@/editeur/components/ui/button";
import { cn } from "@/editeur/lib/utils";
import { NODE_RICH_TEXT_TYPE } from "../NodeRichText";
import { useNodeRichTextEditorSafe } from "../NodeRichText/NodeRichTextEditorContext";
import {
  getNodeDisplayLabel,
  getNodeTypeLabel,
  hasCustomNodeLabel,
} from "../../utils/nodeLabel";

export default function NodeMenu() {
  const { node, drag, onDuplicate, onSelect, onDelete } = useNodeBuilderContext();
  const richTextEditor = useNodeRichTextEditorSafe();
  const isRichText = node.type === NODE_RICH_TEXT_TYPE;
  const title = hasCustomNodeLabel(node) ? getNodeDisplayLabel(node) : getNodeTypeLabel(node);
  const typeLabel = getNodeTypeLabel(node);
  const showTypeHint = hasCustomNodeLabel(node);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      className={cn(
        "absolute bottom-full left-0 z-20 mb-0.5 flex min-w-24 items-center gap-1 rounded-md border border-primary/20 bg-accent px-1 text-sm text-accent-foreground shadow-md transition-colors"
      )}
      onClick={handleClick}
    >
      <Button
        ref={drag.handleRef}
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0 cursor-grab p-0 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <div
        className="flex max-w-[8rem] min-w-0 cursor-pointer flex-col items-center overflow-hidden rounded-sm px-1 py-0 text-center hover:bg-accent/50"
        title={showTypeHint ? typeLabel : undefined}
      >
        <span
          className={cn(
            "truncate text-xs font-medium tracking-wide",
            !showTypeHint && "uppercase"
          )}
        >
          {title}
        </span>
        {showTypeHint ? (
          <span className="truncate text-[10px] normal-case text-muted-foreground" >
            {typeLabel}
          </span>
        ) : null}
      </div>
      {isRichText && richTextEditor ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            richTextEditor.openEditor(node.id);
          }}
          variant="ghost"
          size="icon"
          className="h-4 w-4 shrink-0"
          title="Modifier le texte"
          aria-label="Modifier le texte"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : null}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
