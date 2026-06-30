import { type FC, type CSSProperties } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import Form from "../../components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeFormInputHtmlType, NodeFormInputType } from "./index";
import { nodeFormInputDefaultContent } from "./defaults";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Text2Settings,
  THEME_SELECTORS,
} from "../Settings";

const inputTypeOptions: { value: NodeFormInputHtmlType; label: string }[] = [
  { value: "text", label: "Texte" },
  { value: "email", label: "Email" },
  { value: "number", label: "Nombre" },
  { value: "tel", label: "Téléphone" }
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const field = node as NodeFormInputType;

  const content = {
    ...nodeFormInputDefaultContent,
    ...field.content,
    container: { ...nodeFormInputDefaultContent.container, ...(field.content?.container ?? {}) },
    label: { ...nodeFormInputDefaultContent.label, ...(field.content?.label ?? {}) },
    input: { ...nodeFormInputDefaultContent.input, ...(field.content?.input ?? {}) },
  } as NonNullable<NodeFormInputType["content"]>;

  const patchContent = (next: NonNullable<NodeFormInputType["content"]>) =>
    onChange({
      ...node,
      content: next,
    });

  const setContainerStyle = (style: CSSProperties) =>
    patchContent({ ...content, container: { ...content.container, style } });

  const setLabelText = (text: string) =>
    patchContent({ ...content, label: { ...content.label, text } });

  const setLabelStyle = (style: CSSProperties) =>
    patchContent({ ...content, label: { ...content.label, style } });

  const setInputType = (type: NodeFormInputHtmlType) =>
    patchContent({ ...content, input: { ...content.input, type } });

  const setInputName = (name: string) =>
    patchContent({ ...content, input: { ...content.input, name } });

  const setInputPlaceholder = (placeholder: string) =>
    patchContent({
      ...content,
      input: { ...content.input, placeholder },
    });

  const setInputDefaultValue = (defaultValue: string) =>
    patchContent({ ...content, input: { ...content.input, defaultValue } });

  const setInputRequired = (required: boolean) =>
    patchContent({ ...content, input: { ...content.input, required } });

  const setInputStyle = (style: CSSProperties) =>
    patchContent({ ...content, input: { ...content.input, style } });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
                <TabsTrigger value="label">Label</TabsTrigger>
                <TabsTrigger value="input">Input</TabsTrigger>
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
                    <Form.Input value={content.label.text} onChange={(text) => setLabelText(text)} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Nom (input.name)" />
                    <Form.Input
                      value={content.input.name}
                      onChange={(name) => setInputName(name)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Type de champ" />
                    <Form.Select
                      value={content.input.type ?? "text"}
                      onChange={(v) => setInputType(v as NodeFormInputHtmlType)}
                      options={inputTypeOptions}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Placeholder" />
                    <Form.Input
                      value={content.input.placeholder ?? ""}
                      onChange={(placeholder) => setInputPlaceholder(placeholder)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label text="Valeur par défaut" />
                    <Form.Input
                      value={content.input.defaultValue ?? ""}
                      onChange={(defaultValue) => setInputDefaultValue(defaultValue)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!content.input.required}
                        onChange={(e) => setInputRequired(e.target.checked)}
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

              <TabsContent value="input" className="mt-0">
                <div className="flex flex-1 flex-col gap-1">
                  <Text2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.input.style} onChange={setInputStyle} />
                  <Background2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.input.style} onChange={setInputStyle} />
                  <Border2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.input.style} onChange={setInputStyle} />
                  <Spacing2Settings themeOverrideSelector={THEME_SELECTORS.formControl} style={content.input.style} onChange={setInputStyle} />
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
