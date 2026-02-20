import { type FC } from "react";
import {
  Base2Settings,
  Border2Settings,
  Background2Settings,
  Spacing2Settings,
  Size2Settings,
} from "../Settings";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@editeur/components/ui/tabs";
import type {
  NodeHeroType,
  ContainerImageAlignHorizontal,
  ContainerImageAlignVertical,
} from "./types";

const ALIGN_H_OPTIONS: { value: ContainerImageAlignHorizontal; label: string }[] = [
  { value: "start", label: "Début" },
  { value: "center", label: "Centre" },
  { value: "end", label: "Fin" },
];

const ALIGN_V_OPTIONS: { value: ContainerImageAlignVertical; label: string }[] = [
  { value: "top", label: "Haut" },
  { value: "middle", label: "Milieu" },
  { value: "bottom", label: "Bas" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const containerNode = node as NodeHeroType;
  const options = containerNode?.attributes?.options ?? {};
  const dropzoneStyle = options.dropzoneStyle ?? {};

  const updateOption = <K extends keyof typeof options>(key: K, value: (typeof options)[K]) => {
    onChange({
      ...node,
      attributes: {
        ...containerNode.attributes,
        options: {
          ...options,
          [key]: value,
        },
      },
    });
  };

  const updateDropzoneStyle = (style: React.CSSProperties) => {
    updateOption("dropzoneStyle", { ...dropzoneStyle, ...style });
  };

  return (
    <Tabs defaultValue="image" className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
            <TabsList className="mt-2 w-full justify-center">
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="dropzone">Zone de dépôt</TabsTrigger>
            </TabsList>
          </>
        }
        content={
          <>
            <TabsContent value="image" className="mt-2">
              <div className="space-y-2 text-xs">
                <p className="node-block-title font-medium text-foreground text-sm">Container image</p>

                <Form.Group className="mb-0">
                  <Form.Label text="Source image" />
                  <InputFile
                    type="text"
                    value={options.src ?? ""}
                    onChange={(value: string) => updateOption("src", value)}
                    typeMedia="image"
                    className="h-7 text-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Label text="Ratio (ex. 16/9, 4/3, 1)" />
                  <Form.Input
                    type="text"
                    value={options.ratio ?? "16/9"}
                    onChange={(value) => updateOption("ratio", value)}
                    className="h-7 text-sm"
                  />
                </Form.Group>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-20 shrink-0 text-foreground text-sm">Align. H</span>
                  <Form.Select
                    value={options.alignHorizontal ?? "center"}
                    onChange={(v) => updateOption("alignHorizontal", v as ContainerImageAlignHorizontal)}
                    options={ALIGN_H_OPTIONS}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-20 shrink-0 text-foreground text-sm">Align. V</span>
                  <Form.Select
                    value={options.alignVertical ?? "middle"}
                    onChange={(v) => updateOption("alignVertical", v as ContainerImageAlignVertical)}
                    options={ALIGN_V_OPTIONS}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <Border2Settings
                  style={node.attributes?.style ?? {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, style },
                    })
                  }
                />
                <Spacing2Settings
                  style={node.attributes?.style ?? {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, style },
                    })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="dropzone" className="mt-2">
              <div className="space-y-2 text-xs">
                <p className="node-block-title font-medium text-foreground text-sm">Zone de dépôt</p>
                <Background2Settings style={dropzoneStyle} onChange={updateDropzoneStyle} />
                <Spacing2Settings style={dropzoneStyle} onChange={updateDropzoneStyle} />
                <Size2Settings style={dropzoneStyle} onChange={updateDropzoneStyle} />
              </div>
            </TabsContent>
          </>
        }
      />
    </Tabs>
  );
};

export default Settings;
