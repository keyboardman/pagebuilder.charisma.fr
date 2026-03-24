import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps } from "../NodeConfigurationType";
import { cn } from "@/editeur/lib/utils";
import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";
import type { NodeCardApiType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { ViewImage, ViewTitle, ViewText, ViewLabel, ViewEmptyApi, HasLink } from "./Views";

const View: FC<NodeViewProps> = () => {

    const { node } = useNodeContext();

    const cardStyle = node.content?.card?.style || {};

    const link = (node?.content?.container?.link || "").trim();

    const _image = getImageFromNode(node as NodeCardApiType);

    const _title = getTitleFromNode(node as NodeCardApiType);

    const _text = getTextFromNode(node as NodeCardApiType);

    const _labels = getLabelsFromNode(node as NodeCardApiType);
    
    if(node.content?.apiId === "" || node.content?.itemId === "") {
        return <ViewEmptyApi className={node?.attributes?.className ?? ""} style={cardStyle} />;
    }

    return (
        <article 
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn(`ce-card-api ce-card-api-position-${node.content?.container?.position ?? "top"} ce-card-api-align-${node.content?.container?.align ?? "start"}`, node?.attributes?.className)} 
            id={node?.attributes?.id ?? ""}
            style={cardStyle}
        >   
            <ViewImage
                image={_image.src}
                alt={_image.alt}
                className={cn(`ce-card-api-image ce-card-api-image-ratio-${node.content?.container?.ratio ?? "1_3"}`, _image.className) }
                style={_image.style}
                onClick={() => {
                    if (link) {
                        window.open(link, "_blank");
                    }
                }}
            />
            <div 
                className={cn(`ce-card-api-container-content`)}
                style={styleForView(node.content?.container?.style ?? {})}
            >
                <HasLink link={link}>                
                    <ViewTitle
                        show={_title.show}
                        title={_title.title}
                        className={_title.className}
                        style={_title.style}
                    />
                </HasLink>
                <ViewText
                    show={_text.show}
                    text={_text.text}
                    className={_text.className}
                    style={_text.style}
                />
                <ViewLabel
                    label={_labels.labels?.[0] ?? ''}
                    className={_labels.className}
                    style={_labels.style}
                    show={_labels.show}
                />
            </div>
        </article>
    );
};

export default View;
