import { useEffect, useMemo, useState } from "react";
import type { NodeCollectionType } from "./index";
import {
  fetchCollectionItems,
  hasDynamicCollectionItems,
  normalizeCollectionItemsPerPage,
  normalizeCollectionMode,
  normalizeCollectionPage,
  normalizeCollectionType,
  type CollectionItem,
} from "./collectionUtils";

export interface UseCollectionDataResult {
  items: CollectionItem[];
  loading: boolean;
  error: boolean;
  emptyMessage: string | null;
}

export function useCollectionData(node: NodeCollectionType): UseCollectionDataResult {
  const content = node.content ?? {};
  const collectionType = normalizeCollectionType(content.collectionType);
  const mode = normalizeCollectionMode(content.mode);
  const apiId = content.apiId?.trim() ?? "";
  const page = normalizeCollectionPage(content.page);
  const itemsPerPage = normalizeCollectionItemsPerPage(content.itemsPerPage);
  const dynamicImageItems = content.dynamicImageItems ?? [];
  const dynamicArticleItems = content.dynamicArticleItems ?? [];
  const dynamicVideoItems = content.dynamicVideoItems ?? [];

  const dynamicKey = useMemo(
    () =>
      JSON.stringify({
        dynamicImageItems,
        dynamicArticleItems,
        dynamicVideoItems,
      }),
    [dynamicImageItems, dynamicArticleItems, dynamicVideoItems]
  );

  const shouldFetch =
    (mode === "fixed" && !!apiId) ||
    (mode === "dynamic" &&
      hasDynamicCollectionItems({
        collectionType,
        mode,
        dynamicImageItems,
        dynamicArticleItems,
        dynamicVideoItems,
      }));

  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const params = {
        collectionType,
        mode,
        apiId,
        page,
        itemsPerPage,
        dynamicImageItems,
        dynamicArticleItems,
        dynamicVideoItems,
      };

      if (mode === "dynamic") {
        if (!hasDynamicCollectionItems(params)) {
          setItems([]);
          setError(false);
          setLoading(false);
          setHasFetched(true);
          return;
        }

        setLoading(true);
        setError(false);
        setHasFetched(false);

        try {
          const resolved = await fetchCollectionItems(params);
          if (!cancelled) {
            setItems(resolved);
          }
        } catch {
          if (!cancelled) {
            setItems([]);
            setError(true);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
            setHasFetched(true);
          }
        }
        return;
      }

      if (!apiId) {
        setItems([]);
        setError(false);
        setLoading(false);
        setHasFetched(true);
        return;
      }

      setLoading(true);
      setError(false);
      setHasFetched(false);

      try {
        const resolved = await fetchCollectionItems(params);
        if (!cancelled) {
          setItems(resolved);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHasFetched(true);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [collectionType, mode, apiId, page, itemsPerPage, dynamicKey]);

  const emptyMessage = useMemo(() => {
    if (loading || error) {
      return null;
    }
    if (mode === "fixed" && !apiId) {
      return "Sélectionnez une source API";
    }
    if (mode === "dynamic" && !hasDynamicCollectionItems({
      collectionType,
      mode,
      dynamicImageItems,
      dynamicArticleItems,
      dynamicVideoItems,
    })) {
      return collectionType === "image"
        ? "Ajoutez des images à la collection"
        : "Ajoutez des items à la collection";
    }
    if (hasFetched && items.length === 0) {
      return "Aucun item";
    }
    return null;
  }, [
    loading,
    error,
    mode,
    apiId,
    collectionType,
    dynamicImageItems,
    dynamicArticleItems,
    dynamicVideoItems,
    items.length,
    hasFetched,
  ]);

  return { items, loading, error, emptyMessage };
}
