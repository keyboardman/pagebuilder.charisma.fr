import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps, type NodeEditProps } from "../NodeConfigurationType";
import type { NodeCardApiType } from "./index";
import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";
import type { ContainerAlign, ContainerRatio } from "../NodeCard";
import type { ContainerPositionApi } from "./index";
import { ViewTitle } from "./ViewTitle";
import { ViewText } from "./ViewText";
import { ViewLabel } from "./ViewLabel";
import { ViewImage } from "./ViewImage";
import { ViewEmptyApi } from "./ViewEmptyApi";
import HasLink from "./HasLink";
import ViewContainer, { ViewContainerImage, ViewContainerContent } from "./ViewContainer";
import { ViewContentOverlay, ViewContentOverlayWrapper } from "./ViewContentOverlay";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext();

  const link = (node?.content?.container?.link || "").trim();
  const _image = getImageFromNode(node as NodeCardApiType);
  const _title = getTitleFromNode(node as NodeCardApiType);
  const _text = getTextFromNode(node as NodeCardApiType);
  const _labels = getLabelsFromNode(node as NodeCardApiType);

  const cardStyle = node.content?.card?.style || {};
  const containerStyle = node.content?.container?.style || {};

  const containerPosition = node.content?.container?.position as ContainerPositionApi;
  const isOverlay = containerPosition === "overlay";
  const textOverlay = node.content?.container?.textOverlay;
  const hasImage = _image.show !== false && _image.src && _image.src.trim() !== "";
  const hasContent =
    (_title.show !== false && _title.title) ||
    (_text.show !== false && _text.text) ||
    (_labels.show !== false && _labels.labels.length > 0);
  const shouldShowTextOverlay = isOverlay && hasImage && hasContent;

  if (!node.content?.apiId || !node.content?.itemId) {
    return (
      <ViewEmptyApi
        className={node?.attributes?.className ?? ""}
        style={styleForView(node?.attributes?.style ?? {})}
      />
    );
  }

  // Overlay : même structure qu’en Edit (ViewContentOverlayWrapper + ViewContentOverlay)
  if (shouldShowTextOverlay) {
    return (
      <article
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
        id={node?.attributes?.id ?? ""}
        style={styleForView(cardStyle)}
      >
        <HasLink link={link}>
          <ViewContentOverlayWrapper>
            <div className="w-full aspect-video">
              {_image.src && _image.src.trim() !== "" ? (
                <img
                  src={_image.src}
                  alt={_image.alt ?? ""}
                  className="w-full h-full object-cover block"
                  style={styleForView(_image.style)}
                />
              ) : (
                <ViewImage
                  image={_image.src}
                  alt={_image.alt}
                  className={_image.className}
                  style={styleForView(_image.style)}
                />
              )}
            </div>
            <ViewContentOverlay
              position={textOverlay?.position || "bottom"}
              background={textOverlay?.background}
              style={styleForView(containerStyle)}
            >
              <ViewTitle
                show={_title?.show ?? false}
                title={_title.title ?? ""}
                className={_title.className ?? ""}
                style={styleForView(_title.style ?? {})}
              />
              <ViewText
                show={_text.show ?? false}
                text={_text.text ?? ""}
                className={_text.className ?? ""}
                style={styleForView(_text.style ?? {})}
              />
              <ViewLabel
                label={_labels?.labels?.[0] ?? ""}
                className={_labels?.className ?? ""}
                style={styleForView(_labels?.style ?? {})}
                show={_labels?.show ?? false}
              />
            </ViewContentOverlay>
          </ViewContentOverlayWrapper>
        </HasLink>
      </article>
    );
  }

  // Layout classique : même structure qu’en Edit (ViewContainer + ViewContainerImage + ViewContainerContent)
  const position = (containerPosition === "overlay" ? "top" : containerPosition) || "top";
  const align = (node?.content?.container?.align as ContainerAlign) || "start";
  const ratio = (node?.content?.container?.ratio as ContainerRatio) || "1/3";

  const imageContent =
    _image.show === false ? null : _image.src && _image.src.trim() !== "" ? (
      <HasLink link={link}>
        <img
          src={_image.src}
          alt={_image.alt ?? ""}
          className="w-full h-full object-cover block"
          style={styleForView(_image.style)}
        />
      </HasLink>
    ) : (
      <ViewImage
        image={_image.src}
        alt={_image.alt}
        className={_image.className}
        style={styleForView(_image.style)}
      />
    );

  const imageBlock =
    position === "top" && imageContent ? (
      <div className="w-full aspect-video overflow-hidden">{imageContent}</div>
    ) : (
      imageContent
    );

  return (
    <article
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
      id={node?.attributes?.id ?? ""}
      style={styleForView(cardStyle)}
    >
      <ViewContainer
        position={position}
        image={
          <ViewContainerImage
            position={position}
            align={align}
            ratio={ratio}
          >
            {imageBlock}
          </ViewContainerImage>
        }
        content={
          <ViewContainerContent align={align} style={styleForView(containerStyle)}>
            <HasLink link={link}>
              <ViewTitle
                show={_title.show}
                title={_title.title}
                className={_title.className}
                style={styleForView(_title.style ?? {})}
              />
            </HasLink>
            <ViewText
              show={_text.show ?? false}
              text={_text.text ?? ""}
              className={_text.className ?? ""}
              style={styleForView(_text.style ?? {})}
            />
            <ViewLabel
              label={_labels?.labels?.[0] ?? ""}
              className={_labels?.className ?? ""}
              style={styleForView(_labels?.style ?? {})}
              show={_labels?.show ?? false}
            />
          </ViewContainerContent>
        }
      />
    </article>
  );
};

export default View;
