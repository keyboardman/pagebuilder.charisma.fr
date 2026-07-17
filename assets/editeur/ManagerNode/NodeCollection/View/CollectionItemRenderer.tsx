import { type FC } from "react";
import type { CollectionShow, CollectionStyledPart, NodeCollectionType } from "../index";
import type { CollectionItem } from "../collectionUtils";
import type { CollectionView } from "./collectionViews";
import ImageDefaultItem from "./items/image/DefaultItem";
import VideoDefaultItem from "./items/video/DefaultItem";
import ArticleDefaultItem from "./items/article/DefaultItem";
import ArticleListApiItem from "./items/article/ArticleItem";

interface CollectionItemRendererProps {
  item: CollectionItem;
  view: CollectionView;
  show: CollectionShow;
  content: NodeCollectionType["content"];
  styles: {
    item?: CollectionStyledPart;
    image?: CollectionStyledPart;
    title?: CollectionStyledPart;
    description?: CollectionStyledPart;
    counter?: CollectionStyledPart;
    like?: CollectionStyledPart;
  };
}

export const CollectionItemRenderer: FC<CollectionItemRendererProps> = ({
  item,
  view,
  show,
  content,
  styles,
}) => {
  if (item.collectionType === "image") {
    return <ImageDefaultItem item={item} styles={styles} />;
  }

  if (item.collectionType === "video") {
    return <VideoDefaultItem item={item} show={show} content={content} />;
  }

  if (view === "article") {
    return <ArticleListApiItem item={item} show={show} styles={styles} />;
  }

  return <ArticleDefaultItem item={item} show={show} content={content} />;
};
