import NodeText from "../NodeText"
import NodeTextIcon from "../NodeTextIcon";
import NodeIcone from "../NodeIcone";
import NodeHeader from "../NodeHeader";
import NodeContainer from "../NodeContainer";
import NodeFlex from "../NodeFlex";
import NodeGrid from "../NodeGrid";
import NodeImage from "../NodeImage";
import NodeTwoColumns from "../NodeTwoColumns";
import NodeVideo from "../NodeVideo";
import NodeYoutube from "../NodeYoutube";
import NodeRoot from "../NodeRoot";
import NodeCard from "../NodeCard";
import NodeCardApi from "../NodeCardApi";
import NodeVideoApi from "../NodeVideoApi";
import NodeButton from "../NodeButton";
import NodeTopButton from "../NodeTopButton";
import NodeHero from "../NodeHero";
import NodeHtml from "../NodeHtml";
import NodeNav from "../NodeNav";
import NodeNavApi from "../NodeNavApi";
import NodeListApi from "../NodeListApi";
import NodeListImage from "../NodeListImage";
import NodeNavItem from "../NodeNavItem";
import NodeSlideshow from "../NodeSlideshow";
import NodeRichText from "../NodeRichText";
import NodeForm from "../NodeForm";
import NodeFormInput from "../NodeFormInput";
import NodeFormSelect from "../NodeFormSelect";
import NodeFormRadio from "../NodeFormRadio";
import NodeAnniversaire from "../NodeAnniversaire";
import NodeVideoHome from "../NodeVideoHome";
import NodePureMusicTopSemaine from "../NodePureMusicTopSemaine";
import type { NodeType } from "../../types/NodeType";

export const NodeRegistry = {
    [NodeHeader.type]: NodeHeader,
    [NodeText.type]: NodeText,
    [NodeTextIcon.type]: NodeTextIcon,
    [NodeIcone.type]: NodeIcone,
    [NodeButton.type]: NodeButton,
    [NodeTopButton.type]: NodeTopButton,
    [NodeRoot.type]: NodeRoot,
    [NodeContainer.type]: NodeContainer,
    [NodeFlex.type]: NodeFlex,
    [NodeHero.type]: NodeHero,
    [NodeGrid.type]: NodeGrid,
    [NodeImage.type]: NodeImage,
    [NodeCard.type]: NodeCard,
    [NodeCardApi.type]: NodeCardApi,
    [NodeTwoColumns.type]: NodeTwoColumns,
    [NodeVideo.type]: NodeVideo,
    [NodeVideoApi.type]: NodeVideoApi,
    [NodeYoutube.type]: NodeYoutube,
    [NodeHtml.type]: NodeHtml,
    [NodeRichText.type]: NodeRichText,
    [NodeNav.type]: NodeNav,
    [NodeNavApi.type]: NodeNavApi,
    [NodeListApi.type]: NodeListApi,
    [NodeListImage.type]: NodeListImage,
    [NodeNavItem.type]: NodeNavItem,
    [NodeSlideshow.type]: NodeSlideshow,
    [NodeForm.type]: NodeForm,
    [NodeFormInput.type]: NodeFormInput,
    [NodeFormSelect.type]: NodeFormSelect,
    [NodeFormRadio.type]: NodeFormRadio,
    [NodeAnniversaire.type]: NodeAnniversaire,
    [NodeVideoHome.type]: NodeVideoHome,
    [NodePureMusicTopSemaine.type]: NodePureMusicTopSemaine,
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