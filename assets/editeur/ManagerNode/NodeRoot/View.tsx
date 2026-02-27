import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeRootType } from "./index";
import { useTypographyStyles, usePageTitle } from "./utils";
import Content from "./Content";

const getIframeDocumentFromGlobalContext = (): Document | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = (window as any).__CharismaPageBuilderContext;
  const iframeRef = context?.iframeRef as React.RefObject<HTMLIFrameElement | null> | undefined;
  return iframeRef?.current?.contentDocument ?? null;
};

const View: FC<NodeViewProps|NodeEditProps> = () => {
  const { getChildren, breakpoint, mode } = useAppContext();
  const { node } = useNodeContext();
  const rootNode = node as NodeRootType;

  const _nodes = getChildren(node.id, "main");

  // Mettre à jour le titre de la page
  usePageTitle(rootNode.content?.title);

  // En mode PREVIEW, utiliser l'iframe document comme en mode EDIT
  // En mode VIEW, utiliser window.document
  const targetDoc = mode === APP_MODE.PREVIEW
    ? getIframeDocumentFromGlobalContext()
    : mode === APP_MODE.VIEW
    ? window.document
    : null;

  // Injecter les styles dans le head du document courant en dernier pour surcharger index.css
  useTypographyStyles(targetDoc, rootNode.content?.defaultStyles, true);

  return <Content nodes={_nodes} nodeId={node.id} breakpoint={breakpoint} />;
}

export default View;