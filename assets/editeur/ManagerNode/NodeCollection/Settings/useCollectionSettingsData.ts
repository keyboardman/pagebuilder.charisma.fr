import { useEffect, useState } from "react";
import {
  fetchCollectionCatalog,
  fetchCollectionItemsPage,
} from "../collectionApiUtils";
import {
  normalizeCollectionItemsPerPage,
  normalizeCollectionMode,
  normalizeCollectionPage,
  normalizeCollectionType,
} from "../collectionUtils";
import type { CollectionMode, CollectionType, NodeCollectionType } from "../index";

type Option = { value: string; label: string };

export function useCollectionSettingsData(collectionNode: NodeCollectionType) {
  const content = collectionNode.content ?? {};

  const collectionType: CollectionType = normalizeCollectionType(content.collectionType);
  const mode: CollectionMode = normalizeCollectionMode(content.mode);

  const [apiOptions, setApiOptions] = useState<Array<Option>>([]);
  const [totalPages, setTotalPages] = useState(0);

  const selectedApiId = (content.apiId ?? "").trim();
  const currentPage = normalizeCollectionPage(content.page);
  const currentItemsPerPage = normalizeCollectionItemsPerPage(content.itemsPerPage);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const catalogMode = mode === "dynamic" && collectionType !== "image" ? "dynamic" : "fixed";
        const catalog = await fetchCollectionCatalog(collectionType, catalogMode, {
          bypassCache: true,
        });
        if (!cancelled) {
          setApiOptions(catalog.map((s) => ({ value: s.id, label: s.label })));
        }
      } catch {
        if (!cancelled) {
          setApiOptions([]);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [collectionType, mode]);

  useEffect(() => {
    if (mode !== "fixed" || !selectedApiId) {
      setTotalPages(0);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchCollectionItemsPage(
          selectedApiId,
          currentPage,
          currentItemsPerPage
        );
        if (!cancelled) setTotalPages(response.totalPages);
      } catch {
        if (!cancelled) setTotalPages(0);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, selectedApiId, currentPage, currentItemsPerPage]);

  return {
    collectionType,
    mode,
    selectedApiId,
    currentPage,
    currentItemsPerPage,
    totalPages,
    apiOptions,
  };
}
