import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

type NodeRichTextEditorContextValue = {
  openNodeId: string | null;
  openEditor: (nodeId: string) => void;
  closeEditor: () => void;
  isEditorOpen: (nodeId: string) => boolean;
};

const NodeRichTextEditorContext = createContext<NodeRichTextEditorContextValue | null>(null);

export const NodeRichTextEditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  const openEditor = useCallback((nodeId: string) => {
    setOpenNodeId(nodeId);
  }, []);

  const closeEditor = useCallback(() => {
    setOpenNodeId(null);
  }, []);

  const isEditorOpen = useCallback((nodeId: string) => openNodeId === nodeId, [openNodeId]);

  const value = useMemo(
    () => ({ openNodeId, openEditor, closeEditor, isEditorOpen }),
    [openNodeId, openEditor, closeEditor, isEditorOpen]
  );

  return (
    <NodeRichTextEditorContext.Provider value={value}>{children}</NodeRichTextEditorContext.Provider>
  );
};

export function useNodeRichTextEditor(): NodeRichTextEditorContextValue {
  const ctx = useContext(NodeRichTextEditorContext);
  if (!ctx) {
    throw new Error("useNodeRichTextEditor must be used within NodeRichTextEditorProvider");
  }
  return ctx;
}

export function useNodeRichTextEditorSafe(): NodeRichTextEditorContextValue | null {
  return useContext(NodeRichTextEditorContext);
}
