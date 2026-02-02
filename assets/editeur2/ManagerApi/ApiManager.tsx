import { useState, useEffect, useCallback } from "react";
import { apiRegistry } from "./ApiRegistry";
import Form from "../components/form";
import { Button } from "@editeur/components/ui/button";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@editeur/lib/utils";

interface MappedItemData {
  id: string;
  title: string;
  description?: string;
  image?: string;
  raw: unknown;
}

interface ApiManagerProps {
  apiId?: string;
  itemId?: string;
  onSelect: (apiId: string, itemId: string, mappedData: MappedItemData) => void;
}

export function ApiManager({ apiId: initialApiId, itemId: initialItemId, onSelect }: ApiManagerProps) {
  const [selectedApiId, setSelectedApiId] = useState<string>(initialApiId || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [items, setItems] = useState<unknown[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || "");

  const adapters = apiRegistry.list();

  // Charger les items quand l'API change ou la recherche change
  useEffect(() => {
    if (!selectedApiId) {
      setItems([]);
      setTotal(0);
      return;
    }

    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const adapter = apiRegistry.get(selectedApiId);
        if (!adapter) {
          setError("API non trouvée");
          setLoading(false);
          return;
        }

        const result = await adapter.fetchCollection({
          page,
          limit,
          search: searchTerm || undefined,
        });

        setItems(result.items || []);
        setTotal(result.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des items");
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [selectedApiId, searchTerm, page, limit]);

  const handleApiChange = (newApiId: string) => {
    setSelectedApiId(newApiId);
    setPage(1);
    setSearchTerm("");
    setSelectedItemId("");
  };

  const handleItemSelect = useCallback(async (item: unknown) => {
    if (!selectedApiId) return;

    const adapter = apiRegistry.get(selectedApiId);

    console.log(adapter);
    
    if (!adapter) return;

    try {
      const mappedData = adapter.mapItem(item);
      setSelectedItemId(mappedData.id);
      onSelect(selectedApiId, mappedData.id, mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du mapping de l'item");
    }
  }, [selectedApiId, onSelect]);

  const totalPages = Math.ceil(total / limit);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  if (adapters.length === 0) {
    return (
      <div className="flex flex-col gap-2 p-4 border border-border/30 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Aucune API n&apos;est enregistrée. Utilisez <code className="text-xs bg-muted px-1 py-0.5 rounded">CharismaPageBuilder.registerApi()</code> pour enregistrer une API.
        </p>
      </div>
    );
  }

  const apiOptions = adapters.map(adapter => ({
    value: adapter.id,
    label: adapter.label,
  }));

  const selectedAdapter = selectedApiId ? apiRegistry.get(selectedApiId) : null;

  return (
    <div className="flex flex-col gap-4">
      <Form.Group>
        <Form.Label text="Sélectionner une API" />
        <Form.Select
          value={selectedApiId}
          onChange={handleApiChange}
          options={apiOptions}
          placeholder="Choisir une API..."
        />
      </Form.Group>

      {selectedAdapter && (
        <>
          <Form.Group>
            <Form.Label text="Rechercher" />
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Form.Input
                type="text"
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Rechercher un item..."
                className="pl-8"
              />
            </div>
          </Form.Group>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && (!items || items.length === 0) && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun item trouv&eacute;
            </div>
          )}

          {!loading && !error && items && items.length > 0 && (
            <>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {items.map((item, index) => {
                  const mapped = selectedAdapter.mapItem(item);
                  const isSelected = selectedItemId === mapped.id;
                  
                  return (
                    <div
                      key={mapped.id || index}
                      onClick={() => handleItemSelect(item)}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                    >
                      <div className="flex gap-3">
                        {mapped.image && (
                          <img
                            src={mapped.image}
                            alt={mapped.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{mapped.title}</h4>
                          {mapped.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {mapped.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!hasPrevious || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages} ({total} items)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={!hasNext || loading}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ApiManager;
