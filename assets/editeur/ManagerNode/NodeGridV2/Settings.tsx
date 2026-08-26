import { type CSSProperties, type FC, useMemo } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Form from "../../components/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/editeur/components/ui/table";
import { Monitor, Tablet, Phone } from "lucide-react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeGridV2Type, NodeGridV2Layout, BreakpointKey } from "./index";
import { buildSpansAfterMergeSelection } from "./layoutHelpers";
import MergeGridPicker from "./MergeGridPicker";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const gridNode = node as NodeGridV2Type;

  const legacyColumns = gridNode?.attributes?.options?.columns ?? 2;
  const legacyRows = gridNode?.attributes?.options?.rows ?? 2;

  const layout: NodeGridV2Layout = gridNode?.attributes?.layout || {
    desktop: { columns: legacyColumns, rows: legacyRows },
    tablet: { columns: legacyColumns, rows: legacyRows },
    mobile: { columns: legacyColumns, rows: legacyRows },
  };

  const updateLayout = (
    breakpoint: BreakpointKey,
    updates: { columns?: number; rows?: number }
  ) => {
    onChange({
      ...node,
      attributes: {
        ...gridNode.attributes,
        layout: {
          ...layout,
          [breakpoint]: {
            ...layout[breakpoint],
            ...updates,
          },
        },
      } as NodeGridV2Type["attributes"],
    });
  };

  const handleMerge = (breakpoint: BreakpointKey, indexA: number, indexB: number) => {
    const newSpans = buildSpansAfterMergeSelection(layout, breakpoint, indexA, indexB);
    if (!newSpans) return;

    onChange({
      ...node,
      attributes: {
        ...gridNode.attributes,
        layout: {
          ...layout,
          spans: Object.keys(newSpans).length > 0 ? newSpans : undefined,
        },
      } as NodeGridV2Type["attributes"],
    });
  };

  const updateStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      attributes: { ...node.attributes, style },
    });

  const desktopCells =
    (layout.desktop?.columns ?? 2) * (layout.desktop?.rows ?? 2);
  const tabletCells =
    (layout.tablet?.columns ?? 2) * (layout.tablet?.rows ?? 2);
  const mobileCells =
    (layout.mobile?.columns ?? 2) * (layout.mobile?.rows ?? 2);

  const hasDifferentCellCount = useMemo(() => {
    const cells = [desktopCells, tabletCells, mobileCells];
    return new Set(cells).size > 1;
  }, [desktopCells, tabletCells, mobileCells]);

  const numInput = (
    value: number,
    min: number,
    max: number,
    onChangeNum: (n: number) => void
  ) => (
    <Form.Input
      type="number"
      value={value.toString()}
      onChange={(value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= min && numValue <= max) {
          onChangeNum(numValue);
        }
      }}
      className="h-7 text-sm"
      min={min}
      max={max}
    />
  );

  const breakpointHeaders = (
    <>
      <TableHead
        className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
        title="Desktop"
      >
        <Monitor className="h-4 w-4 mx-auto" />
      </TableHead>
      <TableHead
        className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
        title="Tablet"
      >
        <Tablet className="h-4 w-4 mx-auto" />
      </TableHead>
      <TableHead
        className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
        title="Mobile"
      >
        <Phone className="h-4 w-4 mx-auto" />
      </TableHead>
    </>
  );

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <TabsList className="mb-3 w-full justify-center">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="container">Container</TabsTrigger>
            </TabsList>
          }
          content={
            <>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes: { className?: string; id?: string }) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, ...attributes },
                    })
                  }
                />

                {hasDifferentCellCount && (
                  <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs">
                    <p className="node-block-title text-amber-700 dark:text-amber-200">
                      D: {desktopCells} · T: {tabletCells} · M: {mobileCells}
                    </p>
                  </div>
                )}

                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="node-block-title text-xs w-14 shrink-0">Gap</span>
                    <Form.Input
                      type="number"
                      value={(gridNode?.attributes?.options?.gap ?? 4).toString()}
                      onChange={(value: string) => {
                        const numValue = parseInt(value, 10);
                        if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
                          onChange({
                            ...node,
                            attributes: {
                              ...gridNode.attributes,
                              options: {
                                ...gridNode.attributes?.options,
                                gap: numValue,
                              },
                            },
                          });
                        }
                      }}
                      className="h-7 text-sm flex-1"
                      min="0"
                      max="20"
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead className="node-block-title py-1.5 px-2 text-xs font-medium" />
                        {breakpointHeaders}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-border/50">
                        <TableCell className="node-block-title py-1 px-2 text-xs">C.</TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.desktop?.columns ?? 2, 1, 12, (n) =>
                            updateLayout("desktop", { columns: n })
                          )}
                        </TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.tablet?.columns ?? 2, 1, 12, (n) =>
                            updateLayout("tablet", { columns: n })
                          )}
                        </TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.mobile?.columns ?? 2, 1, 12, (n) =>
                            updateLayout("mobile", { columns: n })
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-border/50">
                        <TableCell className="node-block-title py-1 px-2 text-xs">L.</TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.desktop?.rows ?? 2, 1, 12, (n) =>
                            updateLayout("desktop", { rows: n })
                          )}
                        </TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.tablet?.rows ?? 2, 1, 12, (n) =>
                            updateLayout("tablet", { rows: n })
                          )}
                        </TableCell>
                        <TableCell className="py-1 px-2">
                          {numInput(layout.mobile?.rows ?? 2, 1, 12, (n) =>
                            updateLayout("mobile", { rows: n })
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <MergeGridPicker layout={layout} onMerge={handleMerge} />
                </div>
              </TabsContent>

              <TabsContent value="container" className="mt-0">
                <Background2Settings
                  themeOverrideSelector={THEME_SELECTORS.gridV2}
                  style={node.attributes?.style || {}}
                  onChange={updateStyle}
                />
                <Border2Settings
                  themeOverrideSelector={THEME_SELECTORS.gridV2}
                  style={node.attributes?.style || {}}
                  onChange={updateStyle}
                />
                <Spacing2Settings
                  themeOverrideSelector={THEME_SELECTORS.gridV2}
                  style={node.attributes?.style || {}}
                  onChange={updateStyle}
                />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
