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
  const { node, isSelected } = useNodeBuilderContext();
  const title = getNodeDisplayLabel(node);
  const typeLabel = getNodeTypeLabel(node);
  const showTypeHint = hasCustomNodeLabel(node);

  if (isSelected()) {
    return (
      <NodeMenuActive
        title={title}
        typeLabel={typeLabel}
        showTypeHint={showTypeHint}
      />
    );
  }

  return (
    <NodeMenuInactive
      title={title}
      typeLabel={typeLabel}
      showTypeHint={showTypeHint}
    />
  );
}

const NodeMenuWrapper = ({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 rounded-t-md border-b px-1 text-sm transition-colors",
        selected
          ? "bg-accent text-accent-foreground border-primary/20"
          : "bg-muted/50 text-muted-foreground border-border/30"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const NodeMenuTitle = ({
  title,
  typeLabel,
  showTypeHint,
}: {
  title: string;
  typeLabel: string;
  showTypeHint: boolean;
}) => {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center overflow-hidden px-1 py-0 cursor-pointer rounded-sm hover:bg-accent/50 text-center"
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
        <span className="truncate text-[10px] text-muted-foreground normal-case">
          {typeLabel}
        </span>
      ) : null}
    </div>
  );
};

const NodeMenuInactive = ({
  title,
  typeLabel,
  showTypeHint,
}: {
  title: string;
  typeLabel: string;
  showTypeHint: boolean;
}) => {
  const { onSelect, drag } = useNodeBuilderContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <NodeMenuWrapper selected={false} onClick={handleClick}>
      <Button
        ref={drag.handleRef}
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing p-0"
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <NodeMenuTitle
        title={title}
        typeLabel={typeLabel}
        showTypeHint={showTypeHint}
      />
    </NodeMenuWrapper>
  );
};

const NodeMenuActive = ({
  title,
  typeLabel,
  showTypeHint,
}: {
  title: string;
  typeLabel: string;
  showTypeHint: boolean;
}) => {
  const { node, drag, onDuplicate, onSelect, onDelete } = useNodeBuilderContext();
  const richTextEditor = useNodeRichTextEditorSafe();
  const isRichText = node.type === NODE_RICH_TEXT_TYPE;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <NodeMenuWrapper selected={true} onClick={handleClick}>
      <Button
        ref={drag.handleRef}
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing p-0"
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <NodeMenuTitle
        title={title}
        typeLabel={typeLabel}
        showTypeHint={showTypeHint}
      />
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
        className="h-4 w-4 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </NodeMenuWrapper>
  );
};
