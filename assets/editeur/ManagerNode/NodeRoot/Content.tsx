import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import type { NodesType } from "../../types/NodeType";
import type { NodeRootBackground } from "./index";
import PageBackground from "./PageBackground";
import {
  getNodeRootWrapperStyle,
  hasCustomNodeRootBackground,
} from "./backgroundUtils";

const classByType: Record<string, string | undefined> = {
  mobile: "max-w-sm",
  tablet: "max-w-lg",
  desktop: undefined,
};

/** Gouttière horizontale mobile / tablette (1rem / 16px, équivalent Tailwind px-4). */
const HORIZONTAL_GUTTER = "px-4";
const VIEWPORT_HORIZONTAL_GUTTER = "max-lg:px-4";

interface NodeRootContentProps {
  nodes: NodesType;
  nodeId: string;
  breakpoint?: string;
  background?: NodeRootBackground;
}

const Content: FC<NodeRootContentProps> = ({
  nodes,
  nodeId,
  breakpoint,
  background,
}) => {
  const hasCustomBackground = hasCustomNodeRootBackground(background);
  const wrapperStyle = getNodeRootWrapperStyle(background);

  const horizontalGutter =
    breakpoint === "mobile" || breakpoint === "tablet"
      ? HORIZONTAL_GUTTER
      : VIEWPORT_HORIZONTAL_GUTTER;

  const innerColumnBase = breakpoint
    ? `${classByType[breakpoint]} m-auto ${horizontalGutter} transition-all duration-500 ease-in-out`
    : `max-w-3xl m-auto ${horizontalGutter} transition-all duration-500 ease-in-out`;
  const innerColumnClass = hasCustomBackground
    ? innerColumnBase
    : `${innerColumnBase} bg-background`;

  return (
    <div
      className="relative w-full min-h-screen node-root-content"
      style={wrapperStyle}
    >
      <PageBackground background={background} />
      <div className={`relative z-10 ${innerColumnClass}`}>
        <div className="min-h-screen">
          <NodeCollection nodes={nodes} parentId={nodeId} zone="main" />
        </div>
      </div>
    </div>
  );
};

export default Content;
