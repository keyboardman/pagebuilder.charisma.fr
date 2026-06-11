import { useState, useEffect, useCallback } from "react";
import Form from "../components/form";
import { Button } from "@/editeur/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/editeur/components/ui/dialog";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/editeur/lib/utils";
import { fetchFonts, type FontPayload } from "./backendFontAdapter";
import { getThemeFontIds } from "./FontUsageRegistry";
import { loadFontForPreview } from "../services/typography";

const PREVIEW_SAMPLE = "Aa Bb Cc — 123";

interface ManagerFontModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiBaseUrl: string;
  onSelect: (font: FontPayload) => void;
}

const TYPE_OPTIONS = [
  { label: "Tous les types", value: "" },
  { label: "Google", value: "google" },
  { label: "Custom", value: "custom" },
];

export function ManagerFontModal({
  open,
  onOpenChange,
  apiBaseUrl,
  onSelect,
}: ManagerFontModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [items, setItems] = useState<FontPayload[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFonts(apiBaseUrl, {
          page,
          limit,
          search: searchTerm.trim() || undefined,
          type: typeFilter || undefined,
          excludeNative: true,
          excludeIds: getThemeFontIds(),
        });
        if (cancelled) return;
        setItems(result.items ?? []);
        setTotal(result.total ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
        setItems([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (searchTerm.trim()) {
      timeoutId = setTimeout(load, 300);
    } else {
      void load();
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, apiBaseUrl, page, limit, searchTerm, typeFilter]);

  useEffect(() => {
    if (!open || items.length === 0) return;
    items.forEach((font) => loadFontForPreview(font));
  }, [open, items]);

  useEffect(() => {
    if (open) {
      setPage(1);
      setSearchTerm("");
      setTypeFilter("");
      setSelectedId(null);
      setError(null);
    }
  }, [open]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleConfirm = useCallback(() => {
    const font = items.find((item) => item.id === selectedId);
    if (!font) return;
    onSelect(font);
    onOpenChange(false);
  }, [items, selectedId, onSelect, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col gap-3">
        <DialogHeader>
          <DialogTitle>Choisir une police</DialogTitle>
          <DialogDescription>
            Polices Google et custom hors thème (les natives et celles du thème sont déjà disponibles dans le sélecteur).
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Form.Input
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setPage(1);
              }}
              placeholder="Rechercher une police…"
              className="pl-8 h-9"
            />
          </div>
          <Form.Select
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
            options={TYPE_OPTIONS}
            className="h-9 w-36"
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto border rounded-md">
          {loading && (
            <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement…
            </div>
          )}
          {!loading && error && (
            <p className="p-4 text-sm text-destructive">{error}</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Aucune police trouvée.</p>
          )}
          {!loading && !error && items.length > 0 && (
            <ul className="divide-y">
              {items.map((font) => (
                <li key={font.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(font.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-muted/60 transition-colors",
                      selectedId === font.id && "bg-muted"
                    )}
                  >
                    <span
                      className="text-lg leading-tight block truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.name}
                    </span>
                    <span
                      className="text-base text-foreground/80 block mt-0.5 truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {PREVIEW_SAMPLE}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize mt-1 block">
                      {font.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" disabled={selectedId === null} onClick={handleConfirm}>
            Sélectionner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
