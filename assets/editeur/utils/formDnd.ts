import NodeRegistry from "../ManagerNode/components/NodeRegistry";
import type { NodeID, NodesType } from "../types/NodeType";

export const NODE_FORM_TYPE = "node-form" as const;
export const NODE_ROOT_TYPE = "node-root" as const;
export const NODE_TOP_BUTTON_TYPE = "node-top-button" as const;

export const FORM_FIELD_TYPES = [
  "node-form-input",
  "node-form-select",
  "node-form-radio",
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export function isFormFieldType(type: string): type is FormFieldType {
  return (FORM_FIELD_TYPES as readonly string[]).includes(type);
}

export function hasFormAncestor(
  nodes: NodesType,
  parentId: NodeID | null
): boolean {
  let id: NodeID | null = parentId;
  while (id) {
    const n = nodes[id];
    if (!n) return false;
    if (n.type === NODE_FORM_TYPE) return true;
    id = n.parent?.id ?? null;
  }
  return false;
}

export function isContainerCategoryType(type: string): boolean {
  const cfg = NodeRegistry[type as keyof typeof NodeRegistry];
  return cfg?.button?.category === "container";
}

/** Types autorisés dans une branche déjà sous un NodeForm (hors imbrication de formulaires). */
export function isAllowedInsideFormBranch(type: string): boolean {
  if (isFormFieldType(type)) return true;
  if (type === NODE_FORM_TYPE) return false;
  if (type === "node-button") return true;
  return isContainerCategoryType(type);
}

export function canPlaceUnderParent(
  nodes: NodesType,
  nodeType: string,
  targetParentId: NodeID | null
): boolean {
  if (nodeType === NODE_TOP_BUTTON_TYPE) {
    if (!targetParentId) return false;
    const parentNode = nodes[targetParentId];
    return parentNode?.type === NODE_ROOT_TYPE;
  }

  const inForm = hasFormAncestor(nodes, targetParentId);

  if (nodeType === NODE_FORM_TYPE) {
    return !inForm;
  }

  if (isFormFieldType(nodeType)) {
    return inForm;
  }

  if (inForm) {
    return isAllowedInsideFormBranch(nodeType);
  }

  return true;
}
