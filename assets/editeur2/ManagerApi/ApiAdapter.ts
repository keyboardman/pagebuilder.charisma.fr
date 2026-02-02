/**
 * Type de contenu fourni par un ApiAdapter.
 * - "article" : pour les APIs fournissant des articles de blog, actualités, etc.
 * - "video" : pour les APIs fournissant des vidéos
 * - "image" : pour les APIs fournissant des images
 */
export type ApiAdapterType = "article" | "video" | "image";

/**
 * Interface pour adapter des APIs externes au système de gestion de contenu.
 * 
 * @template TItem - Type de l'item brut retourné par l'API
 */
export interface ApiAdapter<TItem = any> {
    /** Identifiant unique de l'API */
    id: string;
    /** Libellé affiché pour l'API */
    label: string;
    /** Type de contenu fourni par l'API */
    type: ApiAdapterType;
    /** Catégorie optionnelle de l'API pour permettre un filtrage supplémentaire (ex: "news", "ecommerce", "cms") */
    category?: string;
  
    /**
     * Récupère une collection paginée d'items depuis l'API.
     * 
     * @param params - Paramètres de pagination et de recherche
     * @param params.page - Numéro de page (commence à 1)
     * @param params.limit - Nombre d'items par page
     * @param params.search - Terme de recherche optionnel
     * @param params.sort - Critère de tri optionnel
     * @param params.category - Catégorie optionnelle pour filtrer les items (si categoryQueryParam n'est pas défini)
     * @param params[categoryQueryParam] - Catégorie optionnelle avec le nom de paramètre personnalisé (si categoryQueryParam est défini)
     * @returns Promise résolue avec les items et le total
     */
    fetchCollection(params: {
      page: number;
      limit: number;
      search?: string;
      sort?: string;
      category?: string;
      [key: string]: string | number | undefined;
    }): Promise<{
      items: TItem[];
      total: number;
    }>;
  
    /**
     * Récupère un item spécifique par son ID.
     * 
     * @param id - Identifiant de l'item
     * @returns Promise résolue avec l'item
     */
    fetchItem(id: string): Promise<TItem>;

    /**
     * Récupère la liste des catégories disponibles depuis l'API.
     * Cette méthode est optionnelle : si elle n'est pas implémentée, aucun filtre de catégorie d'items ne sera disponible.
     * 
     * @returns Promise résolue avec un tableau d'objets représentant les catégories disponibles
     * Chaque catégorie contient :
     * - `id`: string - Identifiant de la catégorie (utilisé comme valeur dans la query)
     * - `label`: string - Libellé affiché dans le sélecteur
     */
    fetchCategories?(): Promise<Array<{ id: string; label: string }>>;
  
    /**
     * Nom du paramètre de requête à utiliser pour filtrer par catégorie dans fetchCollection.
     * Par défaut, "category" est utilisé. Si votre API utilise un autre nom de paramètre (ex: "categorieWebTV"),
     * vous pouvez le définir ici.
     * 
     * Exemple : Si `categoryQueryParam = "categorieWebTV"`, alors fetchCollection sera appelé avec
     * `params.categorieWebTV` au lieu de `params.category`.
     */
    categoryQueryParam?: string;
  
    /**
     * Mappe un item brut vers le format standardisé utilisé par le système.
     * 
     * @param item - Item brut retourné par l'API
     * @returns Item mappé avec les propriétés standardisées
     */
    mapItem(item: TItem): {
      id: string;
      title: string;
      description?: string;
      image?: string;
      labels?: string[];
      link?: string;
      text?: string;
      raw: TItem;
    };
  }
  