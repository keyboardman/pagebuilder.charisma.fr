import { type FC, useCallback } from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps } from "../NodeConfigurationType";
import { cn } from "@editeur/lib/utils";
import EditableImage from "./Edit/EditableImage";
import EditLabel from "./Edit/EditLabel";
// import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";


import EditableTitle from "./Edit/EditableTitle";
import EditableText from "./Edit/EditableText";
import { ViewTitle, ViewText } from "./View/index";

import EditableLabels from "./Edit/EditableLabels";
import { ViewContainer, ViewContainerImage, ViewContainerContent } from "./View/index";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";
import { ViewContentOverlay, ViewContentOverlayWrapper } from "../NodeCardApi/ViewContentOverlay";
import EditHasLink from "../NodeCardApi/Edit/EditHasLink";

const Edit: FC<NodeEditProps> = () => {

    const { node } = useNodeContext();

    const { onChange, isSelected } = useNodeBuilderContext();

    const cardStyle = node.content?.card?.style || {};
    const containerStyle = node.content?.container?.style || {};

    const editable = isSelected();

    const handleChange = useCallback((field: string, value: string) => {
        onChange({
            ...node,
            content: {
                ...node.content,
                [field]: value
            }
        });
    }, [node, onChange]);

    const _show = node?.content?.show || {};
    const link = (node?.content?.container?.link || "").trim();

    const _image = node?.content?.image || {};

    const _title = node?.content?.title || {};

    const _text = node?.content?.text || {};

    const _labels = node?.content?.labels || {};

    const containerPosition = (node?.content?.container?.position as ContainerPosition) || "top";
    const isOverlay = containerPosition === "overlay";
    const textOverlay = node?.content?.container?.textOverlay;
    const hasImage = _image.show !== false && _image.src && _image.src.trim() !== "";
    const hasContent = (_title.show !== false && _title.title) || (_text.show !== false && _text.text) || (_labels.show !== false && _labels?.labels?.length > 0);
    const shouldShowTextOverlay = isOverlay && hasImage && hasContent;

    if (shouldShowTextOverlay) {
        return (
            <article
                data-ce-id={node.id}
                data-ce-type={node.type}
                className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
                style={cardStyle}
                id={node?.attributes?.id ?? ""}
            >
                <EditHasLink link={link}>
                    <ViewContentOverlayWrapper>
                        <div className="w-full aspect-video">
                            <EditableImage
                                show={_image.show}
                                src={_image.src}
                                alt={_image.alt}
                                className={_image.className}
                                style={_image.style}
                                onSelect={() => handleChange("selectedElement", "image")}
                            />
                        </div>
                        <ViewContentOverlay position={textOverlay?.position || "bottom"} background={textOverlay?.background} style={containerStyle}>
                            {editable ? (
                                <>
                                    <EditableTitle
                                        show={_title.show}
                                        title={_title.text}
                                        className={_title.className}
                                        style={_title.style}
                                        edit={true}
                                        placeholder="Votre titre"
                                        onFocus={() => handleChange("selectedElement", "title")}
                                        onBlur={(html) => onChange({ ...node, content: { ...node.content, title: { ...node?.content?.title, text: html } } })}
                                        onSelect={() => handleChange("selectedElement", "title")}
                                    />
                                    <EditableText
                                        show={_text.show !== false}
                                        text={_text.text}
                                        className={_text.className}
                                        style={_text.style}
                                        edit={true}
                                        placeholder="votre texte..."
                                        onFocus={() => handleChange("selectedElement", "text")}
                                        onBlur={(html) => onChange({ ...node, content: { ...node.content, text: { ...node?.content?.text, text: html } } })}
                                        onSelect={() => handleChange("selectedElement", "text")}
                                    />
                                </>
                            ) : (
                                <>
                                    {_title.show !== false && (
                                        <ViewTitle text={_title.text ?? ""} className={_title.className ?? ""} style={_title.style ?? {}} />
                                    )}
                                    {_text.show !== false && (
                                        <ViewText text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
                                    )}
                                </>
                            )}
                            <EditableLabels
                                show={_labels.show !== false}
                                className={_labels.className}
                                style={_labels.style}
                                labels={_labels.items}
                                onSelect={() => handleChange("selectedElement", "labels")}
                            />
                        </ViewContentOverlay>
                    </ViewContentOverlayWrapper>
                </EditHasLink>
            </article>
        );
    }

    const positionForContainer = (containerPosition === "overlay" ? "top" : containerPosition) || "top";
    const alignForContainer = (node?.content?.container?.align as ContainerAlign) || "start";
    const ratioForContainer = (node?.content?.container?.ratio as ContainerRatio) || "1/3";

    return (
        <article
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
            style={cardStyle}
            id={node?.attributes?.id ?? ""}
        >
            <ViewContainer
                position={positionForContainer}
                image={
                    <ViewContainerImage
                        position={positionForContainer}
                        align={alignForContainer}
                        ratio={ratioForContainer}
                    >
                        <EditHasLink link={link}>
                            <EditableImage
                                show={_show.image }
                                src={_image.src}
                                alt={_image.alt}
                                className={_image.className}
                                style={_image.style}
                                onSelect={() => handleChange("selectedElement", "image")}
                            />
                        </EditHasLink>
                    </ViewContainerImage>
                }
                content={
                    <ViewContainerContent align={alignForContainer} style={containerStyle}>
                        <EditHasLink link={link}>
                            {editable ? (
                                <EditableTitle
                                    show={_show.title}
                                    title={_title.text}
                                    className={_title.className}
                                    style={_title.style}
                                    edit={true}
                                    placeholder="Votre titre"
                                    onFocus={() => handleChange("selectedElement", "title")}
                                    onBlur={(html) =>
                                        onChange({
                                            ...node,
                                            content: {
                                                ...node.content,
                                                title: { ...node?.content?.title, text: html },
                                            },
                                        })
                                    }
                                    onSelect={() => handleChange("selectedElement", "title")}
                                />
                            ) : (
                                _show.title !== false && (
                                    <ViewTitle text={_title.text ?? ""} className={_title.className ?? ""} style={_title.style ?? {}} />
                                )
                            )}
                        </EditHasLink>
                        {editable ? (
                            <EditableText
                                show={_show.text}
                                text={_text.text}
                                className={_text.className}
                                style={_text.style}
                                edit={true}
                                placeholder="votre texte..."
                                onFocus={() => handleChange("selectedElement", "text")}
                                onBlur={(html) =>
                                    onChange({
                                        ...node,
                                        content: {
                                            ...node.content,
                                            text: { ...node?.content?.text, text: html },
                                        },
                                    })
                                }
                                onSelect={() => handleChange("selectedElement", "text")}
                            />
                        ) : (
                            _show.text !== false && (
                                <ViewText text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
                            )
                        )}
                        <EditLabel
                            className={_labels.className}
                            style={_labels.style}
                            label={_labels.labels?.[0] ?? false}
                        />
                    </ViewContainerContent>
                }
            />
        </article>
    );
};

export default Edit;
