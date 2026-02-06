import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps, type NodeEditProps } from "../NodeConfigurationType";
import { cn } from "@editeur/lib/utils";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";
import { styleForView } from "../../utils/styleHelper";
import HasLink from "../NodeCardApi/HasLink";
import { ViewImage, ViewText, ViewTitle, ViewLabels, ViewContentOverlay, ViewContentOverlayWrapper, ViewContainer, ViewContainerImage, ViewContainerContent } from "./View/index";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext();

  const link = (node?.content?.container?.link || "").trim();
  const show = node?.content?.show || {};
  const _image = node?.content?.image || {};
  const _title = node?.content?.title || {};
  const _text = node?.content?.text || {};
  const _labels = node?.content?.labels || {};

  const position = (node?.content?.container?.position as ContainerPosition) || "top";
  const align = (node?.content?.container?.align as ContainerAlign) || "start";
  const ratio = (node?.content?.container?.ratio as ContainerRatio) || "1/3";
  const textOverlay = node?.content?.container?.textOverlay;
  const containerStyle = node?.content?.container?.style || {};
  const cardStyle = node?.content?.card?.style || {};
  const isOverlay = position === "overlay";
  const hasImage = show.image !== false && _image.src && String(_image.src).trim() !== "";
  const hasContent =
    (show.title !== false && _title.text) ||
    (show.text !== false && _text.text) ||
    (show.labels !== false && (_labels.items?.length ?? 0) > 0);
  const shouldShowTextOverlay = isOverlay && hasImage && hasContent;

  if (shouldShowTextOverlay) {
    return (
      <article
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
        id={node?.attributes?.id ?? ""}
        style={styleForView({ ...node?.attributes?.style, ...cardStyle })}
      >
        <HasLink link={link}>
          <ViewContentOverlayWrapper>
            <div className="w-full aspect-video">
              {_image.src && _image.src.trim() !== "" ? (
                <img
                  src={_image.src}
                  alt={_image.alt ?? ""}
                  className="w-full h-full object-cover block"
                  style={styleForView(_image.style ?? {})}
                />
              ) : (
                <ViewImage
                  image={_image.src ?? ""}
                  alt={_image.alt ?? ""}
                  className={_image.className ?? ""}
                  style={_image.style ?? {}}
                />
              )}
            </div>
            <ViewContentOverlay
              position={textOverlay?.position || "bottom"}
              background={textOverlay?.background}
              style={styleForView(containerStyle)}
            >
              {show.title !== false && (
                <ViewTitle text={_title.text ?? ""} className={_title.className ?? ""} style={_title.style ?? {}} />
              )}
              {show.text !== false && (
                <ViewText text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
              )}
              {show.labels !== false && (
                <ViewLabels
                  labels={_labels.items ?? []}
                  className={_labels.className ?? ""}
                  style={_labels.style ?? {}}
                />
              )}
            </ViewContentOverlay>
          </ViewContentOverlayWrapper>
        </HasLink>
      </article>
    );
  }

  const positionForContainer = (position === "overlay" ? "top" : position) || "top";
  const imageContent =
    show.image === false ? null : _image.src && _image.src.trim() !== "" ? (
      <HasLink link={link}>
        <img
          src={_image.src}
          alt={_image.alt ?? ""}
          className="w-full h-full object-cover block"
          style={styleForView(_image.style ?? {})}
        />
      </HasLink>
    ) : (
      <ViewImage
        image={_image.src ?? ""}
        alt={_image.alt ?? ""}
        className={_image.className ?? ""}
        style={_image.style ?? {}}
      />
    );

  const imageBlock =
    positionForContainer === "top" && imageContent ? (
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
      style={styleForView({ ...node?.attributes?.style, ...cardStyle })}
    >
      <ViewContainer
        position={positionForContainer}
        image={
          <ViewContainerImage position={positionForContainer} align={align} ratio={ratio}>
            {imageBlock}
          </ViewContainerImage>
        }
        content={
          <ViewContainerContent align={align} style={styleForView(containerStyle)}>
            <HasLink link={link}>
              {show.title !== false && (
                <ViewTitle text={_title.text ?? ""} className={_title.className ?? ""} style={_title.style ?? {}} />
              )}
            </HasLink>
            {show.text !== false && (
              <ViewText text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
            )}
            {show.labels !== false && (
              <ViewLabels
                labels={_labels.items ?? []}
                className={_labels.className ?? ""}
                style={_labels.style ?? {}}
              />
            )}
          </ViewContainerContent>
        }
      />
    </article>
  );
};

export default View;
