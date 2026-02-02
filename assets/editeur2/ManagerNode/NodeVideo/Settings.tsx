import type { FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { BaseSettings, ObjectSettings, SpacingSettings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

const Settings:FC<NodeSettingsProps>  = () => {

  const { node, onChange } = useNodeBuilderContext();
  const content = node.content;

  return (
    <>
      <BaseSettings />
      <Form.Group>
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
          acceptedTypes="video/*"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label text="Poster" />
        <InputFile
          type="text"
          value={content?.poster ?? ""}
          onChange={(value: string) => {
            onChange({
              ...node,
              content: { ...content, poster: value },
            })
          }}
          acceptedTypes="image/*"
        />
      </Form.Group>
      <SpacingSettings />
      <ObjectSettings />
    </>
  );
};

export default Settings;