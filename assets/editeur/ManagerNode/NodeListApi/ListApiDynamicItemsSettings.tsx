import { type FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/editeur/components/ui/button";
import { Database, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import type { NodeListApiDynamicEntry } from "./index";
import { fetchDynamicListItemsCached, fetchDynamicListSources } from "./listApiUtils";
import { ListApiItemPickerModal } from "./ListApiItemPickerModal";

function moveIndex<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

interface ListApiDynamicItemsSettingsProps {
  items: NodeListApiDynamicEntry[];
  onChange: (items: NodeListApiDynamicEntry[]) => void;
}

export const ListApiDynamicItemsSettings: FC<ListApiDynamicItemsSettingsProps> = ({ items, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewByKey, setPreviewByKey] = useState<Record<string, string>>({});
  const [sourceLabels, setSourceLabels] = useState<Record<string, string>>({});

  const itemKeys = useMemo(
    () => items.map((entry) => `${entry.type}:${entry.id}`),
    [items]
  );

  useEffect(() => {
    let cancelled = false;

    const loadSources = async () => {
      try {
        const sources = await fetchDynamicListSources();
        if (cancelled) return;

        const next: Record<string, string> = {};
        sources.forEach((source) => {
          next[source.id] = source.label;
        });
        setSourceLabels(next);
      } catch {
        if (!cancelled) {
          setSourceLabels({});
        }
      }
    };

    void loadSources();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (items.length === 0) {
        setPreviewByKey({});
        return;
      }

      try {
        const resolved = await fetchDynamicListItemsCached(items);
        if (cancelled) return;

        const next: Record<string, string> = {};
        resolved.forEach((item, index) => {
          const entry = items[index];
          if (!entry) return;
          next[`${entry.type}:${entry.id}`] = item.title?.trim() || item.id;
        });
        setPreviewByKey(next);
      } catch {
        if (!cancelled) {
          setPreviewByKey({});
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleAddItem = (listApiId: string, itemId: string) => {
    if (!listApiId || !itemId) return;

    const exists = items.some((entry) => entry.type === listApiId && entry.id === itemId);
    if (exists) return;

    onChange([...items, { id: itemId, type: listApiId }]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="node-block-title m-0 font-medium text-foreground text-xs">Items sélectionnés</p>
        <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(true)}>
          <Database className="mr-2 h-4 w-4" />
          Ajouter un item
        </Button>
      </div>

      <ListApiItemPickerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={(listApiId, item) => handleAddItem(listApiId, item.id)}
      />

      {items.length === 0 ? (
        <p className="text-[0.7rem] text-muted-foreground px-1">
          Aucun item. Ajoutez des éléments depuis une ou plusieurs listes API.
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((entry, index) => {
            const key = itemKeys[index] ?? `${entry.type}:${entry.id}`;
            const sourceLabel = sourceLabels[entry.type] ?? entry.type;
            const title = previewByKey[key] ?? entry.id;

            return (
              <li
                key={key}
                draggable
                onDragStart={() => {
                  setDraggingIndex(index);
                  setDragOverIndex(index);
                }}
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
                onDragEnd={() => {
                  setDraggingIndex(null);
                  setDragOverIndex(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded border border-border/60 bg-background px-2 py-1.5",
                  dragOverIndex === index && draggingIndex !== null ? "ring-2 ring-primary/30" : ""
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{title}</p>
                  <p className="truncate text-[0.65rem] text-muted-foreground">{sourceLabel}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => handleRemove(index)}
                  aria-label="Supprimer l'item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[0.65rem] text-muted-foreground px-1">
        Glissez-déposez pour réordonner. Les articles peuvent provenir de sources ApiListArticleDynamique différentes.
      </p>
    </div>
  );
};

export default ListApiDynamicItemsSettings;
