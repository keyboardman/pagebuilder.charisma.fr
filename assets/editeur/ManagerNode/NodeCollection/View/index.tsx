import { type FC } from "react";
import { useNodeContext } from "../../../services/providers/NodeContext";
import { type NodeViewProps } from "../../NodeConfigurationType";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";
import type { NodeCollectionType } from "../index";
import {
  normalizeCollectionDisplay,
  normalizeCollectionType,
  normalizeCollectionView,
} from "../collectionUtils";
import { useCollectionData } from "../useCollectionData";
import { CollectionDisplayGrid, CollectionDisplayList } from "./CollectionDisplay";
import { CollectionDisplaySlideshow } from "./CollectionDisplaySlideshow";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const collectionType = normalizeCollectionType(content.collectionType);
  const display = normalizeCollectionDisplay(content.display);
  const view = normalizeCollectionView(collectionType, content.view);

  const { items, loading, error, emptyMessage } = useCollectionData(collectionNode);

  const collectionStyle = content.collection?.style ?? {};
  const collectionClassName = content.collection?.className ?? "";
  const useListApiTheme = collectionType === "article" && view === "article";

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn(
        "ce-collection",
        useListApiTheme && "ce-list-api",
        collectionClassName,
        node.attributes?.className
      )}
      id={node.attributes?.id ?? ""}
      style={styleForView(collectionStyle)}
    >
      {loading ? (
        <span className="ce-collection-status text-xs text-muted-foreground">Chargement…</span>
      ) : null}
      {!loading && error ? (
        <span className="ce-collection-status text-xs text-muted-foreground">
          Collection indisponible
        </span>
      ) : null}
      {!loading && !error && emptyMessage ? (
        <span className="ce-collection-status text-xs text-muted-foreground">{emptyMessage}</span>
      ) : null}
      {!loading && !error && items.length > 0 ? (
        display === "grid" ? (
          <CollectionDisplayGrid items={items} view={view} content={content} />
        ) : display === "slideshow" ? (
          <CollectionDisplaySlideshow items={items} view={view} content={content} />
        ) : (
          <CollectionDisplayList items={items} view={view} content={content} />
        )
      ) : null}
    </div>
  );
};

export default View;
