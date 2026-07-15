import { type FC, useEffect, useMemo, useState } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps } from "../NodeConfigurationType";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";
import type { NodeListImageMediaEntry, NodeListImageType } from "./index";
import { HasLink } from "../shared/card";
import {
  fetchListImageCollectionCached,
  LIST_IMAGE_MEDIA_TYPE,
  mapMediaEntriesToListImageItems,
  normalizeListImageItemsPerPage,
  normalizeListImageMode,
  normalizeListImagePage,
  type ListImageMappedItem,
} from "./listImageApiUtils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const listNode = node as NodeListImageType;
  const listMode = normalizeListImageMode(listNode.content?.listMode);
  const apiId = listNode.content?.apiId?.trim() ?? "";
  const dynamicItems = useMemo(
    () =>
      (listNode.content?.dynamicItems ?? []).filter(
        (entry): entry is NodeListImageMediaEntry =>
          entry.type === LIST_IMAGE_MEDIA_TYPE && typeof entry.src === "string"
      ),
    [listNode.content?.dynamicItems]
  );
  const dynamicItemsKey = useMemo(() => JSON.stringify(dynamicItems), [dynamicItems]);
  const page = normalizeListImagePage(listNode.content?.page);
  const itemsPerPage = normalizeListImageItemsPerPage(listNode.content?.itemsPerPage);

  const [items, setItems] = useState<ListImageMappedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (listMode === "dynamic") {
        if (dynamicItems.length === 0) {
          setItems([]);
          setError(false);
          setLoading(false);
          return;
        }

        setItems(mapMediaEntriesToListImageItems(dynamicItems));
        setError(false);
        setLoading(false);
        return;
      }

      if (!apiId) {
        setItems([]);
        setError(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const response = await fetchListImageCollectionCached(apiId, page, itemsPerPage);
        if (!cancelled) {
          setItems(response.items.filter((item) => (item.image ?? "").trim().length > 0));
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [listMode, apiId, dynamicItemsKey, page, itemsPerPage]);

  const listStyle = listNode.content?.list?.style ?? {};
  const listClassName = listNode.content?.list?.className ?? "";
  const itemStyle = listNode.content?.item?.style ?? {};
  const itemClassName = listNode.content?.item?.className ?? "";
  const imageStyle = listNode.content?.image?.style ?? {};
  const imageClassName = listNode.content?.image?.className ?? "";

  const renderItem = (item: ListImageMappedItem, index: number) => {
    const link = item.link?.trim() ?? "";
    const image = (
      <img
        src={item.image}
        alt={item.alt ?? ""}
        className={cn("ce-list-image-media", imageClassName)}
        style={styleForView(imageStyle)}
        loading="lazy"
      />
    );

    return (
      <li
        key={`${item.id}-${index}`}
        className={cn("ce-list-image-item", itemClassName)}
        style={styleForView(itemStyle)}
      >
        {link ? <HasLink link={link}>{image}</HasLink> : image}
      </li>
    );
  };

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-list-image", listClassName, node.attributes?.className)}
      id={node.attributes?.id ?? ""}
      style={styleForView(listStyle)}
    >
      {loading ? (
        <span className="ce-list-image-status text-xs text-muted-foreground">Chargement…</span>
      ) : null}
      {!loading && error ? (
        <span className="ce-list-image-status text-xs text-muted-foreground">Liste indisponible</span>
      ) : null}
      {!loading && !error && listMode === "fixed" && !apiId ? (
        <span className="ce-list-image-status text-xs text-muted-foreground">Sélectionnez une API image</span>
      ) : null}
      {!loading && !error && listMode === "dynamic" && dynamicItems.length === 0 ? (
        <span className="ce-list-image-status text-xs text-muted-foreground">Ajoutez des images à la liste</span>
      ) : null}
      {!loading &&
      !error &&
      ((listMode === "fixed" && apiId) || (listMode === "dynamic" && dynamicItems.length > 0)) &&
      items.length === 0 ? (
        <span className="ce-list-image-status text-xs text-muted-foreground">Aucune image</span>
      ) : null}
      {items.length > 0 ? <ul className="ce-list-image-items">{items.map(renderItem)}</ul> : null}
    </div>
  );
};

export default View;
