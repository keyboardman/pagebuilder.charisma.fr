import { useAppContext } from "../../services/providers/AppContext";
import { NodeType } from "../../types/NodeType";
import { IoSquareOutline } from "react-icons/io5";

const ExplorerNode = ({ node }: { node: NodeType }) => {
    console.log(node);
    const title = node.type.replace(/^node-/, "");

    return (
        <>
            <div className="flex items-center justify-start w-full px-1 text-sm transition-colors gap-2">
                <IoSquareOutline />
                <div>{title}</div>
            </div>
            <div>
                <ExplorerNodeCollection node={node} />
            </div>
        </>
    );
};

const ExplorerNodeCollection = ({ node }: { node: NodeType }) => {
    const { getChildren } = useAppContext();
    const children = getChildren(node.id, "main");
    return (
        <div>
            {Object.values(children).map((child) => (
                <ExplorerNode key={child.id} node={child as NodeType} />
            ))}
        </div>
    );
};

const Explorer = () => {
    const { getNode } = useAppContext();
    const _node = getNode("cylsqgudkwtz");
    if (!_node) {
        return <div>Node not found</div>
    }
    return <ExplorerNode node={_node} />
};

export default Explorer;