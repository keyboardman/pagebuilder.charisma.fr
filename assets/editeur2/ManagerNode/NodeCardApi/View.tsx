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
import { ViewContentOverlayWrapper, ViewContentOverlay } from "./ViewContentOverlay";
import ViewContainer, { ViewContainerImage, ViewContainerContent } from "./ViewContainer";
import { cn } from "@editeur/lib/utils";

const View: FC<NodeViewProps | NodeEditProps> = () => {
    const { node } = useNodeContext();

    // Le lien est déjà mis à jour dans Settings.tsx depuis mapItem.link
    const link = (node?.content?.container?.link || "").trim();

    const _image = getImageFromNode(node as NodeCardApiType);

    const _title = getTitleFromNode(node as NodeCardApiType);

    const _text = getTextFromNode(node as NodeCardApiType);

    const _labels = getLabelsFromNode(node as NodeCardApiType);

    const cardStyle = node.content?.card?.style || {};
    const containerStyle = node.content?.container?.style || {};

    // Configuration du contenu en overlay
    const containerPosition = node.content?.container?.position as ContainerPositionApi;
    const isOverlay = containerPosition === "overlay";
    const textOverlay = node.content?.container?.textOverlay;
    const hasImage = _image.show !== false && _image.src && _image.src.trim() !== "";
    const hasContent = (_title.show !== false && _title.title) || (_text.show !== false && _text.text) || (_labels.show !== false && _labels.labels.length > 0);
    const shouldShowTextOverlay = isOverlay && hasImage && hasContent;

    // Afficher un message si aucun item n'est sélectionné
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
                style={cardStyle}
                id={node?.attributes?.id ?? ""}
            >
                <ViewContentOverlayWrapper >
                    <HasLink link={link ?? ""}>
                        <ViewImage image={_image.src} alt={_image.alt} className={_image.className} style={_image.style} />
                        <ViewContentOverlay position={textOverlay?.position || 'bottom'} background={textOverlay?.background} style={containerStyle}>
                            <ViewTitle show={_title?.show ?? false} title={_title.title ?? ""} className={_title.className ?? ""} style={_title.style ?? {}} />
                            <ViewText show={_text.show ?? false} text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
                            <ViewLabel label={_labels?.labels?.[0] ?? ""} className={_labels?.className ?? ""} style={_labels?.style ?? {}} show={_labels?.show ?? false} />
                        </ViewContentOverlay>
                    </HasLink>
                </ViewContentOverlayWrapper>
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
            style={cardStyle}
            id={node?.attributes?.id ?? ""}
        >
            <ViewContainer 
                position={(containerPosition === "overlay" ? "top" : containerPosition) || "top"} 
                image={
                    _image.show === false ? null : (
                        <ViewContainerImage
                            position={(containerPosition === "overlay" ? "top" : containerPosition) || "top"} 
                            align={(node?.content?.container?.align as ContainerAlign || "start")}
                            ratio={(node?.content?.container?.ratio as ContainerRatio || "1/3")} 
                        >
                            <HasLink link={link ?? ""}>
                                <ViewImage image={_image.src} alt={_image.alt} className={_image.className} style={_image.style} />
                            </HasLink>
                           
                        </ViewContainerImage>
                    )
                }
                content={<ViewContainerContent align={(node?.content?.container?.align as ContainerAlign || "start")} style={containerStyle}>
                    <HasLink link={link}>
                        <ViewTitle show={_title.show} title={_title.title} className={_title.className} style={_title.style} />
                    </HasLink>
                    
                    <ViewText show={_text.show ?? false} text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />

                    <ViewLabel label={_labels?.labels?.[0] ?? ""} className={_labels?.className ?? ""} style={_labels?.style ?? {}} show={_labels?.show ?? false} />
                </ViewContainerContent>} 
            />
        </article>
    );
};

export default View;
