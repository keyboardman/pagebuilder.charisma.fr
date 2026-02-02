import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps, type NodeEditProps } from "../NodeConfigurationType";
import { Badge } from "@editeur/components/ui/badge";
import { cn } from "@editeur/lib/utils";
import Container, { ContainerImage, ContainerContent } from "./Container";
import { Image as ImageIcon } from "lucide-react";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";

const ViewImage: FC<{
    image: string;
    alt: string;
    className: string;
    style: React.CSSProperties;
}> = ({ image, alt, className, style }) => {
    const showPlaceholder = Boolean(image && image.trim() !== "") === false;
    if (showPlaceholder) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border/50 rounded-lg">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            </div>
        );
    }
    return (
        <img src={image} alt={alt} className={cn("w-full h-full object-cover", className)} style={style} />
    );
}

const ViewTitle: FC<{
    title: string;
    className: string;
    style: React.CSSProperties;
}> = ({ title, className, style }) => {
    return (
        <div
            role="heading"
            aria-level={3}
            dangerouslySetInnerHTML={{ __html: title }}
            className={cn("w-full leading-1.2 text-xl font-bold", className)}
            style={style}
        />
    );
}

const ViewText: FC<{
    text: string;
    className: string;
    style: React.CSSProperties;
}> = ({ text, className, style }) => {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: text }}
            className={cn("text-base/6", className)}
            style={style}
        />
    );
}

const ViewLabels: FC<{
    labels: string[];
    className: string;
    style: React.CSSProperties;
}> = ({ labels, className, style }) => {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {labels.map((label, index) => (
                <Badge key={index} variant="secondary" style={style}>
                    {label}
                </Badge>
            ))}
        </div>
    );
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
    const { node } = useNodeContext();

    const link = (node?.content?.container?.link || "").trim();
    const show = node?.content?.show || {};

    const _image = node?.content?.image || {};

    const _title = node?.content?.title || {};

    const _text = node?.content?.text || {};

    const _labels = node?.content?.labels || {};

    return (
        <article
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={node?.attributes?.className ?? ""}
            style={node?.attributes?.style ?? {}}
            id={node?.attributes?.id ?? ""}
        >
            <Container 
                position={(node?.content?.container?.position as ContainerPosition || "top")} 
                image={
                    show.image === false ? null : (
                        <ContainerImage
                            position={(node?.content?.container?.position as ContainerPosition || "top" )} 
                            align={(node?.content?.container?.align as ContainerAlign || "start")}
                            ratio={(node?.content?.container?.ratio as ContainerRatio || "1/3")} 
                        >
                            {link ? (
                                <a href={link} className="block w-full">
                                    <ViewImage image={_image.src} alt={_image.alt} className={_image.className} style={_image.style} />
                                </a>
                            ) : (
                                <ViewImage image={_image.src} alt={_image.alt} className={_image.className} style={_image.style} />
                            )}
                        </ContainerImage>
                    )
                }
                content={<ContainerContent align={(node?.content?.container?.align as ContainerAlign || "start")}>
                    {show.title === false ? null : (
                        link ? (
                            <a href={link}>
                                <ViewTitle title={_title.text} className={_title.className} style={_title.style} />
                            </a>
                        ) : (
                            <ViewTitle title={_title.text} className={_title.className} style={_title.style} />
                        )
                    )}
                    {show.text === false ? null : (
                        <ViewText text={_text.text} className={_text.className} style={_text.style} />
                    )}
                    {show.labels === false ? null : (
                        <ViewLabels labels={_labels.items} className={_labels.className} style={_labels.style} />
                    )}
                </ContainerContent>} 
            />
        </article>
    );
}

export default View;
