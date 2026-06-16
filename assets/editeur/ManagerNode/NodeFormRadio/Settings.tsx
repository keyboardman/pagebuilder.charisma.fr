import { type FC, type CSSProperties } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import Form from "../../components/form";
import type {
  NodeFormRadioOrientation,
  NodeFormRadioOption,
  NodeFormRadioType,
} from "./index";
import { nodeFormRadioDefaultContent } from "./defaults";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Text2Settings, THEME_SELECTORS } from "../Settings";
import { Button } from "@/editeur/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { IoClose } from "react-icons/io5";

const orientationOptions: { value: NodeFormRadioOrientation; label: string }[] = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const field = node as NodeFormRadioType;
  // Compatibilité legacy : ancienne structure `{ name, label, required, orientation, options }`
  const legacy = field.content as any;

  const content = {
    container: {
      ...nodeFormRadioDefaultContent.container,
      ...(legacy?.container ?? {}),
    },
    label: {
      ...nodeFormRadioDefaultContent.label,
      text: legacy?.label?.text ?? legacy?.label ?? nodeFormRadioDefaultContent.label.text,
      style: {
        ...nodeFormRadioDefaultContent.label.style,
        ...(legacy?.label?.style ?? {}),
      },
    },
    radio: {
      ...nodeFormRadioDefaultContent.radio,
      name: legacy?.radio?.name ?? legacy?.name ?? nodeFormRadioDefaultContent.radio.name,
      required:
        legacy?.radio?.required ?? legacy?.required ?? nodeFormRadioDefaultContent.radio.required,
      orientation:
        legacy?.radio?.orientation ?? legacy?.orientation ?? nodeFormRadioDefaultContent.radio.orientation,
      style: {
        ...nodeFormRadioDefaultContent.radio.style,
        ...(legacy?.radio?.style ?? {}),
      },
      options:
        legacy?.radio?.options ??
        legacy?.options ??
        nodeFormRadioDefaultContent.radio.options,
    },
  } as NonNullable<NodeFormRadioType["content"]>;

  const patchContent = (next: NonNullable<NodeFormRadioType["content"]>) =>
    onChange({ ...node, content: next });

  const setContainerStyle = (style: CSSProperties) =>
    patchContent({ ...content, container: { ...content.container, style } });

  const setLabelText = (text: string) =>
    patchContent({ ...content, label: { ...content.label, text } });

  const setLabelStyle = (style: CSSProperties) =>
    patchContent({ ...content, label: { ...content.label, style } });

  const setRadioName = (name: string) =>
    patchContent({ ...content, radio: { ...content.radio, name } });

  const setRadioRequired = (required: boolean) =>
    patchContent({ ...content, radio: { ...content.radio, required } });

  const setRadioOrientation = (orientation: NodeFormRadioOrientation) =>
    patchContent({ ...content, radio: { ...content.radio, orientation } });

  const setRadioStyle = (style: CSSProperties) =>
    patchContent({ ...content, radio: { ...content.radio, style } });

  const options = content.radio.options ?? [];

  const setOption = (index: number, row: NodeFormRadioOption) => {
    const next = [...options];
    next[index] = row;
    patchContent({
      ...content,
      radio: { ...content.radio, options: next },
    });
  };

  const addOption = () => {
    patchContent({
      ...content,
      radio: {
        ...content.radio,
        options: [
          ...options,
          { value: `${options.length + 1}`, label: "Nouvelle option" },
        ],
      },
    });
  };

  const removeOption = (index: number) => {
    patchContent({
      ...content,
      radio: { ...content.radio, options: options.filter((_, i) => i !== index) },
    });
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <Base2Settings
                attributes={node.attributes}
                onChange={(attributes) =>
                  onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                }
              />
              <TabsList className="justify-center w-full">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsList className="justify-center w-full">
                <TabsTrigger value="container">Container</TabsTrigger>
                <TabsTrigger value="label">Label</TabsTrigger>
                <TabsTrigger value="radio">Radio</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="general">
                <div className="flex flex-col gap-2">
                  <Form.Group>
                    <Form.Label text="Nom du groupe (radio.name)" />
                    <Form.Input
                      value={content.radio.name ?? ""}
                      onChange={(name) => setRadioName(name)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Libellé du groupe (label.text)" />
                    <Form.Input
                      value={content.label.text ?? ""}
                      onChange={(text) => setLabelText(text)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Disposition" />
                    <Form.Select
                      value={content.radio.orientation ?? "vertical"}
                      onChange={(v) => setRadioOrientation(v as NodeFormRadioOrientation)}
                      options={orientationOptions}
                    />
                  </Form.Group>
                  <Form.Group>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!content.radio.required}
                        onChange={(e) => setRadioRequired(e.target.checked)}
                      />
                      Requis
                    </label>
                  </Form.Group>
                </div>
              </TabsContent>

              <TabsContent value="options">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Options (valeur, label)</span>
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      Ajouter
                    </Button>
                  </div>

                  {options.map((opt, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-1 mb-2 p-2 border rounded-md"
                    >
                      <div className="flex flex-col gap-1 flex-1"  >
                        <Form.Input value={opt.value} onChange={(value) => setOption(index, { ...opt, value })} placeholder="valeur" />
                        <Form.Input value={opt.label} onChange={(l) => setOption(index, { ...opt, label: l })} placeholder="libellé" />
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <IoClose />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="container">
                <div className="flex flex-1 flex-col gap-1">
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                </div>
              </TabsContent>

              <TabsContent value="label">
                <div className="flex flex-1 flex-col gap-1">
                  <Text2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                </div>
              </TabsContent>

              <TabsContent value="radio">
                <div className="flex flex-1 flex-col gap-1">
                  <Text2Settings themeOverrideSelector={THEME_SELECTORS.formRadioLabel} style={content.radio.style} onChange={setRadioStyle} />
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formRadioLabel} style={content.radio.style} onChange={setRadioStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formRadioLabel} style={content.radio.style} onChange={setRadioStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formRadioLabel} style={content.radio.style} onChange={setRadioStyle} />
                </div>
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
