import type { NodeCardApiType } from "./index";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";

export const getLinkFromNode = async (node: NodeCardApiType): Promise<string> => {
    // Si un lien est défini dans container, l'utiliser
    const containerLink = (node?.content?.container?.link || "").trim();
    if (containerLink && containerLink !== "#") {
        return containerLink;
    }

    // Sinon, essayer de récupérer le lien depuis l'API si apiId et itemId sont disponibles
    if (node?.content?.apiId && node?.content?.itemId) {
        try {
            const adapter = apiRegistry.get(node.content.apiId);
            if (adapter) {
                const item = await adapter.fetchItem(node.content.itemId);
                const mappedData = adapter.mapItem(item);
                if (mappedData.link) {
                    return mappedData.link;
                }
            }
        } catch (error) {
            console.warn("[NodeCardApi] Failed to fetch link from API:", error);
        }
    }

    return containerLink || "#";
}

export const getImageFromNode = (node: NodeCardApiType) => {
    return {
        show: node?.content?.show?.image !== false,
        src: node?.content?.image?.src || "",
        alt: node?.content?.image?.alt || "Image",
        className: node?.content?.image?.className || "",
        style: node?.content?.image?.style || {},
        showPlaceholder: Boolean(node.content?.image?.src && node.content.image.src.trim() !== "") === false,
    }
}

export const getTitleFromNode = (node: NodeCardApiType) => {
    return {
        show: node?.content?.show?.title !== false,
        title: node?.content?.title?.text || "",
        className: node?.content?.title?.className || "",
        style: node?.content?.title?.style || {},
    }
}

export const getTextFromNode = (node: NodeCardApiType) => {
    return {
        show: node?.content?.show?.text !== false,
        text: node?.content?.text?.text || "",
        className: node?.content?.text?.className || "",
        style: node?.content?.text?.style || {},
    }
}

export const getLabelsFromNode = (node: NodeCardApiType) => {
    return {
        show: node?.content?.show?.labels !== false,
        className: node?.content?.labels?.className || "",
        style: node?.content?.labels?.style || {},
        labels: node?.content?.labels?.items || [],
    }
}
