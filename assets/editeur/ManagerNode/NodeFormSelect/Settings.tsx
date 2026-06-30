import { type FC, type CSSProperties } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import Form from "../../components/form";
import type { NodeFormOption, NodeFormSelectType } from "./index";
import { nodeFormSelectDefaultContent } from "./defaults";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Text2Settings, THEME_SELECTORS } from "../Settings";
import { Button } from "@/editeur/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { IoClose } from "react-icons/io5";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const field = node as NodeFormSelectType;

  // Compatibilité avec l’ancienne structure (legacy) : { name, label, required, placeholder, placeholderValue, options }
  const legacy = field.content as any;
  const legacyName = typeof legacy?.name === "string" ? legacy.name : undefined;
  const legacyLabelText = typeof legacy?.label === "string" ? legacy.label : undefined;
  const legacyRequired = typeof legacy?.required === "boolean" ? legacy.required : undefined;
  const legacyPlaceholder = typeof legacy?.placeholder === "string" ? legacy.placeholder : undefined;
  const legacyPlaceholderValue =
    typeof legacy?.placeholderValue === "string" ? legacy.placeholderValue : undefined;
  const legacyOptions = Array.isArray(legacy?.options) ? (legacy.options as any[]) : undefined;

  const content = {
    container: {
      ...nodeFormSelectDefaultContent.container,
      ...(field.content?.container ?? {}),
    },
    label: {
      ...nodeFormSelectDefaultContent.label,
      text: (field.content?.label?.text ?? legacyLabelText ?? nodeFormSelectDefaultContent.label.text) as string,
      style: {
        ...nodeFormSelectDefaultContent.label.style,
        ...(field.content?.label?.style ?? legacy?.label?.style ?? {}),
      },
    },
    select: {
      ...nodeFormSelectDefaultContent.select,
      name: (field.content?.select?.name ?? legacyName ?? nodeFormSelectDefaultContent.select.name) as string,
      placeholder: (field.content?.select?.placeholder ?? legacyPlaceholder ?? nodeFormSelectDefaultContent.select.placeholder) as string,
      required:
        field.content?.select?.required ?? legacyRequired ?? nodeFormSelectDefaultContent.select.required,
      defaultValue:
        field.content?.select?.defaultValue ??
        legacyPlaceholderValue ??
        nodeFormSelectDefaultContent.select.defaultValue,
      style: {
        ...nodeFormSelectDefaultContent.select.style,
        ...(field.content?.select?.style ?? {}),
      },
      options:
        field.content?.select?.options ??
        (legacyOptions ?? nodeFormSelectDefaultContent.select.options),
    },
  } as NonNullable<NodeFormSelectType["content"]>;

  const patch = (
    next: NonNullable<NodeFormSelectType["content"]>
  ) =>
    onChange({
      ...node,
      content: next,
    });

  const setContainerStyle = (style: CSSProperties) =>
    patch({ ...content, container: { ...content.container, style } });

  const setLabelText = (text: string) =>
    patch({ ...content, label: { ...content.label, text } });

  const setLabelStyle = (style: CSSProperties) =>
    patch({ ...content, label: { ...content.label, style } });

  const setSelectName = (name: string) =>
    patch({ ...content, select: { ...content.select, name } });

  const setSelectPlaceholder = (placeholder: string) =>
    patch({ ...content, select: { ...content.select, placeholder } });

  const setSelectDefaultValue = (defaultValue: string) =>
    patch({
      ...content,
      select: { ...content.select, defaultValue },
    });

  const setSelectRequired = (required: boolean) =>
    patch({ ...content, select: { ...content.select, required } });

  const setSelectStyle = (style: CSSProperties) =>
    patch({ ...content, select: { ...content.select, style } });

  const options = content.select.options ?? [];

  const setOptions = (nextOptions: NodeFormOption[]) =>
    patch({ ...content, select: { ...content.select, options: nextOptions } });

  const setOption = (index: number, row: NodeFormOption) => {
    const next = [...options];
    next[index] = row;
    setOptions(next);
  };

  const addOption = () => {
    setOptions([...options, { value: `opt${options.length + 1}`, label: "Nouvelle option" }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="container">Container</TabsTrigger>
                <TabsTrigger value="label">Label</TabsTrigger>
                <TabsTrigger value="select">Select</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes) =>
                    onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                  }
                />
                <div className="flex flex-col gap-2">
                  <Form.Group>
                    <Form.Label text="Libellé (label.text)" />
                    <Form.Input
                      value={content.label.text ?? ""}
                      onChange={(text) => setLabelText(text)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Nom (select.name)" />
                    <Form.Input
                      value={content.select.name ?? ""}
                      onChange={(name) => setSelectName(name)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Texte option vide (placeholder)" />
                    <Form.Input
                      value={content.select.placeholder ?? ""}
                      onChange={(placeholder) => setSelectPlaceholder(placeholder)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Valeur de l’option vide" />
                    <Form.Input
                      value={content.select.defaultValue ?? ""}
                      onChange={(defaultValue) => setSelectDefaultValue(defaultValue)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!content.select.required}
                        onChange={(e) => setSelectRequired(e.target.checked)}
                      />
                      Requis
                    </label>
                  </Form.Group>
                </div>
              </TabsContent>
            </>
          }
          content={
            <>
              <TabsContent value="options" className="mt-0">
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

              <TabsContent value="container" className="mt-0">
                <div className="flex flex-1 flex-col gap-1">
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formField} style={content.container.style} onChange={setContainerStyle} />
                </div>
              </TabsContent>

              <TabsContent value="label" className="mt-0">
                <div className="flex flex-1 flex-col gap-1">
                  <Text2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formLabel} style={content.label.style} onChange={setLabelStyle} />
                </div>
              </TabsContent>

              <TabsContent value="select" className="mt-0">
                <div className="flex flex-1 flex-col gap-1">
                  <Text2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.select.style} onChange={setSelectStyle} />
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.select.style} onChange={setSelectStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.select.style} onChange={setSelectStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.select.style} onChange={setSelectStyle} />
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
