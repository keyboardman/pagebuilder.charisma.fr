import { type FC, useEffect, useState } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps } from "../NodeConfigurationType";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";
import type { NodeListApiType } from "./index";
import { HasLink } from "../shared/card";
import {
  formatCounterValue,
  formatLikeValue,
  isShowEnabled,
  type ListApiMappedItem,
  fetchListApiCollectionCached,
  normalizeListApiItemsPerPage,
  normalizeListApiPage,
} from "./listApiUtils";
import { CHARISMA_HEART_PATH } from "../../components/video/heartIcon";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const listNode = node as NodeListApiType;
  const apiId = listNode.content?.apiId?.trim() ?? "";
  const show = listNode.content?.show ?? {};
  const page = normalizeListApiPage(listNode.content?.page);
  const itemsPerPage = normalizeListApiItemsPerPage(listNode.content?.itemsPerPage);

  const [items, setItems] = useState<ListApiMappedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!apiId) {
        setItems([]);
        setError(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const response = await fetchListApiCollectionCached(apiId, page, itemsPerPage);
        if (!cancelled) {
          setItems(response.items);
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
  }, [apiId, page, itemsPerPage]);

  const listStyle = listNode.content?.list?.style ?? {};
  const listClassName = listNode.content?.list?.className ?? "";
  const itemStyle = listNode.content?.item?.style ?? {};
  const itemClassName = listNode.content?.item?.className ?? "";
  const metricsRowDefaultStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.4rem",
    alignSelf: "stretch",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    width: "100%",
  };
  const badgeBaseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: "9999px",
    padding: "0.2rem 0.55rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1,
    border: "1px solid rgba(148, 163, 184, 0.45)",
    backgroundColor: "rgba(241, 245, 249, 0.95)",
    color: "rgba(51, 65, 85, 1)",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
  };
  const counterDefaultStyle: React.CSSProperties = {
    ...badgeBaseStyle,
    minWidth: "2rem",
    justifyContent: "center",
  };
  const likeDefaultStyle: React.CSSProperties = {
    ...badgeBaseStyle,
    color: "rgba(185, 28, 28, 1)",
    backgroundColor: "rgba(254, 226, 226, 0.95)",
    border: "1px solid rgba(248, 113, 113, 0.45)",
  };

  const renderItem = (item: ListApiMappedItem) => {
    const titleText = item.title?.trim() ?? "";
    const descriptionText = item.description?.trim() ?? "";
    const counterText = formatCounterValue(item.counter);
    const likeText = formatLikeValue(item.like);
    const link = item.link?.trim() ?? "";

    const showTitle = isShowEnabled(show.title) && titleText !== "";
    const showDescription = isShowEnabled(show.description) && descriptionText !== "";
    const showCounter = isShowEnabled(show.counter) && counterText !== "";
    const showLike = isShowEnabled(show.like) && likeText !== "";

    const content = (
      <>
        {showTitle ? (
          <h3
            className={cn("ce-header ce-header-h3 ce-list-api-title", listNode.content?.title?.className)}
            style={styleForView(listNode.content?.title?.style ?? {})}
            dangerouslySetInnerHTML={{ __html: titleText }}
          />
        ) : null}
        {showDescription ? (
          <div
            className={cn("ce-list-api-description ce-text mb-0", listNode.content?.description?.className)}
            style={styleForView(listNode.content?.description?.style ?? {})}
            dangerouslySetInnerHTML={{ __html: descriptionText }}
          />
        ) : null}
        {showCounter || showLike ? (
          <div className="ce-list-api-metrics" style={metricsRowDefaultStyle}>
            {showCounter ? (
              <div
                className={cn("ce-list-api-counter ce-list-api-badge", listNode.content?.counter?.className)}
                style={{
                  ...counterDefaultStyle,
                  ...styleForView(listNode.content?.counter?.style ?? {}),
                }}
              >
                {counterText}
              </div>
            ) : null}
            {showLike ? (
              <div
                className={cn("ce-list-api-like ce-list-api-badge", listNode.content?.like?.className)}
                style={{
                  ...likeDefaultStyle,
                  ...styleForView(listNode.content?.like?.style ?? {}),
                }}
              >
                <svg
                  className="ce-list-api-like-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                  style={{ width: "0.82rem", height: "0.82rem", flexShrink: 0, display: "block" }}
                >
                  <path d={CHARISMA_HEART_PATH} fill="currentColor" />
                </svg>
                <span>{likeText}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );

    return (
      <li key={item.id} className={cn("ce-list-api-item", itemClassName)} style={styleForView(itemStyle)}>
        {link ? <HasLink link={link}>{content}</HasLink> : content}
      </li>
    );
  };

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-list-api", listClassName, node.attributes?.className)}
      id={node.attributes?.id ?? ""}
      style={styleForView(listStyle)}
    >
      {loading ? (
        <span className="ce-list-api-status text-xs text-muted-foreground">Chargement…</span>
      ) : null}
      {!loading && error ? (
        <span className="ce-list-api-status text-xs text-muted-foreground">Liste indisponible</span>
      ) : null}
      {!loading && !error && !apiId ? (
        <span className="ce-list-api-status text-xs text-muted-foreground">Sélectionnez une API list</span>
      ) : null}
      {!loading && !error && apiId && items.length === 0 ? (
        <span className="ce-list-api-status text-xs text-muted-foreground">Aucun item</span>
      ) : null}
      {items.length > 0 ? <ul className="ce-list-api-items">{items.map(renderItem)}</ul> : null}
    </div>
  );
};

export default View;
