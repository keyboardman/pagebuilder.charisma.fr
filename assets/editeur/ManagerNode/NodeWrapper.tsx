
import { useAppContext } from "../services/providers/AppContext";
import Node from "./components/Node";

function NodeWrapper() {

    const { getNode } = useAppContext();

    const _node = getNode("cylsqgudkwtz");

    if(!_node) {
        return <div>Node not found</div>
    }

    return <Node node={_node} index={0}/>
}

export default NodeWrapper;