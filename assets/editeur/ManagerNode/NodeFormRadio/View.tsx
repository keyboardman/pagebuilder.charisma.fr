import { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeFormRadioType } from "./index";
import { nodeFormRadioDefaultContent } from "./defaults";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const n = node as NodeFormRadioType;
  // Compatibilité legacy : ancienne structure `{ name, label, required, orientation, options }`
  const legacy = n.content as any;

  const c = {
    container: {
      ...nodeFormRadioDefaultContent.container,
      ...(legacy?.container ?? {}),
    },
    label: {
      ...nodeFormRadioDefaultContent.label,
      text: legacy?.label?.text ?? legacy?.label ?? nodeFormRadioDefaultContent.label.text,
      style: {
        ...nodeFormRadioDefaultContent.label.style,
        ...(legacy?.label?.style ?? {}),
      },
    },
    radio: {
      ...nodeFormRadioDefaultContent.radio,
      name: legacy?.radio?.name ?? legacy?.name ?? nodeFormRadioDefaultContent.radio.name,
      required:
        legacy?.radio?.required ?? legacy?.required ?? nodeFormRadioDefaultContent.radio.required,
      orientation:
        legacy?.radio?.orientation ?? legacy?.orientation ?? nodeFormRadioDefaultContent.radio.orientation,
      style: {
        ...nodeFormRadioDefaultContent.radio.style,
        ...(legacy?.radio?.style ?? {}),
      },
      options:
        legacy?.radio?.options ??
        legacy?.options ??
        nodeFormRadioDefaultContent.radio.options,
    },
  } as NonNullable<NodeFormRadioType["content"]>;

  const name = c.radio.name;
  const groupLabel = c.label.text;
  const orientation = c.radio.orientation;

  return (
    <fieldset
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn(
        "ce-form-field ce-form-field-radio",
        orientation === "horizontal" && "ce-form-field-radio--horizontal",
        node?.attributes?.className
      )}
      style={styleForView(c.container?.style)}
    >
      {groupLabel ? (
        <legend className="ce-form-legend" style={styleForView(c.label?.style)}>
          {groupLabel}
          {c.radio.required ? <span className="ce-form-required"> *</span> : null}
        </legend>
      ) : null}
      <div className="ce-form-radio-options" style={styleForView(c.radio?.style)}>
        {(c.radio.options ?? []).map((opt, i) => {
          const id = `${n.id}-radio-${i}`;
          return (
            <div key={id} className="ce-form-radio-row">
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                required={!!c.radio.required && i === 0}
              />
              <label className="ce-form-radio-label" htmlFor={id}>
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default View;
