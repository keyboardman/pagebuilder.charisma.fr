import { type FC } from "react";
import NodeCollection from "../components/NodeCollection";
import type { NodesType } from "../../types/NodeType";

const classByType: Record<string, string> = {
  mobile: "max-w-xl",
  tablet: "max-w-3xl",
  desktop: "max-w-7xl",
};

interface NodeRootContentProps {
  nodes: NodesType;
  nodeId: string;
  breakpoint?: string;
}

const Content: FC<NodeRootContentProps> = ({ nodes, nodeId, breakpoint }) => {
  return (
    <>
      <div className="w-full min min-h-screen node-root-content">
        <div className={breakpoint ? `${classByType[breakpoint]} m-auto bg-background transition-all duration-500 ease-in-out`: "max-w-3xl m-auto bg-background transition-all duration-500 ease-in-out"}>
          <div className="min-h-screen" >
            <NodeCollection nodes={nodes} parentId={nodeId} zone="main" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;

