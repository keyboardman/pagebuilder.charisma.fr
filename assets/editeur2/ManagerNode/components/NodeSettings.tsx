import { useBuilderContext } from "../../services/providers/BuilderContext";
import NodeRegistry, { isKnownNode } from "./NodeRegistry";
import NodeBuilderProvider from "../../services/providers/NodeBuilderProvider";
import NodeProvider from "../../services/providers/NodeProvider";

function EmptySettings() {
  return false;
}

function NodeSettings() {

  const { nodeSelected } = useBuilderContext();

  if (!nodeSelected) return <EmptySettings />;

  if (!nodeSelected) return <EmptySettings />;

  const _isKnownNode = isKnownNode(nodeSelected);
  if (!_isKnownNode) {
    // Au besoin debug : un node inconnu (ex. plugin non géré)
    console.warn("NodeSettings: type de node inconnu :", _isKnownNode);
    return <EmptySettings />;
  }

  const Component = NodeRegistry[nodeSelected.type]['settings'];

  if (!Component) return <EmptySettings />;

  return <NodeProvider node={nodeSelected} index={nodeSelected.parent?.order}>
    <NodeBuilderProvider>
      <Component />
    </NodeBuilderProvider>
  </NodeProvider>;
}

export default NodeSettings;
