import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "../../../components/form";
import { Button } from "@/editeur/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/editeur/components/ui/dialog";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import {
  fetchCollectionCatalog,
  fetchCollectionItemsPage,
  type CollectionApiMappedItem,
} from "../collectionApiUtils";
import type { CollectionType } from "../index";

type CatalogMode = "dynamic" | "fixed";

interface CollectionItemPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sourceId: string, item: CollectionApiMappedItem) => void;
  collectionType?: Extract<CollectionType, "article" | "video">;
  mode?: CatalogMode;
  /** Pré-sélection optionnelle (réouverture sur la source courante). */
  initialSourceId?: string;
  initialItemId?: string;
}

const COPY: Record<
  Extract<CollectionType, "article" | "video">,
  { title: string; description: string; emptySources: string; emptyItems: string; searchPlaceholder: string }
> = {
  article: {
    title: "Sélectionner un article",
    description: "Choisissez une API collection puis un article à ajouter.",
    emptySources: "Aucune source disponible.",
    emptyItems: "Aucun article trouvé.",
    searchPlaceholder: "Rechercher un article…",
  },
  video: {
    title: "Sélectionner une vidéo",
    description: "Choisissez une API collection puis une vidéo.",
    emptySources: "Aucune source vidéo disponible.",
    emptyItems: "Aucune vidéo trouvée.",
    searchPlaceholder: "Rechercher une vidéo…",
  },
};

export function CollectionItemPickerModal({
  open,
  onOpenChange,
  onSelect,
  collectionType = "article",
  mode = "dynamic",
  initialSourceId = "",
  initialItemId = "",
}: CollectionItemPickerModalProps) {
  const copy = COPY[collectionType];
  const [listSources, setListSources] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [items, setItems] = useState<CollectionApiMappedItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadSources = async () => {
      try {
        const sources = await fetchCollectionCatalog(collectionType, mode, { bypassCache: true });
        if (!cancelled) {
          setListSources(sources.map((s) => ({ id: s.id, label: s.label })));
          if (initialSourceId && sources.some((s) => s.id === initialSourceId)) {
            setSelectedSourceId(initialSourceId);
          }
        }
      } catch {
        if (!cancelled) {
          setListSources([]);
        }
      }
    };

    void loadSources();

    return () => {
      cancelled = true;
    };
  }, [open, collectionType, mode, initialSourceId]);

  useEffect(() => {
    if (!open) {
      setSelectedSourceId("");
      setItems([]);
      setPage(1);
      setTotalPages(0);
      setSearchTerm("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !selectedSourceId) {
      setItems([]);
      setTotalPages(0);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchCollectionItemsPage(
          selectedSourceId,
          page,
          20,
          searchTerm.trim() || undefined
        );
        if (cancelled) return;

        setItems(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des items");
        setItems([]);
        setTotalPages(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (searchTerm) {
      timeoutId = setTimeout(() => void loadItems(), 300);
    } else {
      void loadItems();
    }

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [open, selectedSourceId, page, searchTerm]);

  const listOptions = useMemo(
    () =>
      listSources.map((source) => ({
        value: source.id,
        label: source.label,
      })),
    [listSources]
  );

  const selectedSource = useMemo(
    () => listSources.find((source) => source.id === selectedSourceId) ?? null,
    [listSources, selectedSourceId]
  );

  const handleItemSelect = useCallback(
    (item: CollectionApiMappedItem) => {
      if (!selectedSourceId) return;
      onSelect(selectedSourceId, item);
      onOpenChange(false);
    },
    [onSelect, onOpenChange, selectedSourceId]
  );

  const hasPrevious = page > 1;
  const hasNext = totalPages > 0 && page < totalPages;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="api-manager-ui flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="node-block-title">{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          {listOptions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{copy.emptySources}</p>
          ) : (
            <>
              <Form.Group>
                <Form.Label text="Source" />
                <Form.Select
                  value={selectedSourceId}
                  onChange={(value) => {
                    setSelectedSourceId(value);
                    setPage(1);
                    setSearchTerm("");
                  }}
                  options={listOptions}
                  placeholder="Choisir une source…"
                />
              </Form.Group>

              {selectedSource ? (
                <p className="text-xs text-muted-foreground">
                  Source : <span className="font-medium text-foreground">{selectedSource.label}</span>
                </p>
              ) : null}

              {selectedSourceId ? (
                <Form.Group>
                  <Form.Label text="Rechercher" />
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Form.Input
                      type="text"
                      value={searchTerm}
                      onChange={(value) => {
                        setSearchTerm(value);
                        setPage(1);
                      }}
                      placeholder={copy.searchPlaceholder}
                      className="pl-8"
                    />
                  </div>
                </Form.Group>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : null}

              {!loading && !error && selectedSourceId && items.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">{copy.emptyItems}</p>
              ) : null}

              {!loading && !error && items.length > 0 ? (
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemSelect(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors",
                          "hover:border-primary/50 hover:bg-accent/50",
                          initialItemId && item.id === initialItemId && "border-primary bg-accent/30"
                        )}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.alt || item.title || ""}
                            className="collection-picker-thumb shrink-0 rounded object-cover bg-muted"
                            style={{ width: 48, height: 48, flexShrink: 0 }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="flex shrink-0 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground"
                            style={{ width: 48, height: 48, flexShrink: 0 }}
                          >
                            —
                          </div>
                        )}
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.title || "Sans titre"}
                          </p>
                          {item.description ? (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>

                  {totalPages > 1 ? (
                    <div className="flex items-center justify-between gap-2 border-t pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={!hasPrevious || loading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} sur {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={!hasNext || loading}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
