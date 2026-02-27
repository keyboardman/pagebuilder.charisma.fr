import type { NodeID, NodeType, NodesType } from "./NodeType";
import type { HistoriqueState } from "../services/providers/BuilderProvider";


export type BuilderModeType = "edit" | "preview" | "view";

export interface BuilderType {
 
  updateNode: (node: NodeType) => void;
  removeNode: <T extends NodeType>(node: T) => void;
  duplicateNode: (node: NodeType) => void;
  updateNodes: (newNodes: NodesType) => void;

  // sidebar
  sidebarLeftCollapsed: boolean;
  setSidebarLeftCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  // historiques
  historiques: HistoriqueState;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  selected: NodeID | null;
  setSelected: (selected: NodeID | null) => void;
  nodeSelected: NodeType|null;

  save: () => void;

  // autosave
  isAutoSaveActive: boolean;

  // iframe
  iframeRef: React.RefObject<HTMLIFrameElement | null> | null;
  setIframeRef: (ref: React.RefObject<HTMLIFrameElement | null>) => void;
}
