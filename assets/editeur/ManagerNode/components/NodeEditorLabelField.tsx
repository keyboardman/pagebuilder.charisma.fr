import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { getNodeTypeLabel } from "../../utils/nodeLabel";

export default function NodeEditorLabelField() {
  const { node, onChange } = useNodeBuilderContext();
  const typeLabel = getNodeTypeLabel(node);

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
      <p className="mt-1.5 text-xs text-muted-foreground">
        Type : {typeLabel}. Ce nom s&apos;affiche dans la structure et sur le bandeau du bloc.
      </p>
    </div>
  );
}
