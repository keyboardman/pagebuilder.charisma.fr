import { type FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/editeur/components/ui/button";
import { Database, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import type { CollectionArticleDynamicEntry } from "../index";
import {
  fetchCollectionCatalog,
  resolveCollectionEntries,
} from "../collectionApiUtils";
import { CollectionArticleItemPickerModal } from "./CollectionArticleItemPickerModal";

function moveIndex<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

interface CollectionArticleDynamicItemsSettingsProps {
  items: CollectionArticleDynamicEntry[];
  onChange: (items: CollectionArticleDynamicEntry[]) => void;
}

export const CollectionArticleDynamicItemsSettings: FC<CollectionArticleDynamicItemsSettingsProps> = ({
  items,
  onChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewByKey, setPreviewByKey] = useState<Record<string, { title: string; image?: string }>>({});
  const [sourceLabels, setSourceLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadSources = async () => {
      try {
        const sources = await fetchCollectionCatalog("article", "dynamic", { bypassCache: true });
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
        const resolved = await resolveCollectionEntries(
          items.map((entry) => ({ apiId: entry.type, itemId: entry.id }))
        );
        if (cancelled) return;

        const byId = new Map(resolved.map((item) => [item.id, item]));
        const next: Record<string, { title: string; image?: string }> = {};
        items.forEach((entry) => {
          const item = byId.get(entry.id);
          next[`${entry.type}:${entry.id}`] = {
            title: item?.title?.trim() || entry.id,
            image: item?.image,
          };
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

  const itemKeys = useMemo(
    () => items.map((entry) => `${entry.type}:${entry.id}`),
    [items]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="node-block-title m-0 font-medium text-foreground text-xs">Items sélectionnés</p>
        <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(true)}>
          <Database className="mr-2 h-4 w-4" />
          Ajouter un item
        </Button>
      </div>

      <CollectionArticleItemPickerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={(listApiId, item) => handleAddItem(listApiId, item.id)}
      />

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aucun article sélectionné.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((entry, index) => {
            const key = itemKeys[index];
            const sourceLabel = sourceLabels[entry.type] ?? entry.type;
            const preview = previewByKey[key];
            const title = preview?.title ?? entry.id;
            const image = preview?.image;
            const isDragging = draggingIndex === index;
            const isDragOver = dragOverIndex === index && draggingIndex !== null && draggingIndex !== index;

            return (
              <li
                key={key}
                draggable
                onDragStart={() => setDraggingIndex(index)}
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
                  "flex items-center gap-1.5 rounded border border-border px-1.5 py-1 text-xs",
                  isDragging && "opacity-50",
                  isDragOver && "border-primary bg-accent/40"
                )}
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground" />
                {image ? (
                  <img
                    src={image}
                    alt=""
                    className="shrink-0 rounded object-cover bg-muted"
                    style={{ width: 28, height: 28, flexShrink: 0 }}
                    loading="lazy"
                  />
                ) : null}
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-muted-foreground">{sourceLabel}</span>
                  {" — "}
                  {title}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
