import { GripVertical, Trash2, Copy } from "lucide-react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { Button } from "@/editeur/components/ui/button";
import { cn } from "@/editeur/lib/utils";

export default function NodeMenu() {
    const { node, isSelected } = useNodeBuilderContext();

    const title = node.type.replace(/^node-/, "");

    const _selected = isSelected();


    if (_selected) {
        return <NodeMenuActive title={title} />;
    } else {
        return <NodeMenuInactive title={title} />;
    }
}


const NodeMenuWrapper = ({ children, selected, onClick }: { children: React.ReactNode, selected: boolean, onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) => {

    return (
        <div className={cn(
            "flex w-full items-center gap-1 rounded-t-md border-b px-1 text-sm transition-colors",
            selected
                ? "bg-accent text-accent-foreground border-primary/20"
                : "bg-muted/50 text-muted-foreground border-border/30"
        )} onClick={onClick}>
            {children}
        </div>
    );
}

const NodeMenuTitle = ({ title }: { title: string }) => {

    return (
        <div className="flex-1 min-w-0 overflow-hidden px-1 py-0 cursor-pointer rounded-sm hover:bg-accent/50 text-center" >
            <span className="truncate text-xs font-medium uppercase tracking-wide ">
                {title}
            </span>
        </div>
    );
}


const NodeMenuInactive = ({ title }: { title: string }) => {

    const { onSelect, drag } = useNodeBuilderContext();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect();
    }

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
            <NodeMenuTitle title={title} />
        </NodeMenuWrapper>
    );
}

const NodeMenuActive = ({ title }: { title: string }) => {

    const { drag, onDuplicate, onSelect, onDelete } = useNodeBuilderContext();


    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect();
    }

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
            <NodeMenuTitle title={title}  />
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
}


