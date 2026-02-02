import { type FC, useCallback } from "react";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps } from "../NodeConfigurationType";
import { cn } from "@editeur/lib/utils";
import EditableTitle from "./EditableTitle";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import EditableLabels from "./EditableLabels";
import { Container, ContainerContent, ContainerImage } from "./Container";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";

const preventNavigation: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
};

const Edit: FC<NodeEditProps> = () => {

    const { node } = useNodeContext();

    const { onChange, isSelected } = useNodeBuilderContext();

    const handleChange = useCallback((field: string, value: string) => {
        onChange({
            ...node,
            content: {
                ...node.content,
                [field]: value
            }
        });
    }, [node, onChange]);

    const isEditing = useCallback((element: string) => {
        return isSelected() && node?.content?.selectedElement === element;
    }, [isSelected, node]);

    const link = (node?.content?.container?.link || "").trim();

    const _show = node?.content?.show || {};

    const _image = node?.content?.image || {};

    const _title = node?.content?.title || {};

    const _text = node?.content?.text || {};

    const _labels = node?.content?.labels || {};

    return (
        <article
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn(node?.attributes?.className ?? "")}
            style={node?.attributes?.style ?? {}}
            id={node?.attributes?.id ?? ""}
        >
            <Container 
                position={(node?.content?.container?.position as ContainerPosition || "top")} 
               
                image={
                    <ContainerImage
                        position={(node?.content?.container?.position as ContainerPosition || "top" )} 
                        align={(node?.content?.container?.align as ContainerAlign || "start")}
                        ratio={(node?.content?.container?.ratio as ContainerRatio|| "1/3")} 
                        
                    >
                        {link ? (
                            <a href={link} className="block w-full" onClick={preventNavigation}>
                                <EditableImage
                                    show={_show.image !== false}
                                    src={_image.src}
                                    alt={_image.alt}
                                    className={_image.className}
                                    style={_image.style}
                                    onSelect={() => {
                                        handleChange("selectedElement", "image");
                                    }}
                                />
                            </a>
                        ) : (
                            <EditableImage
                                show={_show.image !== false}
                                src={_image.src}
                                alt={_image.alt}
                                className={_image.className}
                                style={_image.style}
                                onSelect={() => {
                                    handleChange("selectedElement", "image");
                                }}
                            />
                        )}
                    </ContainerImage>
                    
                }
                content={<ContainerContent align={(node?.content?.container?.align as ContainerAlign || "start")}>
                    {link && !isEditing("title") ? (
                        <a href={link} className="block" onClick={preventNavigation}>
                            <EditableTitle
                                show={_show.title !== false}
                                title={_title.text}
                                className={_title.className}
                                style={_title.style}
                                edit={isEditing("title")}
                                placeholder='Votre titre'
                                onFocus={() => {
                                    handleChange("selectedElement", "title");
                                }}
                                onBlur={(html) => {
                                    onChange({
                                        ...node,
                                        content: {
                                            ...node.content,
                                            title: {
                                                ...node?.content?.title,
                                                text: html,
                                            },
                                        },
                                    });
                                }}
                                onSelect={() => {
                                    handleChange("selectedElement", "title");
                                }}
                            />
                        </a>
                    ) : (
                        <EditableTitle
                            show={_show.title !== false}
                            title={_title.text}
                            className={_title.className}
                            style={_title.style}
                            edit={isEditing("title")}
                            placeholder='Votre titre'
                            onFocus={() => {
                                handleChange("selectedElement", "title");
                            }}
                            onBlur={(html) => {
                                onChange({
                                    ...node,
                                    content: {
                                        ...node.content,
                                        title: {
                                            ...node?.content?.title,
                                            text: html,
                                        },
                                    },
                                });
                            }}
                            onSelect={() => {
                                handleChange("selectedElement", "title");
                            }}
                        />
                    )}

                    <EditableText
                        show={_show.text !== false}
                        text={_text.text}
                        className={_text.className}
                        style={_text.style}
                        edit={isEditing('text')}
                        placeholder='votre texte...'
                        onFocus={() => {
                            handleChange("selectedElement", 'text');
                        }}
                        onBlur={(html) => {
                            onChange({
                                ...node,
                                content: {
                                    ...node.content,
                                    text: {
                                        ...node?.content?.text,
                                        text: html,
                                    },
                                },
                            });
                        }}
                        onSelect={() => {
                            handleChange("selectedElement", 'text');
                        }}
                    />
                    <EditableLabels
                        show={_show.labels !== false}
                        className={_labels.className}
                        style={_labels.style}
                        labels={_labels.items}
                        onSelect={() => {
                            handleChange("selectedElement", 'labels');
                        }}
                    />
                </ContainerContent>}
            />


        </article>
    );
};

export default Edit;
