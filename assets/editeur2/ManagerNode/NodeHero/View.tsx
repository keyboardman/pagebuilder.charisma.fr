import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type {
  NodeHeroType,
  NodeHeroOptions,
  ContainerImageAlignHorizontal,
  ContainerImageAlignVertical,
} from "./types";
import { cn } from "@editeur/lib/utils";

const defaultOptions: NodeHeroOptions = {
  src: "",
  ratio: "16/9",
  alignHorizontal: "center",
  alignVertical: "middle",
};

function toJustifyContent(align: ContainerImageAlignHorizontal): React.CSSProperties["justifyContent"] {
  switch (align) {
    case "start":
      return "flex-start";
    case "center":
      return "center";
    case "end":
      return "flex-end";
    default:
      return "center";
  }
}

function toAlignItems(align: ContainerImageAlignVertical): React.CSSProperties["alignItems"] {
  switch (align) {
    case "top":
      return "flex-start";
    case "middle":
      return "center";
    case "bottom":
      return "flex-end";
    default:
      return "center";
  }
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const { mode } = useAppContext();
  const isEditMode = mode === APP_MODE.EDIT;

  const containerNode = node as NodeHeroType;
  const options = { ...defaultOptions, ...containerNode?.attributes?.options };

  const children = getChildren("main");

  const ratio = options.ratio && options.ratio.trim() !== "" ? options.ratio : "16/9";
  const src = options.src?.trim() ?? "";

  const containerStyle: React.CSSProperties = {
    width: "100%",
    position: "relative",
    ...(isEditMode ? {} : { aspectRatio: ratio }),
    ...(src
      ? {
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
    ...styleForView(node?.attributes?.style),
  };

  const contentBlockStyleFromOptions = options.dropzoneStyle ?? {};
  const overlayStyle: React.CSSProperties = {
    ...(isEditMode ? {} : { position: "absolute", inset: 0 }),
    display: "flex",
    justifyContent: toJustifyContent(options.alignHorizontal ?? "center"),
    alignItems: toAlignItems(options.alignVertical ?? "middle"),
  };

  const contentBlockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    ...styleForView(contentBlockStyleFromOptions),
  };

  const dataAttributes = Object.entries(containerNode?.attributes?.options ?? {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`data-ce-${key}`]: value,
    }),
    {}
  );

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn(node?.attributes?.className, "overflow-hidden")}
      style={containerStyle}
      {...dataAttributes}
    >
      <div style={overlayStyle}>
        <div style={contentBlockStyle}>
          <NodeCollection nodes={children} parentId={node.id} zone="main" />
        </div>
      </div>
    </div>
  );
};

export default View;
