import type { FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Object2Settings,
  Spacing2Settings,
} from "../Settings";
import Form from "../../components/form";
import { InputFile } from "../../components/form/InputFile";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const content = node.content ?? { src: "", poster: "" };

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
          <div className="flex flex-col gap-1 mt-2">
            <p className="node-block-title text-sm font-medium mb-1">Vidéo</p>
            <Form.Group className="mb-0">
              <Form.Label text="Source" />
              <InputFile
                type="text"
                value={content.src ?? ""}
                onChange={(value: string) => {
                  onChange({
                    ...node,
                    content: { ...content, src: value },
                  });
                }}
                acceptedTypes="video/*"
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label text="Poster" />
              <InputFile
                type="text"
                value={content.poster ?? ""}
                onChange={(value: string) => {
                  onChange({
                    ...node,
                    content: { ...content, poster: value },
                  });
                }}
                acceptedTypes="image/*"
                className="h-7 text-sm"
              />
            </Form.Group>
          </div>
        </>
      }
      content={
        <>
          <Object2Settings
            style={node.attributes?.style ?? {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Background2Settings
            style={node.attributes?.style ?? {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
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
        </>
      }
    />
  );
};

export default Settings;
