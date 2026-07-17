import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { CollectionItemRenderer } from "./CollectionItemRenderer";
import type { CollectionItem } from "../collectionUtils";
import type { CollectionView, NodeCollectionType } from "../index";

interface CollectionDisplayListProps {
  items: CollectionItem[];
  view: CollectionView;
  content: NodeCollectionType["content"];
}

function itemStyles(content: NodeCollectionType["content"]) {
  return {
    item: content?.item,
    image: content?.image,
    title: content?.title,
    description: content?.description,
    counter: content?.counter,
    like: content?.like,
  };
}

const GAP_CLASS: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

function gapClassName(gap: number, fallback: string): string {
  return GAP_CLASS[gap] ?? fallback;
}

export const CollectionDisplayList: FC<CollectionDisplayListProps> = ({ items, view, content }) => {
  const show = content?.show ?? {};
  const styles = itemStyles(content);
  const useListApiMarkup = items[0]?.collectionType === "article" && view === "article";
  const gap = content?.list?.gap ?? 3;
  const listClassName = cn("ce-collection-list", gapClassName(gap, "gap-3"));

  const entries = items.map((item) => (
    <CollectionItemRenderer
      key={`${item.collectionType}-${item.id}`}
      item={item}
      view={view}
      show={show}
      content={content}
      styles={styles}
    />
  ));

  if (useListApiMarkup) {
    return <ul className={cn("ce-list-api-items", listClassName)}>{entries}</ul>;
  }

  return <div className={listClassName}>{entries}</div>;
};

interface CollectionDisplayGridProps extends CollectionDisplayListProps {}

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const SM_GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const LG_GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

function clampColumns(value: number | undefined, fallback: number): number {
  const n = value ?? fallback;
  return Math.min(6, Math.max(1, n));
}

export const CollectionDisplayGrid: FC<CollectionDisplayGridProps> = ({ items, view, content }) => {
  const columns = content?.grid?.columns ?? { desktop: 3, tablet: 2, mobile: 1 };
  const gap = content?.grid?.gap ?? 4;
  const mobile = clampColumns(columns.mobile, 1);
  const tablet = clampColumns(columns.tablet, 2);
  const desktop = clampColumns(columns.desktop, 3);
  const show = content?.show ?? {};
  const styles = itemStyles(content);

  return (
    <div
      className={cn(
        "ce-collection-grid grid",
        GRID_COLS[mobile],
        SM_GRID_COLS[tablet],
        LG_GRID_COLS[desktop],
        gapClassName(gap, "gap-4")
      )}
    >
      {items.map((item) => (
        <div key={`${item.collectionType}-${item.id}`} className="ce-collection-grid-entry">
          <CollectionItemRenderer
            item={item}
            view={view}
            show={show}
            content={content}
            styles={styles}
          />
        </div>
      ))}
    </div>
  );
};
