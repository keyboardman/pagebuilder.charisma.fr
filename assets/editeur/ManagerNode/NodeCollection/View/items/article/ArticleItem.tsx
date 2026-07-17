import { type FC, type CSSProperties } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../../../utils/styleHelper";
import { HasLink } from "../../../../shared/card";
import {
  formatCounterValue,
  formatLikeValue,
  isShowEnabled,
} from "../../../collectionUtils";
import { CHARISMA_HEART_PATH } from "../../../../../components/video/heartIcon";
import type { CollectionItem } from "../../../collectionUtils";
import type { CollectionShow, CollectionStyledPart } from "../../../index";

type Props = {
  item: Extract<CollectionItem, { collectionType: "article" }>;
  show: CollectionShow;
  styles: {
    item?: CollectionStyledPart;
    title?: CollectionStyledPart;
    description?: CollectionStyledPart;
    counter?: CollectionStyledPart;
    like?: CollectionStyledPart;
  };
};

const metricsRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.4rem",
  alignSelf: "stretch",
  flexWrap: "nowrap",
  whiteSpace: "nowrap",
  width: "100%",
};

const badgeBaseStyle: CSSProperties = {
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
};

/** Vue étendue `article` — liste riche (`.ce-list-api`). */
const ArticleListApiItem: FC<Props> = ({ item, show, styles }) => {
  const itemClassName = styles.item?.className ?? "";
  const itemStyle = styles.item?.style ?? {};

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
          className={cn("ce-header ce-header-h3 ce-list-api-title", styles.title?.className)}
          style={styleForView(styles.title?.style ?? {})}
          dangerouslySetInnerHTML={{ __html: titleText }}
        />
      ) : null}
      {showDescription ? (
        <div
          className={cn("ce-list-api-description ce-text mb-0", styles.description?.className)}
          style={styleForView(styles.description?.style ?? {})}
          dangerouslySetInnerHTML={{ __html: descriptionText }}
        />
      ) : null}
      {showCounter || showLike ? (
        <div className="ce-list-api-metrics" style={metricsRowStyle}>
          {showCounter ? (
            <div
              className={cn("ce-list-api-counter ce-list-api-badge", styles.counter?.className)}
              style={{ ...badgeBaseStyle, ...styleForView(styles.counter?.style ?? {}) }}
            >
              {counterText}
            </div>
          ) : null}
          {showLike ? (
            <div
              className={cn("ce-list-api-like ce-list-api-badge", styles.like?.className)}
              style={{
                ...badgeBaseStyle,
                color: "rgba(185, 28, 28, 1)",
                backgroundColor: "rgba(254, 226, 226, 0.95)",
                border: "1px solid rgba(248, 113, 113, 0.45)",
                ...styleForView(styles.like?.style ?? {}),
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "0.82rem", height: "0.82rem" }}>
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
    <li className={cn("ce-list-api-item", itemClassName)} style={styleForView(itemStyle)}>
      {link ? <HasLink link={link}>{content}</HasLink> : content}
    </li>
  );
};

export default ArticleListApiItem;
