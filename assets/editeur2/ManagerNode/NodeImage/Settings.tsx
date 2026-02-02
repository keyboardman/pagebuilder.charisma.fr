
import { type FC } from "react";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { BaseSettings, ObjectSettings, SpacingSettings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";

const Settings:FC<NodeSettingsProps> = () => {

  const { node, onChange } = useNodeBuilderContext();
  const content = node.content;

  return (
    <>
      <BaseSettings />

      <div className="flex flex-col gap-1">
        <Form.Group className="mb-0">
          <Form.Label text="Source" />
          <InputFile
            type="text"
            value={content?.src ?? ""}
            onChange={(value: string) => {
              onChange({
                ...node,
                content: { ...content, src: value },
              })
            }}
            acceptedTypes="image/*"
            className="h-7 text-sm"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label text="Alt" />
          <Form.Input
            type="text"
            value={content?.alt ?? ""}
            onChange={(value) => {
              onChange({
                ...node,
                content: { ...content, alt: value },
              })
            }}
            className="h-7 text-sm"
          />
        </Form.Group>
        <hr className="border-border/30 mb-2 mt-1"/>
      </div>
      <ObjectSettings />
      <hr className="border-border/30 mb-2 mt-2"/>
      <SpacingSettings />
    </>
  );
}

export default Settings;