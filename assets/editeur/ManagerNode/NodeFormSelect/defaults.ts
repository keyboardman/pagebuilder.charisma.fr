import type { CSSProperties } from "react";
import type { NodeFormOption } from "./index";

export const nodeFormSelectDefaultContent: {
  container: { style: CSSProperties };
  label: { text: string; style: CSSProperties };
  select: {
    style: CSSProperties;
    name: string;
    placeholder: string;
    required: boolean;
    defaultValue: string;
    options: NodeFormOption[];
  };
} = {
  container: { style: {} },
  label: { text: "Liste", style: {} },
  select: {
    style: {},
    name: "select",
    placeholder: "",
    required: false,
    defaultValue: "",
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ],
  },
};
