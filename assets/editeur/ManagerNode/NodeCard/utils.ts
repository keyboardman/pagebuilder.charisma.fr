import type { NodeCardType } from "./index";



export const getImageFromNode = (node: NodeCardType) => {
    return {
        show: node?.content?.show?.image !== false,
        src: node?.content?.image?.src || "",
        alt: node?.content?.image?.alt || "Image",
        className: node?.content?.image?.className || "",
        style: node?.content?.image?.style || {},
        showPlaceholder: Boolean(node.content?.image?.src && node.content.image.src.trim() !== "") === false,
    }
}

export const getTitleFromNode = (node: NodeCardType) => {
    return {
        show: node?.content?.show?.title !== false,
        title: node?.content?.title?.text || "",
        className: node?.content?.title?.className || "",
        style: node?.content?.title?.style || {},
    }
}

export const getTextFromNode = (node: NodeCardType) => {
    return {
        show: node?.content?.show?.text !== false,
        text: node?.content?.text?.text || "",
        className: node?.content?.text?.className || "",
        style: node?.content?.text?.style || {},
    }
}

export const getLabelsFromNode = (node: NodeCardType) => {
    return {
        show: node?.content?.show?.labels !== false,
        className: node?.content?.labels?.className || "",
        style: node?.content?.labels?.style || {},
        labels: node?.content?.labels?.items || [],
    }
}
