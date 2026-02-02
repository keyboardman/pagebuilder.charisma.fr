
import { useAppContext } from "../services/providers/AppContext";
import Node from "./components/Node";

function NodeWrapper() {

    const { getNode } = useAppContext();

    const _node = getNode("cylsqgudkwtz");

    console.log('NodeWrapper: _node', _node);

    if(!_node) {
        return <div>Node not found</div>
    }

    return <Node node={_node} index={0}/>
}

export default NodeWrapper;