import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { IoSquareOutline } from "react-icons/io5";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import type { NodeTwoColumnsLayout } from "./layout";
import { DEFAULT_LAYOUT } from "./layout";
export type {
  PresetColumnWidth,
  ColumnWidth,
  CustomDesktopPercent,
  NodeTwoColumnsLayout,
  BreakpointKey,
} from "./layout";
export {
  CUSTOM_DESKTOP_STEP,
  CUSTOM_DESKTOP_MIN,
  CUSTOM_DESKTOP_MAX,
  snapCustomDesktopLeft,
  normalizeCustomDesktop,
  DEFAULT_LAYOUT,
} from "./layout";

export const NODE_TWO_COLUMNS_TYPE = "node-two_columns" as const;

export interface NodeTwoColumnsType extends NodeType {
  type: "node-two_columns";
  content?: undefined;
  attributes?: NodeType['attributes'] & {
    options?: {
      fluid?: boolean;
    };
    layout?: NodeTwoColumnsLayout;
  };
};

export const NodeTwoColumns: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_TWO_COLUMNS_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "2 Columns",
    icon: IoSquareOutline,
    category: 'container',
    order: 1,
    tooltip: "Conteneur pour organiser les éléments en 2 colonnes"
  },
  default: {
    ...defaultNodeConfiguration.default,
    attributes: {
      options: { fluid: false },
      layout: { ...DEFAULT_LAYOUT },
    }
  }
}

export default NodeTwoColumns;
