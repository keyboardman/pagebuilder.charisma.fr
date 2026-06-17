import type { FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Button from "../../components/button";
import Form from "../../components/form";
import { Switch } from "@/editeur/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/editeur/components/ui/table";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Monitor, Tablet, Phone } from "lucide-react";
import type { NodeTwoColumnsType } from "./index";
import type { ColumnWidth, NodeTwoColumnsLayout, PresetColumnWidth } from "./layout";
import {
  CUSTOM_DESKTOP_MIN,
  CUSTOM_DESKTOP_MAX,
  CUSTOM_DESKTOP_STEP,
  DEFAULT_LAYOUT,
  desktopWidthOptions,
  normalizeCustomDesktop,
  presetWidthOptions,
  snapCustomDesktopLeft,
} from "./layout";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const twoColumnsNode = node as NodeTwoColumnsType;
  const layout = twoColumnsNode.attributes?.layout ?? DEFAULT_LAYOUT;
  const customDesktop = normalizeCustomDesktop(layout.customDesktop);

  const updateLayout = (updates: Partial<NodeTwoColumnsLayout>) => {
    onChange({
      ...node,
      attributes: {
        ...twoColumnsNode.attributes,
        layout: { ...layout, ...updates },
      } as NodeTwoColumnsType["attributes"],
    });
  };

  const updateAttributes = (
    patch: Partial<NonNullable<NodeTwoColumnsType["attributes"]>>
  ) => {
    onChange({
      ...node,
      attributes: { ...node.attributes, ...patch },
    });
  };

  const handleDesktopWidthChange = (value: ColumnWidth) => {
    const updates: Partial<NodeTwoColumnsLayout> = { desktop: value };
    if (value === "custom" && !layout.customDesktop) {
      updates.customDesktop = normalizeCustomDesktop({ left: 50, right: 50 });
    }
    updateLayout(updates);
  };

  return (
    <NodeSettingsWrapper
      header={
        <>
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes) => updateAttributes(attributes)}
          />
          <Button
            onClick={() =>
              updateAttributes({
                options: {
                  ...node.attributes?.options,
                  fluid: !(node.attributes?.options?.fluid ?? false),
                },
              })
            }
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
                  <TableCell className="node-block-title py-1 px-2 text-xs">Col.</TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.desktop || "50-50"}
                      onChange={(value) => handleDesktopWidthChange(value as ColumnWidth)}
                      options={desktopWidthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.tablet || "50-50"}
                      onChange={(value) => updateLayout({ tablet: value as PresetColumnWidth })}
                      options={presetWidthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Form.Select
                      value={layout.mobile || "50-50"}
                      onChange={(value) => updateLayout({ mobile: value as PresetColumnWidth })}
                      options={presetWidthOptions}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                </TableRow>
                {layout.desktop === "custom" && (
                  <TableRow className="border-border/50">
                    <TableCell className="node-block-title py-1 px-2 text-xs">%</TableCell>
                    <TableCell className="py-2 px-2" colSpan={3}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs tabular-nums w-16 shrink-0 text-muted-foreground">
                          G. {customDesktop.left}%
                        </span>
                        <input
                          type="range"
                          min={CUSTOM_DESKTOP_MIN}
                          max={CUSTOM_DESKTOP_MAX}
                          step={CUSTOM_DESKTOP_STEP}
                          value={customDesktop.left}
                          onChange={(e) => {
                            const left = snapCustomDesktopLeft(Number(e.target.value));
                            updateLayout({ customDesktop: { left, right: 100 - left } });
                          }}
                          className="flex-1 h-1.5 cursor-pointer accent-primary"
                          aria-label="Répartition colonne gauche"
                        />
                        <span className="text-xs tabular-nums w-16 shrink-0 text-right text-muted-foreground">
                          D. {customDesktop.right}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="border-border/50">
                  <TableCell className="node-block-title py-1 px-2 text-xs">Inv.</TableCell>
                  {(["reverseDesktop", "reverseTablet", "reverseMobile"] as const).map((key) => (
                    <TableCell key={key} className="py-1 px-2 text-center">
                      <Switch
                        checked={layout[key] || false}
                        onCheckedChange={(checked) => updateLayout({ [key]: checked })}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      }
      content={
        <>
          <Background2Settings
            themeOverrideSelector={THEME_SELECTORS.twoColumns}
            style={node.attributes?.style || {}}
            onChange={(style) => updateAttributes({ style })}
          />
          <Border2Settings
            themeOverrideSelector={THEME_SELECTORS.twoColumns}
            style={node.attributes?.style || {}}
            onChange={(style) => updateAttributes({ style })}
          />
          <Spacing2Settings
            themeOverrideSelector={THEME_SELECTORS.twoColumns}
            style={node.attributes?.style || {}}
            onChange={(style) => updateAttributes({ style })}
          />
        </>
      }
    />
  );
};

export default Settings;
