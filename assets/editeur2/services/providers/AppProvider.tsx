import { type FC, type ReactNode, useState, useEffect } from "react";
import { APP_MODE, AppContext, type AppModeType, type BreakpointType } from "./AppContext"
import { type NodeID, type NodeType, type NodesType } from "../../types/NodeType";
import type { FileManagerConfig } from "../../ManagerAsset/types";
import BuilderProvider from "./BuilderProvider";
import nodeHelper from "../../utils/nodeHelper";
import { ThemeProvider } from "./ThemeProvider";


export interface AppProviderProps {
    children: ReactNode;
    json?: string;
    target?: string;
    view?: boolean;
    fileManagerConfig?: FileManagerConfig | null;
    /** Callback appelé quand les nodes changent (intégration embarquée) */
    onSaveCallback?: (nodes: NodesType) => void;
}

const defaultJson =JSON.stringify({
            "cylsqgudkwtz": {
                "id": "cylsqgudkwtz",
                "type": "node-root",
                "parent": null,
                "content": {
                    "title": ""
                }
            }
        });
export const AppProvider: FC<AppProviderProps> = ({ children, json = defaultJson, target, view = false, fileManagerConfig = null, onSaveCallback }: AppProviderProps) => {

    const defaultNodes: NodesType = {
        cylsqgudkwtz: {
            id: "cylsqgudkwtz",
            type: "node-root",
            parent: { id: null, order: 0, zone: "main" },
            content: { title: "" }
        }
    } as NodesType;

    const parseJsonToNodes = (input: string | object | undefined): NodesType => {
        if (!input) return defaultNodes;
        let parsed: unknown = input;
        if (typeof input === "string") {
            const str = input.trim();
            if (str.length < 2) return defaultNodes;
            try {
                parsed = JSON.parse(str);
                while (typeof parsed === "string" && parsed.trim().length > 1) {
                    parsed = JSON.parse(parsed);
                }
            } catch (e) {
                console.warn("AppProvider: parse json error", e);
                return defaultNodes;
            }
        }
        if (typeof parsed !== "object" || parsed === null) return defaultNodes;
        const obj = parsed as Record<string, unknown>;
        if (Object.keys(obj).length === 0) return defaultNodes;
        if (obj.cylsqgudkwtz) return obj as NodesType;
        return { ...defaultNodes, ...obj, cylsqgudkwtz: defaultNodes.cylsqgudkwtz };
    };

    const [nodes, setNodes] = useState<NodesType>(() => parseJsonToNodes(json));

    useEffect(() => {
        const next = parseJsonToNodes(json);
        setNodes((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    }, [json]);

    const [mode, setMode] = useState<AppModeType>(view === false ? APP_MODE.EDIT : APP_MODE.VIEW);

    const [breakpoint, setBreakpoint] = useState<BreakpointType>("desktop");

    const getNode = (id: NodeID): NodeType | null => {
        return nodes[id];
    }

    const getChildren = (parentId: NodeID | null, zone: string) => {
        
        return nodeHelper.getChildren(nodes, parentId, zone)
    }
    
    console.log('AppProvider: nodes', nodes);
    
    return (
        <ThemeProvider>
            <AppContext.Provider value={{
                // nodes
                nodes,
                setNodes,
                getNode,
                getChildren,

                // mode
                mode,
                setMode,

                // breakpoint
                breakpoint,
                setBreakpoint,

                // filemanager
                fileManagerConfig
            }} >
                {mode !== APP_MODE.VIEW ? <BuilderProvider target={target} onSaveCallback={onSaveCallback}>{children}</BuilderProvider> : children}
            </AppContext.Provider>
        </ThemeProvider>
    )
}

export default AppProvider;