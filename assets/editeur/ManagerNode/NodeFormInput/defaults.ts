import type { CSSProperties } from "react";
import type { NodeFormInputHtmlType } from "./index";

export const nodeFormInputDefaultContent: {
  container: { style: CSSProperties };
  label: { text: string; style: CSSProperties };
  input: {
    style: CSSProperties;
    type: NodeFormInputHtmlType;
    name: string;
    placeholder: string;
    required: boolean;
    defaultValue: string;
  };
} = {
  container: {
    style: {},
  },
  label: {
    text: "Libellé",
    style: {},
  },
  input: {
    style: {},
    type: "text",
    name: "field",
    placeholder: "",
    required: false,
    defaultValue: "",
  },
};
