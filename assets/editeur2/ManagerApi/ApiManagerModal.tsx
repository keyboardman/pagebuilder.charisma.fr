import { useState, useEffect, useCallback, useMemo } from "react";
import { apiRegistry } from "./ApiRegistry";
import type { ApiAdapterType } from "./ApiAdapter";
import Form from "../components/form";
import { Button } from "@editeur/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@editeur/components/ui/dialog";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@editeur/lib/utils";

interface MappedItemData {
  id: string;
  title: string;
  description?: string;
  image?: string;
  raw: unknown;
}

interface ApiManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId?: string;
  itemId?: string;
  /**
   * Filtre optionnel pour n'afficher que les APIs d'un type spécifique.
   * Si non défini, toutes les APIs enregistrées sont affichées.
   */
  typeFilter?: ApiAdapterType;
  /**
   * Filtre optionnel pour n'afficher que les APIs d'une catégorie spécifique.
   * Si non défini, toutes les catégories d'APIs sont affichées.
   * Les APIs sans catégorie définie sont incluses dans tous les filtres (rétrocompatibilité).
   */
  categoryFilter?: string;
  onSelect: (apiId: string, itemId: string, mappedData: MappedItemData) => void;
}

export function ApiManagerModal({ 
  open, 
  onOpenChange, 
  apiId: initialApiId, 
  itemId: initialItemId,
  typeFilter,
  categoryFilter,
  onSelect 
}: ApiManagerModalProps) {
  const [selectedApiId, setSelectedApiId] = useState<string>(initialApiId || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(100);
  const [items, setItems] = useState<unknown[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || "");
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrer les adapters selon le typeFilter et categoryFilter si fournis
  // Utiliser useMemo pour recalculer à chaque ouverture de la modale
  const adapters = useMemo(() => {
    const allAdapters = apiRegistry.list();
    
    let filtered = allAdapters;
    
    // Filtrer par type si fourni
    if (typeFilter) {
      filtered = filtered.filter(adapter => adapter.type === typeFilter);
    }
    
    // Filtrer par catégorie si fourni (inclure ceux sans catégorie pour rétrocompatibilité)
    if (categoryFilter) {
      filtered = filtered.filter(adapter => {
        // Inclure les adapters sans catégorie (rétrocompatibilité) ou avec la catégorie correspondante
        return !adapter.category || adapter.category === categoryFilter;
      });
    }
    
    // Debug: afficher les adapters filtrés
    console.log(`ApiManagerModal: Filtrage par type "${typeFilter}" et catégorie "${categoryFilter}"`, {
      total: allAdapters.length,
      filtered: filtered.length,
      adapters: filtered.map(a => ({ id: a.id, label: a.label, type: a.type, category: a.category }))
    });
    
    return filtered;
  }, [typeFilter, categoryFilter, open]); // Recalculer quand la modale s'ouvre

  // Charger les items quand l'API change ou la recherche change
  useEffect(() => {
    if (!selectedApiId || !open) {
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

        // Déterminer le nom du paramètre de requête pour la catégorie
        const categoryQueryParam = adapter.categoryQueryParam || "category";
        
        // Construire les paramètres de fetchCollection
        const fetchParams: {
          page: number;
          limit: number;
          search?: string;
          sort?: string;
          [key: string]: string | number | undefined;
        } = {
          page,
          limit,
          search: searchTerm.trim() || undefined,
        };
        
        // Ajouter le paramètre de catégorie avec le nom personnalisé
        if (selectedCategory) {
          fetchParams[categoryQueryParam] = selectedCategory;
        }

        const result = await adapter.fetchCollection(fetchParams);

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

    // Délai pour la recherche, chargement immédiat pour le changement d'API ou page
    let timeoutId: NodeJS.Timeout | undefined;
    if (searchTerm) {
      // Debounce pour la recherche
      timeoutId = setTimeout(loadItems, 300);
    } else {
      // Chargement immédiat pour changement d'API ou pagination
      loadItems();
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedApiId, searchTerm, page, limit, open, selectedCategory]);

  // Réinitialiser quand la modale s'ouvre
  useEffect(() => {
    if (open) {
      // Vérifier que l'API initiale correspond aux filtres si des filtres sont définis
      let validApiId = initialApiId || "";
      if (validApiId) {
        const adapter = apiRegistry.get(validApiId);
        if (adapter) {
          // Vérifier le typeFilter
          if (typeFilter && adapter.type !== typeFilter) {
            validApiId = "";
          }
          // Vérifier le categoryFilter
          if (categoryFilter && adapter.category && adapter.category !== categoryFilter) {
            validApiId = "";
          }
        } else {
          validApiId = "";
        }
      }
      setSelectedApiId(validApiId);
      setSelectedItemId(initialItemId || "");
      setPage(1);
      setSearchTerm("");
      setSelectedCategory(null);
      setCategories([]);
    }
  }, [open, initialApiId, initialItemId, typeFilter, categoryFilter]);

  const handleApiChange = (newApiId: string) => {
    setSelectedApiId(newApiId);
    setPage(1);
    setSearchTerm("");
    setSelectedItemId("");
    setSelectedCategory(null);
    setCategories([]);
  };

  // Récupérer les catégories quand une API est sélectionnée
  useEffect(() => {
    if (!selectedApiId || !open) {
      setCategories([]);
      setSelectedCategory(null);
      return;
    }

    const adapter = apiRegistry.get(selectedApiId);
    if (!adapter || !adapter.fetchCategories) {
      setCategories([]);
      setSelectedCategory(null);
      return;
    }

    const loadCategories = async () => {
      try {
        if (!adapter.fetchCategories) {
          setCategories([]);
          return;
        }
        const cats = await adapter.fetchCategories();
        setCategories(cats || []);
      } catch (err) {
        // Gérer l'erreur silencieusement : ne pas afficher de catégories
        console.error("Erreur lors de la récupération des catégories:", err);
        setCategories([]);
      }
    };

    loadCategories();
  }, [selectedApiId, open]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
    // Garder la recherche lors du changement de catégorie
  };

  const handleItemSelect = useCallback(async (item: unknown) => {
    if (!selectedApiId) return;

    const adapter = apiRegistry.get(selectedApiId);
    
    if (!adapter) return;

    try {
      const mappedData = adapter.mapItem(item);
      setSelectedItemId(mappedData.id);
      onSelect(selectedApiId, mappedData.id, mappedData);
      onOpenChange(false); // Fermer la modale après sélection
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du mapping de l'item");
    }
  }, [selectedApiId, onSelect, onOpenChange]);

  const totalPages = Math.ceil(total / limit);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const apiOptions = adapters.map(adapter => ({
    value: adapter.id,
    label: adapter.label,
  }));

  const selectedAdapter = selectedApiId ? apiRegistry.get(selectedApiId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Sélectionner un item depuis une API</DialogTitle>
          <DialogDescription>
            Choisissez une API et sélectionnez un item à afficher dans la card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {adapters.length === 0 ? (
            <div className="flex flex-col gap-2 p-4 border border-border/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                {typeFilter || categoryFilter
                  ? `Aucune API ne correspond aux critères de filtrage${typeFilter ? ` (type: "${typeFilter}")` : ""}${categoryFilter ? ` (catégorie: "${categoryFilter}")` : ""}.`
                  : `Aucune API n'est enregistrée. Utilisez `}
                {!typeFilter && !categoryFilter && (
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">CharismaPageBuilder.registerApi()</code>
                )}
                {!typeFilter && !categoryFilter && " pour enregistrer une API."}
              </p>
            </div>
          ) : (
            <>
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
                  {/* Affichage des catégories si disponibles */}
                  {categories.length > 0 && (
                    <Form.Group>
                      <Form.Label text="Catégorie" />
                      <Form.Select
                        value={selectedCategory || ""}
                        onChange={(value) => handleCategorySelect(value || null)}
                        options={[
                          { label: "Tous", value: "" },
                          ...categories.map((category) => ({
                            label: category.label,
                            value: category.id,
                          })),
                        ]}
                        placeholder="Sélectionner une catégorie..."
                      />
                    </Form.Group>
                  )}

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
                    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                      <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
                        {items.map((item, index) => {
                          const mapped = selectedAdapter.mapItem(item);
                          const isSelected = selectedItemId === mapped.id;
                          const itemNumber = (page - 1) * limit + index + 1;
                          
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
                              <div className="flex gap-3 items-center w-full">
                                <div className="shrink-0 w-8 text-center text-sm font-medium text-muted-foreground">
                                  {itemNumber}
                                </div>
                                {mapped.image ? (
                                  <img
                                    src={mapped.image}
                                    alt={mapped.title}
                                    className="w-16 h-16 object-cover rounded shrink-0"
                                    style={{ width: '64px', height: '64px', flexShrink: 0 }}
                                  />
                                ) : (
                                  <div className="shrink-0 bg-muted rounded flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                                    <span className="text-xs text-muted-foreground">No img</span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{mapped.title || "Sans titre"}</h4>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-2 pt-2 border-t">
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
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ApiManagerModal;
