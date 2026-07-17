import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../../../utils/styleHelper";
import { HasLink } from "../../../../shared/card";
import type { CollectionItem } from "../../../collectionUtils";
import type { CollectionStyledPart } from "../../../index";

type Props = {
  item: Extract<CollectionItem, { collectionType: "image" }>;
  styles: {
    item?: CollectionStyledPart;
    image?: CollectionStyledPart;
  };
};

/** Vue `default` image — alignée sur le nœud NodeImage (`.ce-image`). */
const ImageDefaultItem: FC<Props> = ({ item, styles }) => {
  const link = item.link?.trim() ?? "";
  const imageClassName = cn("ce-image", styles.image?.className);

  const image = (
    <img
      src={item.image}
      alt={item.alt ?? ""}
      className={imageClassName}
      style={styleForView(styles.image?.style ?? {})}
      loading="lazy"
    />
  );

  if (link) {
    return (
      <a href={link} className={cn("ce-image ce-image-link", styles.item?.className)} style={styleForView(styles.item?.style ?? {})}>
        {image}
      </a>
    );
  }

  return image;
};

export default ImageDefaultItem;
