import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../../../utils/styleHelper";
import { HasLink, ViewImage, ViewLabel, ViewText, ViewTitle } from "../../../../shared/card";
import { isShowEnabled } from "../../../collectionUtils";
import type { CollectionItem } from "../../../collectionUtils";
import type { CollectionShow, NodeCollectionType } from "../../../index";

type Props = {
  item: Extract<CollectionItem, { collectionType: "article" }>;
  show: CollectionShow;
  content: NodeCollectionType["content"];
};

/**
 * Vue `default` article — parité NodeCardApi (`.ce-card`).
 * Le texte de card est piloté par `show.description` (équivalent de `show.text` côté Card API).
 */
const ArticleDefaultItem: FC<Props> = ({ item, show, content }) => {
  const cardStyle = content?.card?.style ?? {};
  const container = content?.container ?? { position: "top", align: "start", ratio: "full" };
  const position = container.position ?? "top";
  const align = container.align ?? "start";
  const ratio = container.ratio ?? "full";
  const link = item.link?.trim() ?? "";

  const titleText = item.title?.trim() ?? "";
  const descriptionText = item.description?.trim() ?? "";
  const imageSrc = item.image?.trim() ?? "";
  const label = item.labels?.[0] ?? "";

  const showImage = isShowEnabled(show.image);
  const showTitle = isShowEnabled(show.title);
  const showDescription = isShowEnabled(show.description);
  const showLabels = isShowEnabled(show.labels);

  return (
    <article
      className={cn(
        `ce-card ce-card-position-${position} ce-card-align-${align}`,
        content?.item?.className
      )}
      style={styleForView(cardStyle)}
    >
      {showImage ? (
        <ViewImage
          image={imageSrc}
          alt={titleText || "Image"}
          className={cn(`ce-card-image ce-card-image-ratio-${ratio}`, content?.image?.className)}
          style={content?.image?.style ?? {}}
        />
      ) : null}

      <div className="ce-card-container-content" style={styleForView(container.style ?? {})}>
        <HasLink link={link}>
          <ViewTitle
            show={showTitle}
            title={titleText}
            className={cn("ce-card-title", content?.title?.className)}
            style={content?.title?.style ?? {}}
          />
        </HasLink>

        <ViewText
          show={showDescription}
          text={descriptionText}
          className={cn("ce-card-text", content?.text?.className)}
          style={content?.text?.style ?? {}}
        />

        <ViewLabel
          show={showLabels}
          label={label}
          className={cn("ce-card-label", content?.labels?.className)}
          style={content?.labels?.style ?? {}}
        />
      </div>
    </article>
  );
};

export default ArticleDefaultItem;
