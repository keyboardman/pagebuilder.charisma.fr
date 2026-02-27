import { createContext, useContext } from "react";
import { type NodeID, type NodeType, type NodesType } from "../../types/NodeType";
import type { FileManagerConfig } from "../../ManagerAsset/types";

export type AppModeType = "edit" | "preview" | "view";
export type BreakpointType = "mobile" | "tablet" | "desktop";

export interface AppType {
    nodes: NodesType;
    setNodes: React.Dispatch<React.SetStateAction<NodesType>>;
    getNode: (id: NodeID) => NodeType | null;
    getChildren: (parentId: NodeID | null, zone: string) => NodesType;
    mode: AppModeType,
    setMode: (mode: AppModeType) => void;
    breakpoint: BreakpointType;
    setBreakpoint: React.Dispatch<React.SetStateAction<BreakpointType>>;
    fileManagerConfig: FileManagerConfig | null;
}

export const APP_MODE = {
    EDIT: "edit" as AppModeType,
    PREVIEW: "preview" as AppModeType,
    VIEW: "view" as AppModeType
}

export const AppContext = createContext<AppType | null>(null);

export const useAppContext = (): AppType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
