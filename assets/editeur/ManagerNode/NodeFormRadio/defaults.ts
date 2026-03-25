import type { CSSProperties } from "react";
import type { NodeFormRadioOption, NodeFormRadioType } from "./index";

export const nodeFormRadioDefaultContent: NonNullable<NodeFormRadioType["content"]> = {
  container: {
    style: {} as CSSProperties,
  },
  label: {
    text: "Choix",
    style: {} as CSSProperties,
  },
  radio: {
    style: {} as CSSProperties,
    name: "radio",
    required: false,
    orientation: "vertical",
    options: [
      { value: "1", label: "Option 1" } as NodeFormRadioOption,
      { value: "2", label: "Option 2" } as NodeFormRadioOption,
    ],
  },
};
