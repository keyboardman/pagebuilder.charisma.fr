import { type FC, useMemo, useState } from "react";
import shortid from "shortid";
import { Button } from "@/editeur/components/ui/button";
import { FolderOpen, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import { useAppContext } from "../../services/providers/AppContext";
import { FileManagerIframePicker } from "../../ManagerAsset/FileManagerIframePicker";
import type { FileItem } from "../../ManagerAsset/types";
import type { NodeListImageMediaEntry } from "./index";
import { LIST_IMAGE_MEDIA_TYPE } from "./listImageApiUtils";

function moveIndex<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

interface ListImageDynamicItemsSettingsProps {
  items: NodeListImageMediaEntry[];
  onChange: (items: NodeListImageMediaEntry[]) => void;
}

export const ListImageDynamicItemsSettings: FC<ListImageDynamicItemsSettingsProps> = ({ items, onChange }) => {
  const { fileManagerConfig } = useAppContext();
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const itemKeys = useMemo(
    () => items.map((entry) => `${entry.type}:${entry.id}:${entry.src}`),
    [items]
  );

  const handleAddMediaItem = (file: FileItem) => {
    const src = file.url?.trim();
    if (!src) return;

    onChange([
      ...items,
      {
        id: shortid.generate(),
        type: LIST_IMAGE_MEDIA_TYPE,
        src,
        alt: "",
        link: "",
      },
    ]);
    setMediaModalOpen(false);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="node-block-title m-0 font-medium text-foreground text-xs">Images sélectionnées</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMediaModalOpen(true)}
          disabled={!fileManagerConfig?.filemanagerUrl}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Médiathèque
        </Button>
      </div>

      <FileManagerIframePicker
        open={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        onSelectFile={handleAddMediaItem}
        filemanagerUrl={fileManagerConfig?.filemanagerUrl ?? ""}
        type="image"
      />

      {items.length === 0 ? (
        <p className="px-1 text-[0.7rem] text-muted-foreground">
          Aucune image. Ajoutez des éléments depuis la médiathèque.
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((entry, index) => {
            const key = itemKeys[index] ?? `${entry.type}:${entry.id}`;

            return (
              <li
                key={key}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingIndex == null || draggingIndex === index) return;
                  onChange(moveIndex(items, draggingIndex, index));
                  setDraggingIndex(null);
                  setDragOverIndex(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded border border-border/60 bg-background px-2 py-1.5",
                  dragOverIndex === index && draggingIndex !== null ? "ring-2 ring-primary/30" : ""
                )}
              >
                <span
                  draggable
                  onDragStart={() => {
                    setDraggingIndex(index);
                    setDragOverIndex(index);
                  }}
                  onDragEnd={() => {
                    setDraggingIndex(null);
                    setDragOverIndex(null);
                  }}
                  className="flex shrink-0 cursor-grab items-center active:cursor-grabbing"
                  aria-label="Réordonner l'image"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </span>
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded">
                  <img
                    src={entry.src}
                    alt={entry.alt ?? ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{entry.src}</p>
                  <p className="truncate text-[0.65rem] text-muted-foreground">Médiathèque</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative z-10 h-7 w-7 shrink-0"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemove(index);
                  }}
                  aria-label="Supprimer l'image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="px-1 text-[0.65rem] text-muted-foreground">
        Glissez-déposez pour réordonner les images de la médiathèque.
      </p>
    </div>
  );
};

export default ListImageDynamicItemsSettings;
