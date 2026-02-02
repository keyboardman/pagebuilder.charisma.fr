import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoGridOutline } from "react-icons/io5";

export const NODE_GRID_TYPE = "node-grid" as const;

export interface NodeGridLayout {
    desktop?: {
        columns?: number;
        rows?: number;
    };
    tablet?: {
        columns?: number;
        rows?: number;
    };
    mobile?: {
        columns?: number;
        rows?: number;
    };
}

export interface NodeGridType extends NodeType {
    type: "node-grid";
    content?: undefined;
    isDroppable: true;
    attributes?: NodeType['attributes'] & {
        options?: {
            columns?: number;
            rows?: number;
            gap?: number;
        };
        layout?: NodeGridLayout;
    };
}

export const NodeGrid: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: View,
    settings: Settings,
    type: NODE_GRID_TYPE,
    button: {
        ...defaultNodeConfiguration.button,
        label: "Grid",
        icon: IoGridOutline,
        category: 'container',
        order: 2
    },
    default: {
        ...defaultNodeConfiguration.default,
        attributes: {
            options: {
                columns: 2,
                rows: 2,
                gap: 4
            },
            layout: {
                desktop: {
                    columns: 2,
                    rows: 2
                },
                tablet: {
                    columns: 2,
                    rows: 2
                },
                mobile: {
                    columns: 2,
                    rows: 2
                }
            }
        }
    }
}

export default NodeGrid;
