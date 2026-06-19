import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { getNodeTypeLabel } from "../../utils/nodeLabel";
import { Base2Settings } from "../Settings";
import { NODE_IMAGE_TYPE } from "../NodeImage";
import { NODE_VIDEO_TYPE } from "../NodeVideo";

const NODES_WITH_FIXED_BASE_ATTRIBUTES = new Set<string>([NODE_IMAGE_TYPE, NODE_VIDEO_TYPE]);

export default function NodeEditorLabelField() {
  const { node, onChange } = useNodeBuilderContext();
  const typeLabel = getNodeTypeLabel(node);
  const showBaseAttributes = NODES_WITH_FIXED_BASE_ATTRIBUTES.has(node.type);

  return (
    <div className="shrink-0 rounded-lg border border-border/50 bg-card p-3 shadow-sm">
      <Form.Group className="mb-0">
        <Form.Label text="Nom dans l'éditeur" className="text-foreground" />
        <Form.Input
          type="text"
          value={node.editorLabel ?? ""}
          placeholder={typeLabel}
          onChange={(value) => {
            const trimmed = value?.trim() ?? "";
            onChange({
              ...node,
              editorLabel: trimmed.length > 0 ? trimmed : undefined,
            });
          }}
          className="h-8 text-sm"
        />
      </Form.Group>
      {showBaseAttributes ? (
        <Base2Settings
          attributes={node.attributes}
          onChange={(attributes) =>
            onChange({
              ...node,
              attributes: { ...node.attributes, ...attributes },
            })
          }
        />
      ) : null}
      <p className="mt-1.5 text-xs text-muted-foreground">
        Type : {typeLabel}. Ce nom s&apos;affiche dans la structure et sur le bandeau du bloc.
      </p>
    </div>
  );
}
