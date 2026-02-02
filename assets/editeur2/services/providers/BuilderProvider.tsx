import { BuilderContext } from "./BuilderContext";
import { type ReactNode, type FC, useState, useEffect, useCallback, useRef } from "react";

import type { NodeID, NodeType, NodesType } from "../../types/NodeType";
import nodeHelper from "../../utils/nodeHelper";
import { useAppContext } from "./AppContext";
import { startAutoSave, type AutoSaveController } from "../autosave";
import { syncRegisteredFontsToDocument } from "../typography";

export interface BuilderContextProviderProps {
  children: ReactNode;
  target?: string;
  /** Appelé quand les nodes changent (intégration sans textarea, ex. pagebuilder) */
  onSaveCallback?: (nodes: import("../../types/NodeType").NodesType) => void;
}

export type HistoriqueEntry = {
  timestamp: number;
  nodes: NodesType;
};

export type HistoriqueState = {
  past: HistoriqueEntry[];
  present: NodesType | null;
  future: HistoriqueEntry[];
};


export const BuilderProvider: FC<BuilderContextProviderProps> = ({
  children,
  target,
  onSaveCallback,
}) => {

  const { nodes, setNodes } = useAppContext();

  const [pendingNodes, setPendingNodes] = useState<NodesType | null>(null);
  const [iframeRef, setInternalIframeRef] = useState<React.RefObject<HTMLIFrameElement | null> | null>(null);

  const [selected, setSelected] = useState<NodeID | null>(null);

  const [sidebarLeftCollapsed, setSidebarLeftCollapsed] = useState<boolean>(false);

  const [historiques, setHistoriques] = useState<HistoriqueState>({
    past: [],
    present: nodes,
    future: [],
  });

  const autoSaveControllerRef = useRef<AutoSaveController | null>(null);
  const nodesRef = useRef<NodesType>(nodes);
  const [isAutoSaveActive, setIsAutoSaveActive] = useState<boolean>(false);

  // ✅ applique la mise à jour après le render
  useEffect(() => {
    if (pendingNodes) {
      setNodes(pendingNodes);
      setPendingNodes(null);
    }
  }, [pendingNodes, setNodes, setPendingNodes]);

  // Mettre à jour la ref des nodes à chaque changement
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // Gestion de l'autosave
  useEffect(() => {
    // Récupérer la configuration d'autosave depuis le contexte global
    const context = (window as any).__CharismaPageBuilderContext;
    const autoSaveConfig = context?.autoSaveConfig;

    if (autoSaveConfig) {
      // Utiliser une ref pour toujours accéder aux nodes les plus récents
      // La fonction getCurrentNodes lit depuis la ref qui est mise à jour à chaque changement de nodes
      const getCurrentNodes = () => nodesRef.current;

      // Démarrer l'autosave avec une fonction qui récupère les nodes actuels depuis la ref
      const controller = startAutoSave(autoSaveConfig, getCurrentNodes);
      autoSaveControllerRef.current = controller;
      setIsAutoSaveActive(true);

      // Stocker le contrôleur dans le contexte global pour permettre l'arrêt depuis registerAutoSave
      if (context) {
        context.autoSaveController = controller;
      }

      // Nettoyer l'autosave lors du démontage
      return () => {
        controller.stop();
        autoSaveControllerRef.current = null;
        setIsAutoSaveActive(false);
        if (context) {
          context.autoSaveController = null;
        }
      };
    } else {
      // Si pas de config, arrêter l'autosave précédent s'il existe
      setIsAutoSaveActive(false);
      if (autoSaveControllerRef.current) {
        autoSaveControllerRef.current.stop();
        autoSaveControllerRef.current = null;
      }
    }
  }, []); // Seulement au montage/démontage - la ref est mise à jour séparément

  const onSave = () => {
    if (onSaveCallback) {
      onSaveCallback(nodes);
    }
    if (target !== undefined) {
      const doc = typeof document !== "undefined" ? document : null;
      const textarea = doc?.getElementById(target) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.value = JSON.stringify(nodes);
      }
    }
  }

  const updateNode = (node: NodeType) => {
    setNodes(nodes => ({ ...nodes, [node.id]: {...nodes[node.id], ...node} }));
  };

  const updateNodes = (newNodes: NodesType) => {    
    setHistoriques(prev => {
      // 🧠 Si c’est le premier état, pas d’historique à créer encore
      if (prev.present === null) {
        return { past: [], present: newNodes, future: [] };
      }

      // 🧠 Sinon, on pousse le présent dans le passé avant d’enregistrer le nouveau
      return {
        past: [...prev.past, { timestamp: Date.now(), nodes: prev.present }],
        present: newNodes,
        future: [],
      };
    });

    setPendingNodes(newNodes);

  };

  const removeNode = useCallback((node: NodeType): void => {
    const _nodes = nodeHelper.removeNode(nodes, node);
    updateNodes(_nodes);
  }, [nodes]);

  const duplicateNode = useCallback((node: NodeType): void => {
    // Créer une copie du nœud avec un nouvel ID et order + 1
    const duplicatedNode = nodeHelper.duplicateNode(node);
    
    // Ajouter le nœud dupliqué dans la structure
    const _nodes = nodeHelper.addNode(nodes, duplicatedNode);
    
    // Mettre à jour l'état (gère automatiquement l'historique via updateNodes)
    updateNodes(_nodes);
    
    // Sélectionner le nœud dupliqué
    setSelected(duplicatedNode.id);
  }, [nodes]);

  // Undo
  const undo = useCallback(() => {
    setHistoriques(prev => {
      if (prev.past.length === 0) return prev;
      const last = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      const newFuture = prev.present
      ? [{ timestamp: Date.now(), nodes: prev.present! }, ...prev.future]: prev.future;
      
      setPendingNodes(last.nodes);

      return {
        past: newPast,
        present: last.nodes,
        future: newFuture,
        };
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setHistoriques(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      const newPast = prev.present
      ? [...prev.past, { timestamp: Date.now(), nodes: prev.present }]: prev.past;
      setPendingNodes(next.nodes);
      return {
        past: newPast,
        present: next.nodes,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = historiques.past.length > 0;
  const canRedo = historiques.future.length > 0;

  const nodeSelected = selected ? nodes[selected] : null;

  return (
    <BuilderContext.Provider
      value={{

        updateNode,
        removeNode,
        duplicateNode,
        updateNodes,

        // historiques
        historiques,
        undo,
        redo,
        canUndo,
        canRedo,

        // sidebar
        sidebarLeftCollapsed,
        setSidebarLeftCollapsed,

        //
        selected,
        setSelected,
        nodeSelected,

        save: onSave,

        // autosave
        isAutoSaveActive,

        // iframe
        iframeRef,
        setIframeRef: (ref: React.RefObject<HTMLIFrameElement | null>) => {
          setInternalIframeRef(ref);

          // Exposer l'iframeRef dans le contexte global pour les API publiques (registerFont, etc.)
          const context = (window as any).__CharismaPageBuilderContext || {};
          context.iframeRef = ref;
          (window as any).__CharismaPageBuilderContext = context;

          const trySync = () => {
            const doc = ref.current?.contentDocument;
            if (doc && doc.head) {
              
              syncRegisteredFontsToDocument(doc);
              return true;
            }
            return false;
          };

          // Essayer immédiatement
          if (!trySync()) {
            
            // Retry après un court délai
            setTimeout(() => {
              if (trySync()) {
                console.log("[Typography] ✅ Retry successful, fonts synced");
              } else {
                console.log("[Typography] ⚠️ Retry failed, document still not ready");
              }
            }, 100);
            
            // Écouter l'événement load de l'iframe
            const iframe = ref.current;
            if (iframe) {
              const onLoad = () => {
                if (trySync()) {
                  iframe.removeEventListener("load", onLoad);
                }
              };
              iframe.addEventListener("load", onLoad);
            }
          }
        }
      }}
    >{children}</BuilderContext.Provider>
  );
};

export default BuilderProvider;
