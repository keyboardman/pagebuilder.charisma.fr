import { type CSSProperties, type FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Size2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Form from "../../components/form";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeFlexType, FlexDirection, FlexJustify, FlexAlign, FlexWrap } from "./index";

const DIRECTION_OPTIONS: { value: FlexDirection; label: string }[] = [
  { value: "row", label: "Row" },
  { value: "row-reverse", label: "Row reverse" },
  { value: "column", label: "Column" },
  { value: "column-reverse", label: "Column reverse" },
];

const JUSTIFY_OPTIONS: { value: FlexJustify; label: string }[] = [
  { value: "flex-start", label: "Début" },
  { value: "center", label: "Centre" },
  { value: "flex-end", label: "Fin" },
  { value: "space-between", label: "Space between" },
  { value: "space-around", label: "Space around" },
  { value: "space-evenly", label: "Space evenly" },
];

const ALIGN_OPTIONS: { value: FlexAlign; label: string }[] = [
  { value: "flex-start", label: "Début" },
  { value: "center", label: "Centre" },
  { value: "flex-end", label: "Fin" },
  { value: "stretch", label: "Stretch" },
  { value: "baseline", label: "Baseline" },
];

const WRAP_OPTIONS: { value: FlexWrap; label: string }[] = [
  { value: "nowrap", label: "No wrap" },
  { value: "wrap", label: "Wrap" },
  { value: "wrap-reverse", label: "Wrap reverse" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const flexNode = node as NodeFlexType;
  const options = flexNode?.attributes?.options ?? {};

  const updateOption = <K extends keyof typeof options>(key: K, value: (typeof options)[K]) => {
    onChange({
      ...node,
      attributes: {
        ...flexNode.attributes,
        options: {
          ...options,
          [key]: value,
        },
      },
    });
  };

  const updateStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      attributes: { ...node.attributes, style },
    });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
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

                <div className="mt-2 space-y-2 text-xs">
                  <p className="node-block-title font-medium text-foreground text-sm">Flex</p>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Direction</span>
                    <Form.Select
                      value={options.direction ?? "row"}
                      onChange={(v) => updateOption("direction", v as FlexDirection)}
                      options={DIRECTION_OPTIONS}
                      className="h-7 flex-1 min-w-0 [font-size:0.75rem]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Justify</span>
                    <Form.Select
                      value={options.justify ?? "flex-start"}
                      onChange={(v) => updateOption("justify", v as FlexJustify)}
                      options={JUSTIFY_OPTIONS}
                      className="h-7 flex-1 min-w-0 [font-size:0.75rem]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Align</span>
                    <Form.Select
                      value={options.align ?? "stretch"}
                      onChange={(v) => updateOption("align", v as FlexAlign)}
                      options={ALIGN_OPTIONS}
                      className="h-7 flex-1 min-w-0 [font-size:0.75rem]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Wrap</span>
                    <Form.Select
                      value={options.wrap ?? "nowrap"}
                      onChange={(v) => updateOption("wrap", v as FlexWrap)}
                      options={WRAP_OPTIONS}
                      className="h-7 flex-1 min-w-0 [font-size:0.75rem]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Gap</span>
                    <Form.Input
                      type="number"
                      value={(options.gap ?? 4).toString()}
                      onChange={(value: string) => {
                        const num = parseInt(value, 10);
                        if (!isNaN(num) && num >= 0 && num <= 20) {
                          updateOption("gap", num);
                        }
                      }}
                      className="h-7 flex-1 min-w-0 [font-size:0.75rem]"
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.flex}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.flex}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.flex}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Size2Settings
                themeOverrideSelector={THEME_SELECTORS.flex}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
            </TabsContent>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
