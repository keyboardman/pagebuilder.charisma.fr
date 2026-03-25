import { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeFormSelectType } from "./index";
import { nodeFormSelectDefaultContent } from "./defaults";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const n = node as NodeFormSelectType;

  // Compatibilité avec l’ancienne structure (legacy) : { name, label, required, placeholder, placeholderValue, options }
  const legacy = n.content as any;
  const legacyName = typeof legacy?.name === "string" ? legacy.name : undefined;
  const legacyLabelText = typeof legacy?.label === "string" ? legacy.label : undefined;
  const legacyRequired = typeof legacy?.required === "boolean" ? legacy.required : undefined;
  const legacyPlaceholder = typeof legacy?.placeholder === "string" ? legacy.placeholder : undefined;
  const legacyPlaceholderValue =
    typeof legacy?.placeholderValue === "string" ? legacy.placeholderValue : undefined;
  const legacyOptions = Array.isArray(legacy?.options) ? (legacy.options as any[]) : undefined;

  const merged = {
    container: {
      ...nodeFormSelectDefaultContent.container,
      ...(legacy?.container ?? n.content?.container ?? {}),
    },
    label: {
      ...nodeFormSelectDefaultContent.label,
      text: (n.content?.label?.text ?? legacyLabelText ?? nodeFormSelectDefaultContent.label.text) as string,
      style: {
        ...nodeFormSelectDefaultContent.label.style,
        ...(n.content?.label?.style ?? legacy?.label?.style ?? {}),
      },
    },
    select: {
      ...nodeFormSelectDefaultContent.select,
      name: (n.content?.select?.name ?? legacyName ?? nodeFormSelectDefaultContent.select.name) as string,
      placeholder: (n.content?.select?.placeholder ?? legacyPlaceholder ?? nodeFormSelectDefaultContent.select.placeholder) as string,
      required:
        n.content?.select?.required ?? legacyRequired ?? nodeFormSelectDefaultContent.select.required,
      defaultValue:
        n.content?.select?.defaultValue ??
        legacyPlaceholderValue ??
        nodeFormSelectDefaultContent.select.defaultValue,
      style: {
        ...nodeFormSelectDefaultContent.select.style,
        ...(n.content?.select?.style ?? {}),
      },
      options:
        n.content?.select?.options ??
        (legacyOptions ?? nodeFormSelectDefaultContent.select.options),
    },
  } as NonNullable<NodeFormSelectType["content"]>;
  const selectId = `${n.id}-select`;
  const name = merged.select.name ?? "select";
  const labelText = merged.label.text ?? "";
  const placeholder = merged.select.placeholder?.trim();
  const placeholderValue = merged.select.defaultValue ?? "";
  const selectDefaultValue = merged.select.defaultValue?.trim()
    ? merged.select.defaultValue
    : undefined;

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-form-field ce-form-field-select", node?.attributes?.className)}
      style={styleForView(merged.container?.style)}
    >
      {labelText ? (
        <label
          className="ce-form-label"
          htmlFor={selectId}
          style={styleForView(merged.label?.style)}
        >
          {labelText}
          {merged.select.required ? <span className="ce-form-required"> *</span> : null}
        </label>
      ) : null}
      <select
        id={selectId}
        className="ce-form-control"
        name={name}
        required={!!merged.select.required}
        defaultValue={placeholder ? placeholderValue : selectDefaultValue}
        style={styleForView(merged.select?.style)}
      >
        {placeholder ? (
          <option value={placeholderValue} disabled={!!merged.select.required}>
            {placeholder}
          </option>
        ) : null}
        {(merged.select.options ?? []).map((opt, i) => (
          <option key={`${i}-${opt.value}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default View;
