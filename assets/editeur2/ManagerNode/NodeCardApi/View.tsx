import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps, type NodeEditProps } from "../NodeConfigurationType";
import type { NodeCardApiType } from "./index";
import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";
import type { ContainerAlign, ContainerRatio } from "../NodeCard";
import type { ContainerPositionApi } from "./index";
import { Card, CardImage, CardContent } from "@editeur/components/card";
import { ViewTitle } from "./ViewTitle";
import { ViewText } from "./ViewText";
import { ViewLabel } from "./ViewLabel";
import { ViewImage } from "./ViewImage";
import { ViewEmptyApi } from "./ViewEmptyApi";
import HasLink from "./HasLink";
import { ViewContentOverlay } from "./ViewContentOverlay";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const ratioToClassName: Record<ContainerRatio, string> = {
  "1/4": "w-1/4",
  "1/3": "w-1/3",
  "2/5": "w-2/5",
  "1/2": "w-1/2",
  "2/3": "w-2/3",
  full: "w-full",
};

const overlayPositionToAlign: Record<"bottom" | "top" | "center", "end" | "start" | "center"> = {
  bottom: "end",
  top: "start",
  center: "center",
};

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
        return <ViewEmptyApi className={node?.attributes?.className ?? ""} style={styleForView(node?.attributes?.style ?? {})} />;
    }

    // Si textOverlay est activé, afficher l'image en plein avec le contenu en overlay
    if (shouldShowTextOverlay) {
        const overlayPos = (textOverlay?.position === "top" || textOverlay?.position === "center" ? textOverlay.position : "bottom") as "bottom" | "top" | "center";
        const overlayAlign = overlayPositionToAlign[overlayPos];
        return (
            <Card
                variant="overlay"
                align={overlayAlign}
                className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
                style={styleForView(cardStyle)}
                id={node?.attributes?.id ?? ""}
                data-ce-id={node.id}
                data-ce-type={node.type}
            >
                <HasLink link={link ?? ""}>
                    <CardImage src={_image.src} alt={_image.alt ?? ""} style={styleForView(_image.style)} />
                    <ViewContentOverlay position={textOverlay?.position || "bottom"} background={textOverlay?.background} style={styleForView(containerStyle)}>
                        <ViewTitle show={_title?.show ?? false} title={_title.title ?? ""} className={_title.className ?? ""} style={styleForView(_title.style ?? {})} />
                        <ViewText show={_text.show ?? false} text={_text.text ?? ""} className={_text.className ?? ""} style={styleForView(_text.style ?? {})} />
                        <ViewLabel label={_labels?.labels?.[0] ?? ""} className={_labels?.className ?? ""} style={styleForView(_labels?.style ?? {})} show={_labels?.show ?? false} />
                    </ViewContentOverlay>
                </HasLink>
            </Card>
        );
    }

    // Layout classique : image à gauche/droite/en haut avec contenu à côté
    const position = (containerPosition === "overlay" ? "top" : containerPosition) || "top";
    const align = (node?.content?.container?.align as ContainerAlign) || "start";
    const ratio = (node?.content?.container?.ratio as ContainerRatio) || "1/3";
    const imageWidthClass = position === "top" ? "w-full" : ratioToClassName[ratio];

    const imageBlock = _image.show === false ? null : _image.src ? (
        <HasLink link={link ?? ""}>
            <CardImage src={_image.src} alt={_image.alt ?? ""} className={imageWidthClass} style={styleForView(_image.style)} />
        </HasLink>
    ) : (
        <div className={cn("shrink-0", imageWidthClass)}>
            <ViewImage image={_image.src} alt={_image.alt} className={_image.className} style={styleForView(_image.style)} />
        </div>
    );

    return (
        <Card
            variant={position}
            align={align}
            className={cn(node?.attributes?.className ?? "", "overflow-hidden")}
            style={styleForView(cardStyle)}
            id={node?.attributes?.id ?? ""}
            data-ce-id={node.id}
            data-ce-type={node.type}
        >
            {imageBlock}
            <CardContent style={styleForView(containerStyle)}>
                <HasLink link={link ?? ""}>
                    <ViewTitle show={_title.show} title={_title.title} className={_title.className} style={styleForView(_title.style)} />
                </HasLink>
                <ViewText show={_text.show ?? false} text={_text.text ?? ""} className={_text.className ?? ""} style={styleForView(_text.style ?? {})} />
                <ViewLabel label={_labels?.labels?.[0] ?? ""} className={_labels?.className ?? ""} style={styleForView(_labels?.style ?? {})} show={_labels?.show ?? false} />
            </CardContent>
        </Card>
    );
};

export default View;
