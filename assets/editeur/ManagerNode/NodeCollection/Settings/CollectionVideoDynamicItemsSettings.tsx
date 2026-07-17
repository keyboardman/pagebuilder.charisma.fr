import { type FC, useEffect, useState } from "react";
import { Button } from "@/editeur/components/ui/button";
import { Database, Trash2 } from "lucide-react";
import type { CollectionVideoDynamicEntry } from "../index";
import { fetchCollectionCatalog } from "../collectionApiUtils";
import { CollectionItemPickerModal } from "./CollectionItemPickerModal";

interface CollectionVideoDynamicItemsSettingsProps {
  items: CollectionVideoDynamicEntry[];
  onChange: (items: CollectionVideoDynamicEntry[]) => void;
}

export const CollectionVideoDynamicItemsSettings: FC<CollectionVideoDynamicItemsSettingsProps> = ({
  items,
  onChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceLabels, setSourceLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadSources = async () => {
      try {
        const sources = await fetchCollectionCatalog("video", "dynamic", { bypassCache: true });
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

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setModalOpen(true)}>
        <Database className="mr-2 h-4 w-4" />
        Ajouter une vidéo
      </Button>

      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((entry, index) => {
            const label = sourceLabels[entry.apiId] ?? entry.apiId;
            const displayTitle = entry.title?.trim() || entry.itemId;
            return (
              <li
                key={`${entry.apiId}:${entry.itemId}`}
                className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1 text-xs"
              >
                <span className="truncate">
                  {label} — {displayTitle}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Aucune vidéo sélectionnée.</p>
      )}

      <CollectionItemPickerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        collectionType="video"
        mode="dynamic"
        onSelect={(apiId, item) => {
          const exists = items.some((entry) => entry.apiId === apiId && entry.itemId === item.id);
          if (!exists) {
            onChange([
              ...items,
              { apiId, itemId: item.id, title: item.title?.trim() || undefined },
            ]);
          }
        }}
      />
    </div>
  );
};
