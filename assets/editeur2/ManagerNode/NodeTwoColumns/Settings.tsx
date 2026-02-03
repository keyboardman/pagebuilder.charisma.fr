import type { FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
} from "../Settings";
import Button from "../../components/button";
import Form from "../../components/form";
import { Switch } from "@editeur/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@editeur/components/ui/table";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Monitor, Tablet, Phone } from "lucide-react";
import type {
  NodeTwoColumnsType,
  ColumnWidth,
  NodeTwoColumnsLayout,
} from "./index";

const widthOptions = [
  { label: "33-66", value: "33-66" },
  { label: "50-50", value: "50-50" },
  { label: "66-33", value: "66-33" },
  { label: "100-100", value: "100-100" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const twoColumnsNode = node as NodeTwoColumnsType;

  const layout: NodeTwoColumnsLayout =
    twoColumnsNode.attributes?.layout || {
      desktop: "50-50",
      tablet: "50-50",
      mobile: "50-50",
      reverseDesktop: false,
      reverseTablet: false,
      reverseMobile: false,
    };

  const updateLayout = (updates: Partial<NodeTwoColumnsLayout>) => {
    onChange({
      ...node,
      attributes: {
        ...twoColumnsNode.attributes,
        layout: { ...layout, ...updates },
      } as NodeTwoColumnsType["attributes"],
    });
  };

  return (
    <NodeSettingsWrapper
      header={
        <>
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, ...attributes },
              })
            }
          />
          <Button
            onClick={() => {
              onChange({
                ...node,
                attributes: {
                  ...node.attributes,
                  options: {
                    ...node.attributes?.options,
                    fluid: !(node.attributes?.options?.fluid ?? false),
                  },
                },
              });
            }}
          >
            {node.attributes?.options?.fluid ? "fluid" : "no-fluid"}
          </Button>

          <div className="mt-2">
            <p className="node-block-title text-sm font-medium mb-1.5">
              Layout des colonnes
            </p>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="node-block-title py-1.5 px-2 text-xs font-medium" />
                  <TableHead className="node-block-title py-1.5 px-2 text-xs font-medium text-center" title="Desktop">
                    <Monitor className="h-4 w-4 mx-auto" />
                  </TableHead>
                  <TableHead className="node-block-title py-1.5 px-2 text-xs font-medium text-center" title="Tablet">
                    <Tablet className="h-4 w-4 mx-auto" />
                  </TableHead>
                  <TableHead className="node-block-title py-1.5 px-2 text-xs font-medium text-center" title="Mobile">
                    <Phone className="h-4 w-4 mx-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/50">
                  <TableCell className="node-block-title py-1 px-2 text-xs">
                  Col.
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.desktop || "50-50"}
                      onChange={(value) =>
                        updateLayout({ desktop: value as ColumnWidth })
                      }
                      options={widthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.tablet || "50-50"}
                      onChange={(value) =>
                        updateLayout({ tablet: value as ColumnWidth })
                      }
                      options={widthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.mobile || "50-50"}
                      onChange={(value) =>
                        updateLayout({ mobile: value as ColumnWidth })
                      }
                      options={widthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="border-border/50">
                  <TableCell className="node-block-title py-1 px-2 text-xs">
                    Inv.
                  </TableCell>
                  <TableCell className="py-1 px-2 text-center">
                    <Switch
                      checked={layout.reverseDesktop || false}
                      onCheckedChange={(checked) =>
                        updateLayout({ reverseDesktop: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2 text-center">
                    <Switch
                      checked={layout.reverseTablet || false}
                      onCheckedChange={(checked) =>
                        updateLayout({ reverseTablet: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2 text-center">
                    <Switch
                      checked={layout.reverseMobile || false}
                      onCheckedChange={(checked) =>
                        updateLayout({ reverseMobile: checked })
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      }
      content={
        <>
          <Background2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Spacing2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
        </>
      }
    />
  );
};

export default Settings;
