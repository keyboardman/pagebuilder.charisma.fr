import { type FC, useCallback } from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps } from "../NodeConfigurationType";
import { cn } from "@editeur/lib/utils";
import EditableImage from "../NodeCard/EditableImage";
import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";
import type { NodeCardApiType } from "./index";
import type { ContainerAlign, ContainerRatio } from "../NodeCard";
import type { ContainerPositionApi } from "./index";
import EditTitle from "./Edit/EditTitle";
import EditText from "./Edit/EditText";
import EditLabel from "./Edit/EditLabel";
import EditHasLink from "./Edit/EditHasLink";
import { ViewEmptyApi } from "./ViewEmptyApi";
import ViewContainer, { ViewContainerImage, ViewContainerContent } from "./ViewContainer";
import { ViewContentOverlay, ViewContentOverlayWrapper } from "./ViewContentOverlay";


const Edit: FC<NodeEditProps> = () => {

    const { node } = useNodeContext();

    const { onChange } = useNodeBuilderContext();

    const cardStyle = node.content?.card?.style || {};
    const containerStyle = node.content?.container?.style || {};

    const handleChange = useCallback((field: string, value: string) => {
        onChange({
            ...node,
            content: {
                ...node.content,
                [field]: value
            }
        });
    }, [node, onChange]);

    const link = (node?.content?.container?.link || "").trim();

    const _image = getImageFromNode(node as NodeCardApiType);

    const _title = getTitleFromNode(node as NodeCardApiType);

    const _text = getTextFromNode(node as NodeCardApiType);

    const _labels = getLabelsFromNode(node as NodeCardApiType);


    // Configuration du contenu en overlay
    const containerPosition = node.content?.container?.position as ContainerPositionApi;
    const isOverlay = containerPosition === "overlay";
    const textOverlay = node.content?.container?.textOverlay;
    const hasImage = _image.show !== false && _image.src && _image.src.trim() !== "";
    const hasContent = (_title.show !== false && _title.title) || (_text.show !== false && _text.text) || (_labels.show !== false && _labels.labels.length > 0);
    const shouldShowTextOverlay = isOverlay && hasImage && hasContent;

    // Afficher un placeholder si aucun item n'est sélectionné
    if (!node.content?.apiId || !node.content?.itemId) {
        return <ViewEmptyApi className={node?.attributes?.className ?? ""} style={node?.attributes?.style ?? {}} />;
    }

    // Si textOverlay est activé, afficher l'image en plein avec le contenu en overlay
    if (shouldShowTextOverlay) {
        return (
            <article
                data-ce-id={node.id}
                data-ce-type={node.type}
                className={cn( 
                    node?.attributes?.className , 
                    "overflow-hidden"
                )}
                id={node?.attributes?.id ?? ""}
                style={cardStyle}
            >
                <EditHasLink link={link}>
                    <ViewContentOverlayWrapper>

                        <EditableImage
                            show={_image.show}
                            src={_image.src}
                            alt={_image.alt}
                            className={_image.className}
                            style={_image.style}
                            onSelect={() => {
                                handleChange("selectedElement", "image");
                            }}
                        />
                        <ViewContentOverlay position={textOverlay?.position || 'bottom'} background={textOverlay?.background} style={containerStyle}>
                            <EditTitle
                                show={_title.show}
                                title={_title.title}
                                className={_title.className}
                                style={_title.style}
                                onSelect={() => handleChange("selectedElement", "title")}
                            />
                            <EditText
                                show={_text.show}
                                text={_text.text}
                                className={_text.className}
                                style={_text.style}
                                onSelect={() => handleChange("selectedElement", "text")}
                            />
                            <EditLabel
                                show={_labels.show}
                                label={_labels.labels?.[0] ?? ''}
                                className={_labels.className}
                                style={_labels.style}
                                onSelect={() => handleChange("selectedElement", "label")}
                            />
                        </ViewContentOverlay>

                    </ViewContentOverlayWrapper>
                </EditHasLink>
            </article>
        );
    }

    // Layout classique : image à gauche/droite/en haut avec contenu à côté
    return (
        <article
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn( 
                node?.attributes?.className , 
                "overflow-hidden"
            )}
            id={node?.attributes?.id ?? ""}
            style={cardStyle}
        >
            <ViewContainer
                position={(containerPosition === "overlay" ? "top" : containerPosition) || "top"}
                image={
                    <ViewContainerImage
                        position={(containerPosition === "overlay" ? "top" : containerPosition) || "top"}
                        align={(node?.content?.container?.align as ContainerAlign || "start")}
                        ratio={(node?.content?.container?.ratio as ContainerRatio || "1/3")}
                    >
                        <EditHasLink link={link}>
                            <EditableImage
                                show={_image.show}
                                src={_image.src}
                                alt={_image.alt}
                                className={_image.className}
                                style={_image.style}
                                onSelect={() => {
                                    handleChange("selectedElement", "image");
                                }}
                            />
                        </EditHasLink>
                        
                    </ViewContainerImage>
                }
                content={<ViewContainerContent align={(node?.content?.container?.align as ContainerAlign || "start")} style={containerStyle}>
                    <EditHasLink link={link}>
                        <EditTitle
                            show={_title.show}
                            title={_title.title}
                            className={_title.className}
                            style={_title.style}
                            onSelect={() => handleChange("selectedElement", "title")}
                        />
                    </EditHasLink>
                    <EditText
                        show={_text.show}
                        text={_text.text}
                        className={_text.className}
                        style={_text.style}
                        onSelect={() => handleChange("selectedElement", "text")}
                    />
                    <EditLabel
                        show={_labels.show}
                        label={_labels.labels?.[0] ?? ''}
                        className={_labels.className}
                        style={_labels.style}
                        onSelect={() => handleChange("selectedElement", "label")}
                    />  
                </ViewContainerContent>}
            />
        </article>
    );
};

export default Edit;
