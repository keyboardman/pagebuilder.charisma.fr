import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { useAppContext } from "../../services/providers/AppContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeRootType } from "./index";
import { useBuilderContext } from "../../services/providers/BuilderContext";
import { useTypographyStyles, usePageTitle } from "./utils";
import Content from "./Content";

const Edit: FC<NodeViewProps|NodeEditProps> = () => {
  const { getChildren, breakpoint } = useAppContext();
  const { iframeRef } = useBuilderContext();
  const { node } = useNodeContext();
  const rootNode = node as NodeRootType;

  const _nodes = getChildren(node.id, "main");

  // Mettre à jour le titre de la page
  usePageTitle(rootNode.content?.title);

  // Injecter les styles dans le head du document courant en dernier pour surcharger index.css
  const currentDoc = iframeRef?.current?.contentDocument || null;
  useTypographyStyles(currentDoc, rootNode.content?.defaultStyles, false);

  return <Content nodes={_nodes} nodeId={node.id} breakpoint={breakpoint} />;
}

export default Edit;