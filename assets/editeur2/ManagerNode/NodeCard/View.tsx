import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeViewProps, type NodeEditProps } from "../NodeConfigurationType";
import { Badge } from "@editeur/components/ui/badge";
import { cn } from "@editeur/lib/utils";
import { Card, CardImage, CardContent } from "@editeur/components/card";
import { Image as ImageIcon } from "lucide-react";
import type { ContainerPosition, ContainerAlign, ContainerRatio } from "./index";
import { styleForView } from "../../utils/styleHelper";

const ratioToClassName: Record<ContainerRatio, string> = {
  "1/4": "w-1/4",
  "1/3": "w-1/3",
  "2/5": "w-2/5",
  "1/2": "w-1/2",
  "2/3": "w-2/3",
  full: "w-full",
};

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
        <img src={image} alt={alt} className={cn("w-full h-full object-cover", className)} style={styleForView(style)} />
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
            style={styleForView(style)}
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
                <Badge key={index} variant="secondary" style={styleForView(style)}>
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

    const position = (node?.content?.container?.position as ContainerPosition) || "top";
    const align = (node?.content?.container?.align as ContainerAlign) || "start";
    const ratio = (node?.content?.container?.ratio as ContainerRatio) || "1/3";
    const imageWidthClass = position === "top" ? "w-full" : ratioToClassName[ratio];

    const imageBlock = show.image === false ? null : (_image.src ? (
        link ? (
            <a href={link} className="block w-full">
                <CardImage src={_image.src} alt={_image.alt ?? ""} className={imageWidthClass} style={styleForView(_image.style ?? {})} />
            </a>
        ) : (
            <CardImage src={_image.src} alt={_image.alt ?? ""} className={imageWidthClass} style={styleForView(_image.style ?? {})} />
        )
    ) : (
        <div className={cn("shrink-0", imageWidthClass)}>
            <ViewImage image={_image.src ?? ""} alt={_image.alt ?? ""} className={_image.className ?? ""} style={_image.style ?? {}} />
        </div>
    ));

    return (
        <Card
            variant={position}
            align={align}
            className={node?.attributes?.className ?? ""}
            style={styleForView(node?.attributes?.style ?? {})}
            id={node?.attributes?.id ?? ""}
            data-ce-id={node.id}
            data-ce-type={node.type}
        >
            {imageBlock}
            <CardContent>
                {show.title !== false && (
                    link ? (
                        <a href={link}>
                            <CardContent.Title text={_title.text ?? ""} className={_title.className ?? ""} style={styleForView(_title.style ?? {})} />
                        </a>
                    ) : (
                        <CardContent.Title text={_title.text ?? ""} className={_title.className ?? ""} style={styleForView(_title.style ?? {})} />
                    )
                )}
                {show.text !== false && (
                    <ViewText text={_text.text ?? ""} className={_text.className ?? ""} style={_text.style ?? {}} />
                )}
                {show.labels !== false && (
                    <ViewLabels labels={_labels.items ?? []} className={_labels.className ?? ""} style={_labels.style ?? {}} />
                )}
            </CardContent>
        </Card>
    );
}

export default View;
