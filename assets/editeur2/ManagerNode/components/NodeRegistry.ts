import NodeText from "./../NodeText"
import NodeHeader from "./../NodeHeader";
import NodeContainer from "./../NodeContainer";
import NodeGrid from "./../NodeGrid";
import NodeImage from "./../NodeImage";
import NodeTwoColumns from "./../NodeTwoColumns";
import NodeVideo from "./../NodeVideo";
import NodeYoutube from "./../NodeYoutube";
import NodeRoot from "./../NodeRoot";
import NodeCard from "./../NodeCard";
import NodeCardApi from "./../NodeCardApi";
import NodeVideoApi from "./../NodeVideoApi";
import type { NodeType } from "../../types/NodeType";

export const NodeRegistry = {
    [NodeHeader.type]: NodeHeader,
    [NodeText.type]: NodeText,
    [NodeRoot.type]: NodeRoot,
    [NodeContainer.type]: NodeContainer,
    [NodeGrid.type]: NodeGrid,
    [NodeImage.type]: NodeImage,
    [NodeCard.type]: NodeCard,
    [NodeCardApi.type]: NodeCardApi,
    [NodeTwoColumns.type]: NodeTwoColumns,
    [NodeVideo.type]: NodeVideo,
    [NodeVideoApi.type]: NodeVideoApi,
    [NodeYoutube.type]: NodeYoutube
}

export type NodeTypeFromRegistry<T extends Record<string, any>> =
  T extends Record<string, infer Component>
    ? Component extends { type: infer U }
      ? { [K in U & string]: Extract<NodeType, { type: K }> }[U & string]
      : never
    : never;

export function isKnownNode(
  n: NodeType
): n is Extract<NodeType, { type: keyof typeof NodeRegistry }> {
  return n.type in NodeRegistry;
}

export default NodeRegistry;