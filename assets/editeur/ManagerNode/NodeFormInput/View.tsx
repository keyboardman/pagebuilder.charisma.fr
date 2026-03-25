import { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeFormInputType } from "./index";
import { nodeFormInputDefaultContent } from "./defaults";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const n = node as NodeFormInputType;
  const c = {
    ...nodeFormInputDefaultContent,
    ...n.content,
    container: { ...nodeFormInputDefaultContent.container, ...(n.content?.container ?? {}) },
    label: { ...nodeFormInputDefaultContent.label, ...(n.content?.label ?? {}) },
    input: { ...nodeFormInputDefaultContent.input, ...(n.content?.input ?? {}) },
  } as NonNullable<NodeFormInputType["content"]>;
  const inputId = `${n.id}-input`;
  const name = c.input.name ?? "field";
  const labelText = c.label.text ?? "";
  const inputType = c.input.type ?? "text";

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-form-field ce-form-field-input", node?.attributes?.className)}
      style={styleForView(c.container?.style)}
    >
      {labelText ? (
        <label className="ce-form-label" htmlFor={inputId} style={styleForView(c.label?.style)}>
          {labelText}
          {c.input.required ? <span className="ce-form-required"> *</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        className="ce-form-control"
        type={inputType}
        name={name}
        placeholder={c.input.placeholder || undefined}
        defaultValue={c.input.defaultValue || undefined}
        required={!!c.input.required}
        style={styleForView(c.input?.style)}
      />
    </div>
  );
};

export default View;
