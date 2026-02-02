import { GripVertical, Trash2, Copy } from "lucide-react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { Button } from "@editeur/components/ui/button";
import { cn } from "@editeur/lib/utils";

export default function NodeMenu() {
    const { node, onSelect, drag, onDelete, onDuplicate, isSelected } = useNodeBuilderContext();

    return (
        <div 
            className={cn(
                "flex w-full items-center gap-2 rounded-t-md border-b px-2 text-sm transition-colors",
                isSelected() 
                    ? "bg-accent text-accent-foreground border-primary/20" 
                    : "bg-muted/50 text-muted-foreground border-border/30"
            )}
        >
            <Button
                ref={drag.handleRef}
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-grab active:cursor-grabbing p-0"
                aria-label="Déplacer le bloc"
            >
                <GripVertical className="h-4 w-4" />
            </Button>
            <div 
                className="flex flex-1 items-center px-2 py-1 cursor-pointer rounded-sm hover:bg-accent/50 transition-colors"
                onClick={(e) => { 
                    e.stopPropagation();
                    onSelect();
                }}
            >
                <span className="text-xs font-medium uppercase tracking-wide">{node.type}</span>
            </div>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                }}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                aria-label="Dupliquer le bloc"
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
                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Supprimer le bloc"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}