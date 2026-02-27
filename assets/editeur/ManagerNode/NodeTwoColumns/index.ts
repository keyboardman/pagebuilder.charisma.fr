import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { IoSquareOutline } from "react-icons/io5";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";

export const NODE_TWO_COLUMNS_TYPE = "node-two_columns" as const;

export type ColumnWidth = "33-66" | "50-50" | "66-33" | "100-100";

export interface NodeTwoColumnsLayout {
  desktop?: ColumnWidth;
  tablet?: ColumnWidth;
  mobile?: ColumnWidth;
  reverseDesktop?: boolean;
  reverseTablet?: boolean;
  reverseMobile?: boolean;
}

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
  edit: View,
  settings: Settings,
  type: NODE_TWO_COLUMNS_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "2 Columns",
    icon: IoSquareOutline,
    category: 'container',
    order: 1
  },
  default: {
    ...defaultNodeConfiguration.default,
    attributes: {
      options: {fluid: false},
      layout: {
        desktop: "50-50",
        tablet: "50-50",
        mobile: "50-50",
        reverseDesktop: false,
        reverseTablet: false,
        reverseMobile: false
      }
    }
  }
}

export default NodeTwoColumns;