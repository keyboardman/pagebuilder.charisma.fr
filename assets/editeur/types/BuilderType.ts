import type { NodeID, NodeType, NodesType } from "./NodeType";
import type { HistoriqueState } from "../services/providers/BuilderProvider";


export type BuilderModeType = "edit" | "preview" | "view";

export type SidebarLeftTab = "blocks" | "structure";

export interface BuilderType {
 
  updateNode: (node: NodeType) => void;
  removeNode: <T extends NodeType>(node: T) => void;
  requestRemoveNode: (node: NodeType) => void;
  duplicateNode: (node: NodeType) => void;
  updateNodes: (newNodes: NodesType) => void;

  // sidebar
  sidebarLeftCollapsed: boolean;
  setSidebarLeftCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarLeftTab: SidebarLeftTab;
  setSidebarLeftTab: React.Dispatch<React.SetStateAction<SidebarLeftTab>>;

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

  // iframe
  iframeRef: React.RefObject<HTMLIFrameElement | null> | null;
  setIframeRef: (ref: React.RefObject<HTMLIFrameElement | null>) => void;
}
