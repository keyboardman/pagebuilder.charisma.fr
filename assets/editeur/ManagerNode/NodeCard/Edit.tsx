import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps } from "../NodeConfigurationType";
import { cn } from "@/editeur/lib/utils";
import { getImageFromNode, getTitleFromNode, getTextFromNode, getLabelsFromNode } from "./utils";
import type { NodeCardType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { ViewImage, ViewText, ViewLabel } from "./Views/index";
import { EditTitle, EditText } from "./Edits/index";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";


const Edit: FC<NodeViewProps> = () => {

    const { node } = useNodeContext();

    const { onChange } = useNodeBuilderContext();

    const cardStyle = node.content?.card?.style || {};

    const _image = getImageFromNode(node as NodeCardType);

    const _title = getTitleFromNode(node as NodeCardType);

    const _text = getTextFromNode(node as NodeCardType);

    const _labels = getLabelsFromNode(node as NodeCardType);
    
    return (
        <article 
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn(`ce-card-api ce-card-position-${node.content?.container?.position ?? "top"} ce-card-align-${node.content?.container?.align ?? "start"}`, node?.attributes?.className)} 
            id={node?.attributes?.id ?? ""}
            style={cardStyle}
        >   
            <ViewImage
                image={_image.src}
                alt={_image.alt}
                className={cn(`ce-card-api-image ce-card-image-ratio-${node.content?.container?.ratio ?? "1_3"}`, _image.className) }
                style={_image.style}
            />
            <div 
                className={cn(`ce-card-container-content`)}
                style={styleForView(node.content?.container?.style ?? {})}
            >
                <EditTitle
                    show={_title.show}
                    edit={true}
                    title={_title.title}
                    className={_title.className}
                    style={_title.style}
                    onFocus={() => {}}
                    onBlur={(html) => {
                        onChange({
                            ...node,
                            content: {
                                ...node.content,
                                title: { ...node?.content?.title, text: html },
                            },
                        })
                    }}
                    onSelect={() => {}}
                />
                <EditText
                    show={_text.show}
                    edit={true}
                    text={_text.text}
                    className={_text.className}
                    style={_text.style}
                    onFocus={() => {}}
                    onBlur={(html) => {
                        onChange({
                            ...node,
                            content: { ...node.content, text: { ...node?.content?.text, text: html } },
                        })
                    }}
                    onSelect={() => {}}
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

export default Edit;
